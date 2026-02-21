"""
Call the Claude API ("the cloud") to generate a specialized prompt
for a local agent that sets up a multi-agent parallel structure.
"""

import anthropic


def generate_multi_agent_prompt() -> str:
    """Ask Claude to craft a prompt for a local agent to set up parallel subagents."""
    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=(
            "You are an expert prompt engineer. Your job is to produce a single, "
            "self-contained prompt that will be sent to a Claude-based agent running "
            "on the user's computer (via the Claude Agent SDK). The agent has access "
            "to built-in tools: Read, Write, Edit, Bash, Glob, Grep, and Task "
            "(for launching subagents). The prompt you generate must instruct the "
            "agent to set up a project structure with multiple subagents that work "
            "in parallel. Output ONLY the prompt text—no extra commentary."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    "Generate a prompt that instructs my local agent to:\n"
                    "1. Create a project directory layout suitable for a multi-agent system.\n"
                    "2. Define at least 3 specialized subagents (e.g., code-writer, "
                    "code-reviewer, test-runner) that can run in parallel.\n"
                    "3. Write a Python orchestrator script that uses the Claude Agent SDK "
                    "to launch all subagents concurrently using asyncio.gather.\n"
                    "4. Each subagent should have its own system prompt, allowed tools, "
                    "and a clearly scoped responsibility.\n"
                    "5. Include a configuration file (agents_config.json) that defines "
                    "each agent's name, description, tools, and prompt.\n"
                    "The generated prompt should be precise, actionable, and ready to "
                    "paste directly into the agent."
                ),
            }
        ],
    )

    for block in response.content:
        if block.type == "text":
            return block.text

    return ""


if __name__ == "__main__":
    prompt = generate_multi_agent_prompt()
    print("=" * 72)
    print("GENERATED PROMPT FOR LOCAL AGENT")
    print("=" * 72)
    print(prompt)

    with open("generated_prompt.txt", "w") as f:
        f.write(prompt)
    print("\n[Saved to generated_prompt.txt]")
