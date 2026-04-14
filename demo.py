#!/usr/bin/env python3
"""
Demo script - runs the CRIT tool non-interactively to show the full flow.
No API key needed; the API call is simulated.
"""

from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table

from crit_tool.engine import CRITPrompt
from crit_tool.cli import BANNER

console = Console()


def main():
    # ── Banner ──
    console.print(Panel(BANNER, style="bold cyan", subtitle="Dynamic Prompt Engine"))
    console.print()

    # ── 1. Build a prompt from scratch ──
    console.print("[bold magenta]═══ DEMO 1: Build a CRIT Prompt ═══[/bold magenta]\n")

    prompt = CRITPrompt(
        role="Senior Python architect with expertise in API design and cloud infrastructure",
        context=(
            "We are building a multi-tenant SaaS platform that serves 50K+ users. "
            "The current monolith needs to be decomposed into microservices. "
            "We use Python 3.12, FastAPI, PostgreSQL, and deploy on AWS ECS."
        ),
        interview=[
            "What are the highest-traffic endpoints that should be extracted first?",
            "Are there shared database tables that create tight coupling?",
            "What is the acceptable downtime during migration?",
        ],
        task=(
            "Generate 3 high-impact, non-obvious strategies to decompose this "
            "monolith into microservices while maintaining zero downtime. "
            "Include a migration sequence and risk assessment for each strategy."
        ),
    )

    # Show status
    console.print("[bold]Prompt Status:[/bold]")
    console.print(prompt.summary())
    console.print()

    # Show compiled output
    compiled = prompt.compile()
    console.print(Panel(
        Markdown(compiled),
        title="[bold green]Compiled CRIT Prompt[/bold green]",
        border_style="green",
    ))

    # ── 2. Load all templates ──
    console.print("\n[bold magenta]═══ DEMO 2: Template System ═══[/bold magenta]\n")

    templates = ["code_reviewer", "business_analyst", "creative_writer"]
    table = Table(title="Loaded Templates", show_lines=True)
    table.add_column("Template", style="cyan", width=20)
    table.add_column("Role", style="green", max_width=50)
    table.add_column("Interview Qs", style="yellow", justify="center", width=12)
    table.add_column("Task Preview", style="dim", max_width=50)

    for name in templates:
        t = CRITPrompt.from_json(f"templates/{name}.json")
        table.add_row(
            name,
            t.role[:50] + "..." if len(t.role) > 50 else t.role,
            str(len(t.interview)),
            t.task[:50] + "..." if len(t.task) > 50 else t.task,
        )

    console.print(table)

    # ── 3. Show a template fully compiled ──
    console.print("\n[bold magenta]═══ DEMO 3: Compiled Template ═══[/bold magenta]\n")
    reviewer = CRITPrompt.from_json("templates/code_reviewer.json")
    console.print(Panel(
        Markdown(reviewer.compile()),
        title="[bold blue]code_reviewer.json → Compiled[/bold blue]",
        border_style="blue",
    ))

    # ── 4. Simulate API call ──
    console.print("\n[bold magenta]═══ DEMO 4: API Execution (simulated) ═══[/bold magenta]\n")

    simulated_response = """\
## Microservice Decomposition Strategies

### Strategy 1: Strangler Fig with Event Sourcing
**Impact**: High | **Risk**: Medium

Extract the highest-traffic read endpoints first using the Strangler Fig pattern, \
backed by an event bus (AWS EventBridge). This lets the monolith and new services \
coexist, routing traffic gradually via an API gateway.

**Migration sequence**: Auth service → User profiles → Product catalog → Orders

---

### Strategy 2: Database-Per-Service via CDC (Change Data Capture)
**Impact**: High | **Risk**: Medium-High

Use Debezium/DMS to stream changes from the shared PostgreSQL database to \
service-specific databases. This breaks the tight DB coupling without a big-bang migration.

**Migration sequence**: Set up CDC → Replicate shared tables → Redirect writes → Drop legacy tables

---

### Strategy 3: Branch by Abstraction with Feature Flags
**Impact**: Medium-High | **Risk**: Low

Introduce an abstraction layer over tightly-coupled modules. Use feature flags \
(LaunchDarkly/Unleash) to toggle between monolith and microservice implementations \
at runtime — enabling instant rollback.

**Migration sequence**: Abstract interfaces → Deploy parallel service → Flag-based routing → Decommission old code
"""

    with console.status("[bold cyan]Calling Claude API...[/bold cyan]", spinner="dots"):
        import time
        time.sleep(2)  # simulate latency

    console.print(Panel(
        Markdown(simulated_response),
        title="[bold green]Claude Response[/bold green]",
        border_style="green",
    ))

    # ── Done ──
    console.print("\n[bold green]Demo complete.[/bold green]")
    console.print(
        "[dim]To run with a real API key: "
        "export ANTHROPIC_API_KEY='sk-ant-...' && python run.py[/dim]\n"
    )


if __name__ == "__main__":
    main()
