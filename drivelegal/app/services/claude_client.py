"""LLM wrapper.

Production backend: Anthropic Claude — used when ANTHROPIC_API_KEY is set.
Fallback backend: Ollama (local) — used during dev/demo when Anthropic is not configured.
Final fallback: deterministic offline answer built from the retrieved RAG chunks.

The module is named `claude_client` for routers that already import it; the
public surface (`answer_with_rag`, `translate`) is unchanged. Strategy order:
  Tier 1 — Anthropic (if anthropic_api_key is set and non-empty)
  Tier 2 — Ollama (if Anthropic is not configured or fails)
  Tier 3 — Offline deterministic answer (if Ollama also fails)
"""

from __future__ import annotations

import logging
from typing import Optional

import httpx

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


def _build_user_prompt(question: str, location: Optional[str], chunks: list[dict]) -> str:
    parts = []
    if location:
        parts.append(f"User location: {location}")
    if chunks:
        parts.append("Context from legal database:")
        for c in chunks:
            parts.append(
                f"- [{c.get('section','?')}] {c.get('title','')}\n  {c.get('text','')}"
            )
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


def _anthropic_chat(system: str, user: str) -> Optional[str]:
    """Call Anthropic Messages API with prompt caching on the system prompt.

    Returns None if not configured or if the call fails, so callers can fall back.
    """
    if not settings.anthropic_api_key:
        return None
    try:
        import anthropic  # noqa: PLC0415  (local import keeps startup fast when key absent)

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        resp = client.messages.create(
            model=settings.claude_model,
            max_tokens=600,
            system=[
                {
                    "type": "text",
                    "text": system,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": user}],
        )
        return (resp.content[0].text if resp.content else "").strip() or None
    except Exception as e:
        log.warning("Anthropic call failed (%s): %s", type(e).__name__, e)
        return None


def _ollama_chat(system: str, user: str) -> Optional[str]:
    """Call Ollama's /api/chat. Returns None on any failure so callers can fall back."""
    url = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "options": {"temperature": 0.2, "num_predict": 600},
    }
    try:
        r = httpx.post(url, json=payload, timeout=settings.ollama_timeout_s)
        r.raise_for_status()
        data = r.json()
        # Ollama /api/chat returns {"message": {"role": "...", "content": "..."}, ...}
        content = (data.get("message") or {}).get("content", "")
        return content.strip() or None
    except Exception as e:
        log.warning("Ollama call failed (%s): %s", type(e).__name__, e)
        return None


def _llm_chat(system: str, user: str) -> Optional[str]:
    """3-tier LLM dispatch: Anthropic → Ollama → None."""
    # Tier 1: Anthropic (production)
    if settings.anthropic_api_key:
        out = _anthropic_chat(system, user)
        if out is not None:
            return out
        log.warning("Falling through from Anthropic to Ollama")

    # Tier 2: Ollama (local dev)
    out = _ollama_chat(system, user)
    if out is not None:
        return out

    # Tier 3: caller handles offline fallback
    log.warning("Falling through from Ollama to offline fallback")
    return None


def answer_with_rag(
    question: str,
    chunks: list[dict],
    location: Optional[str] = None,
    language: str = "en",
) -> str:
    """Return a grounded answer string. Uses Anthropic if configured, then Ollama, then offline."""
    user_msg = _build_user_prompt(question, location, chunks)
    if language == "hi":
        user_msg += "\n\nReply in Hindi (Devanagari script). Do not use English."
    else:
        user_msg += "\n\nReply in English. Do not use Hindi or any other language."

    out = _llm_chat(SYSTEM_PROMPT, user_msg)
    if out:
        return out
    return _offline_answer(question, location, chunks)


def translate(text: str, target_lang: str) -> str:
    """Translate text to target language (en/hi). No-op for English."""
    if target_lang == "en" or not text:
        return text

    system = (
        "Translate the user's text to Hindi (Devanagari script). "
        "Output only the translation — no preface, no quotes, no explanation."
    )
    out = _llm_chat(system, text)
    return out or text
