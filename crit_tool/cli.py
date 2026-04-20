"""
CRIT Dynamic CLI

Interactive command-line interface for building and running
CRIT (Context, Role, Interview, Task) prompts against Claude.
"""

import os
import sys
import json
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.markdown import Markdown
from rich.table import Table
from rich.text import Text

from .engine import CRITPrompt, CRITEngine

console = Console()

BANNER = r"""
   ██████╗██████╗ ██╗████████╗
  ██╔════╝██╔══██╗██║╚══██╔══╝
  ██║     ██████╔╝██║   ██║
  ██║     ██╔══██╗██║   ██║
  ╚██████╗██║  ██║██║   ██║
   ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝
  Context · Role · Interview · Task
"""

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"


def show_banner():
    console.print(Panel(BANNER, style="bold cyan", subtitle="Dynamic Prompt Engine"))


def get_api_key() -> str:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        key = Prompt.ask(
            "[yellow]Enter your Anthropic API key[/yellow]",
            password=True,
        )
    if not key:
        console.print("[red]No API key provided. Exiting.[/red]")
        sys.exit(1)
    return key


def pick_model() -> str:
    table = Table(title="Available Models", show_header=True)
    table.add_column("#", style="cyan", width=4)
    table.add_column("Model", style="green")
    table.add_column("Best For", style="dim")

    models = [
        ("claude-sonnet-4-20250514", "Fast, balanced (default)"),
        ("claude-opus-4-20250514", "Deep reasoning, complex tasks"),
        ("claude-haiku-3-20250307", "Speed, lightweight tasks"),
    ]

    for i, (name, desc) in enumerate(models, 1):
        table.add_row(str(i), name, desc)

    console.print(table)
    choice = Prompt.ask("Pick a model", choices=["1", "2", "3"], default="1")
    return models[int(choice) - 1][0]


def build_prompt_interactive() -> CRITPrompt:
    """Walk the user through building a CRIT prompt step by step."""
    prompt = CRITPrompt()

    console.print("\n[bold magenta]--- STEP 1: ROLE ---[/bold magenta]")
    console.print("[dim]Who should the AI be? (e.g., 'Senior Python architect', "
                  "'Marketing strategist with 10 years experience')[/dim]")
    prompt.role = Prompt.ask("[cyan]Role[/cyan]")

    console.print("\n[bold magenta]--- STEP 2: CONTEXT ---[/bold magenta]")
    console.print("[dim]What background info does the AI need? Domain, constraints, "
                  "audience, existing state of things.[/dim]")
    prompt.context = Prompt.ask("[cyan]Context[/cyan]")

    console.print("\n[bold magenta]--- STEP 3: INTERVIEW ---[/bold magenta]")
    console.print("[dim]Add clarifying questions the AI should consider before acting. "
                  "Type 'done' when finished.[/dim]")
    while True:
        q = Prompt.ask("[cyan]Question (or 'done')[/cyan]")
        if q.lower() == "done":
            break
        prompt.interview.append(q)

    console.print("\n[bold magenta]--- STEP 4: TASK ---[/bold magenta]")
    console.print("[dim]What specific deliverable do you want? Be precise.[/dim]")
    prompt.task = Prompt.ask("[cyan]Task[/cyan]")

    return prompt


def load_template() -> CRITPrompt:
    """Load a CRIT prompt from a JSON template file."""
    if not TEMPLATES_DIR.exists():
        console.print("[red]No templates directory found.[/red]")
        return build_prompt_interactive()

    templates = list(TEMPLATES_DIR.glob("*.json"))
    if not templates:
        console.print("[yellow]No templates found. Building from scratch.[/yellow]")
        return build_prompt_interactive()

    table = Table(title="Available Templates")
    table.add_column("#", style="cyan", width=4)
    table.add_column("Template", style="green")
    table.add_column("Description", style="dim")

    for i, t in enumerate(templates, 1):
        data = json.loads(t.read_text())
        desc = data.get("metadata", {}).get("description", "No description")
        table.add_row(str(i), t.stem, desc)

    console.print(table)
    choice = Prompt.ask(
        "Pick a template",
        choices=[str(i) for i in range(1, len(templates) + 1)],
    )
    return CRITPrompt.from_json(str(templates[int(choice) - 1]))


def preview_prompt(prompt: CRITPrompt):
    """Show the compiled prompt before sending."""
    compiled = prompt.compile()
    console.print("\n")
    console.print(Panel(
        Markdown(compiled),
        title="[bold green]Compiled CRIT Prompt[/bold green]",
        border_style="green",
    ))
    console.print(f"\n[dim]{prompt.summary()}[/dim]\n")


def run_single(engine: CRITEngine, prompt: CRITPrompt):
    """Send the CRIT prompt and display the response."""
    with console.status("[bold cyan]Thinking...[/bold cyan]", spinner="dots"):
        response = engine.run(prompt)

    console.print(Panel(
        Markdown(response),
        title="[bold blue]Response[/bold blue]",
        border_style="blue",
    ))
    return response


def run_interview_mode(engine: CRITEngine, prompt: CRITPrompt):
    """Multi-turn interview mode: the AI asks questions, user answers, then final task."""
    conversation = []

    console.print("\n[bold yellow]INTERVIEW MODE[/bold yellow]")
    console.print("[dim]The AI will ask clarifying questions based on your prompt. "
                  "Answer them to refine the output.[/dim]\n")

    # Round 1: AI asks questions
    with console.status("[bold cyan]Generating interview questions...[/bold cyan]"):
        questions_response = engine.interview_loop(prompt)

    console.print(Panel(Markdown(questions_response), title="AI Questions", border_style="yellow"))
    conversation.append({"role": "assistant", "content": questions_response})

    # Collect answers
    console.print("\n[bold]Your answers:[/bold]")
    answers = Prompt.ask("[cyan]Respond to the questions above[/cyan]")
    conversation.append({"role": "user", "content": answers})

    # Round 2: Execute final task with full context
    final_prompt = CRITPrompt(
        context=prompt.context + f"\n\nAdditional context from interview:\n{answers}",
        role=prompt.role,
        interview=[],
        task=prompt.task,
    )

    with console.status("[bold cyan]Generating final response...[/bold cyan]"):
        response = engine.run_with_conversation(final_prompt, conversation)

    console.print(Panel(
        Markdown(response),
        title="[bold green]Final Response[/bold green]",
        border_style="green",
    ))
    return response


def main():
    show_banner()

    api_key = get_api_key()
    model = pick_model()
    engine = CRITEngine(api_key=api_key, model=model)

    console.print(f"\n[green]Engine ready[/green] | Model: [cyan]{model}[/cyan]\n")

    while True:
        console.print("[bold]What would you like to do?[/bold]")
        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_row("[cyan]1[/cyan]", "Build a new CRIT prompt")
        table.add_row("[cyan]2[/cyan]", "Load a template")
        table.add_row("[cyan]3[/cyan]", "Interview mode (multi-turn)")
        table.add_row("[cyan]4[/cyan]", "Quit")
        console.print(table)

        action = Prompt.ask("\nChoice", choices=["1", "2", "3", "4"], default="1")

        if action == "4":
            console.print("[dim]Goodbye.[/dim]")
            break

        if action == "2":
            prompt = load_template()
        else:
            prompt = build_prompt_interactive()

        preview_prompt(prompt)

        if not Confirm.ask("Send this prompt?", default=True):
            if Confirm.ask("Save as template?", default=False):
                name = Prompt.ask("Template name")
                prompt.metadata["description"] = Prompt.ask("Short description")
                TEMPLATES_DIR.mkdir(exist_ok=True)
                prompt.save(str(TEMPLATES_DIR / f"{name}.json"))
                console.print(f"[green]Saved to templates/{name}.json[/green]")
            continue

        if action == "3":
            run_interview_mode(engine, prompt)
        else:
            run_single(engine, prompt)

        # Post-run options
        if Confirm.ask("\nSave this prompt as a template?", default=False):
            name = Prompt.ask("Template name")
            prompt.metadata["description"] = Prompt.ask("Short description")
            TEMPLATES_DIR.mkdir(exist_ok=True)
            prompt.save(str(TEMPLATES_DIR / f"{name}.json"))
            console.print(f"[green]Saved to templates/{name}.json[/green]")

        if not Confirm.ask("\nRun another prompt?", default=True):
            console.print("[dim]Goodbye.[/dim]")
            break


if __name__ == "__main__":
    main()
