"""Thin wrapper around the Anthropic SDK.

When no API key is configured, returns a deterministic offline response built
from the retrieved RAG chunks. This keeps the demo working without network /
keys, and is also what the tests exercise.
"""

from __future__ import annotations

import logging
from typing import Optional

from app.config import settings

log = logging.getLogger(__name__)


SYSTEM_PROMPT = """You are DriveLegal, an AI assistant that provides accurate, location-specific information about traffic laws and fines.

Rules:
1. Answer ONLY using the provided legal documents and fine database context.
2. Cite the specific law section (e.g., "MV Act Section 129") whenever stating a rule or fine.
3. State whether the offence is compoundable.
4. Always name the location the answer applies to.
5. If the context does not cover the question, say "I don't have verified data for that" — do not guess fine amounts.
6. Keep answers concise (under 120 words) in plain language.
7. If the user writes in Hindi or asks for Hindi, respond in Hindi.
"""


def _build_prompt(question: str, location: Optional[str], chunks: list[dict]) -> str:
    parts = []
    if location:
        parts.append(f"User location: {location}")
    if chunks:
        parts.append("Context from legal database:")
        for c in chunks:
            parts.append(f"- [{c.get('section','?')}] {c.get('title','')}\n  {c.get('text','')}")
    else:
        parts.append("Context from legal database: (no matching documents)")
    parts.append(f"\nUser question: {question}")
    return "\n\n".join(parts)


def _offline_answer(question: str, location: Optional[str], chunks: list[dict]) -> str:
    if not chunks:
        return (
            "I don't have verified data for that question in my legal database. "
            "Please check the official source for your jurisdiction "
            "(e.g., parivahan.gov.in for India, gov.uk for the UK)."
        )
    top = chunks[0]
    loc_tag = f" in {location}" if location else ""
    snippet = top["text"]
    if len(snippet) > 320:
        snippet = snippet[:317] + "..."
    return (
        f"Based on {top.get('section','the applicable law')}{loc_tag}: {snippet} "
        f"(Source: {top.get('source','official records')}.)"
    )


def answer_with_rag(
    question: str,
    chunks: list[dict],
    location: Optional[str] = None,
    language: str = "en",
) -> str:
    """Return a grounded answer string. Uses Claude if key configured, else offline."""
    if not settings.anthropic_api_key:
        return _offline_answer(question, location, chunks)

    try:
        import anthropic
    except ImportError:
        log.warning("anthropic SDK not installed; using offline answer")
        return _offline_answer(question, location, chunks)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    user_msg = _build_prompt(question, location, chunks)
    if language == "hi":
        user_msg += "\n\nReply in Hindi (Devanagari script)."

    try:
        msg = client.messages.create(
            model=settings.claude_model,
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        # Concatenate text blocks.
        return "".join(b.text for b in msg.content if getattr(b, "type", None) == "text").strip()
    except Exception as e:  # pragma: no cover
        log.exception("Claude call failed: %s", e)
        return _offline_answer(question, location, chunks)


def translate(text: str, target_lang: str) -> str:
    """Translate text to target language (en/hi). No-op if same or no key."""
    if target_lang == "en" or not settings.anthropic_api_key:
        return text
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        msg = client.messages.create(
            model=settings.claude_model,
            max_tokens=600,
            system="Translate the user's text to Hindi (Devanagari). Output only the translation, no preface.",
            messages=[{"role": "user", "content": text}],
        )
        return "".join(b.text for b in msg.content if getattr(b, "type", None) == "text").strip()
    except Exception:  # pragma: no cover
        return text
