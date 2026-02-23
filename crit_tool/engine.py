"""
CRIT Prompt Engine

Implements the CRIT methodology:
  C - Context    : Background information, domain, constraints
  R - Role       : Who the AI should act as (persona, expertise)
  I - Interview  : Clarifying questions / interactive refinement
  T - Task       : The specific deliverable or action requested
"""

from dataclasses import dataclass, field
from typing import Optional
import json


@dataclass
class CRITPrompt:
    """A structured prompt built with the CRIT methodology."""

    context: str = ""
    role: str = ""
    interview: list[str] = field(default_factory=list)
    task: str = ""
    metadata: dict = field(default_factory=dict)

    def compile(self) -> str:
        """Compile all CRIT sections into a single structured prompt."""
        sections = []

        if self.role:
            sections.append(f"## ROLE\n{self.role}")

        if self.context:
            sections.append(f"## CONTEXT\n{self.context}")

        if self.interview:
            q_block = "\n".join(f"- {q}" for q in self.interview)
            sections.append(
                f"## INTERVIEW\n"
                f"Before proceeding, consider these clarifying points:\n{q_block}"
            )

        if self.task:
            sections.append(f"## TASK\n{self.task}")

        return "\n\n".join(sections)

    def to_dict(self) -> dict:
        return {
            "context": self.context,
            "role": self.role,
            "interview": self.interview,
            "task": self.task,
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "CRITPrompt":
        return cls(
            context=data.get("context", ""),
            role=data.get("role", ""),
            interview=data.get("interview", []),
            task=data.get("task", ""),
            metadata=data.get("metadata", {}),
        )

    @classmethod
    def from_json(cls, path: str) -> "CRITPrompt":
        with open(path) as f:
            return cls.from_dict(json.load(f))

    def save(self, path: str) -> None:
        with open(path, "w") as f:
            json.dump(self.to_dict(), f, indent=2)

    def is_complete(self) -> bool:
        return bool(self.context and self.role and self.task)

    def summary(self) -> str:
        parts = []
        parts.append(f"  Role:      {'SET' if self.role else 'EMPTY'}")
        parts.append(f"  Context:   {'SET' if self.context else 'EMPTY'}")
        parts.append(f"  Interview: {len(self.interview)} question(s)")
        parts.append(f"  Task:      {'SET' if self.task else 'EMPTY'}")
        return "\n".join(parts)


class CRITEngine:
    """Orchestrates building and running CRIT prompts against the Claude API."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-20250514"):
        self.api_key = api_key
        self.model = model
        self._client = None

    @property
    def client(self):
        if self._client is None:
            import anthropic
            self._client = anthropic.Anthropic(api_key=self.api_key)
        return self._client

    def run(
        self,
        prompt: CRITPrompt,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        system: Optional[str] = None,
    ) -> str:
        """Compile and send a CRIT prompt to Claude, return the response."""
        compiled = prompt.compile()

        system_msg = system or (
            "You are an AI assistant responding to a structured CRIT prompt. "
            "Follow the Role, Context, Interview, and Task sections precisely."
        )

        message = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_msg,
            messages=[{"role": "user", "content": compiled}],
        )

        return message.content[0].text

    def interview_loop(
        self,
        prompt: CRITPrompt,
        max_tokens: int = 4096,
    ) -> str:
        """
        Run an interactive interview loop:
        1. Send the prompt with interview questions enabled
        2. The model asks clarifying questions
        3. User answers are folded back in
        4. Final task is executed with full context
        """
        interview_prompt = CRITPrompt(
            context=prompt.context,
            role=prompt.role,
            interview=prompt.interview,
            task=(
                "Based on the interview questions above, ask me those clarifying "
                "questions one at a time so we can refine the final deliverable. "
                "Be concise."
            ),
        )

        return self.run(interview_prompt, max_tokens=max_tokens)

    def run_with_conversation(
        self,
        prompt: CRITPrompt,
        conversation: list[dict],
        max_tokens: int = 4096,
        temperature: float = 0.7,
    ) -> str:
        """Run a CRIT prompt with prior conversation context (for multi-turn)."""
        compiled = prompt.compile()

        system_msg = (
            "You are an AI assistant engaged in a CRIT methodology session. "
            "Follow the Role, Context, Interview, and Task sections precisely."
        )

        messages = list(conversation)
        messages.append({"role": "user", "content": compiled})

        message = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_msg,
            messages=messages,
        )

        return message.content[0].text
