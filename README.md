# CRIT - Dynamic Prompt Methodology Tool

A CLI tool that implements the **CRIT** prompt engineering framework to dynamically build structured prompts and run them against the Claude API.

```
   ██████╗██████╗ ██╗████████╗
  ██╔════╝██╔══██╗██║╚══██╔══╝
  ██║     ██████╔╝██║   ██║
  ██║     ██╔══██╗██║   ██║
  ╚██████╗██║  ██║██║   ██║
   ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝
```

## The CRIT Framework

| Section | Purpose |
|---------|---------|
| **C**ontext | Background info, domain, constraints, audience |
| **R**ole | Who the AI should be (persona, expertise, tone) |
| **I**nterview | Clarifying questions for interactive refinement |
| **T**ask | The specific deliverable or action to produce |

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set your API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Run the tool
python run.py
# or
python -m crit_tool
```

## Features

- **Interactive prompt builder** - step-by-step CRIT construction
- **Interview mode** - multi-turn conversation where the AI asks clarifying questions before executing
- **Template system** - save and load reusable CRIT prompt templates
- **Model selection** - choose between Sonnet, Opus, and Haiku
- **Rich CLI** - colored output, spinners, markdown rendering

## Templates

Pre-built templates are in the `templates/` directory:

| Template | Description |
|----------|-------------|
| `code_reviewer` | Production code review with security focus |
| `business_analyst` | Market entry analysis for startups |
| `creative_writer` | Technical blog posts for developers |

Create your own by saving prompts during a session, or drop a JSON file in `templates/`:

```json
{
  "context": "Your background info here",
  "role": "The AI persona",
  "interview": ["Question 1?", "Question 2?"],
  "task": "What you want delivered",
  "metadata": { "description": "Short description" }
}
```

## Usage as a Library

```python
from crit_tool.engine import CRITPrompt, CRITEngine

engine = CRITEngine(api_key="sk-ant-...", model="claude-sonnet-4-20250514")

prompt = CRITPrompt(
    context="Building a REST API for an e-commerce platform",
    role="Senior API architect",
    interview=["What authentication method?", "Expected request volume?"],
    task="Design the API schema with endpoint definitions and example payloads",
)

response = engine.run(prompt)
print(response)
```

## Project Structure

```
crit_tool/
  __init__.py       # Package init
  engine.py         # Core CRIT engine and API client
  cli.py            # Interactive CLI interface
  __main__.py       # python -m support
templates/          # Reusable CRIT prompt templates
run.py              # Entry point
```
