"""Pre-warm heavy assets at deploy time.

Run: python -m scripts.prewarm

Steps:
  1. Initialize the ChromaDB embedding function (downloads ONNX model if needed).
  2. Call app.services.rag.ingest() — idempotent: it deletes existing docs and
     re-indexes from CORPUS each time, so safe to call on every cold start.
  3. If ANTHROPIC_API_KEY is set, send a 1-token ping to verify the key works.
"""

from __future__ import annotations

import os
import sys


def _prewarm_embeddings() -> None:
    """Force the sentence-transformer / ONNX model to download & cache."""
    try:
        from chromadb.utils import embedding_functions
        ef = embedding_functions.DefaultEmbeddingFunction()
        # Calling it with a trivial string forces model init
        ef(["warmup"])
        print("PREWARM: embeddings ok")
    except Exception as e:
        print(f"PREWARM: embeddings FAILED — {e}", file=sys.stderr)
        raise


def _prewarm_chroma() -> None:
    """Run RAG ingest to build / refresh the vector index.

    rag.ingest() is idempotent: it always drops existing docs and re-adds from
    CORPUS, so calling it here is safe and ensures the index matches the
    current corpus even after a code update.
    """
    try:
        from app.services.rag import ingest
        n = ingest()
        print(f"PREWARM: chroma ok ({n} docs indexed)")
    except Exception as e:
        print(f"PREWARM: chroma FAILED — {e}", file=sys.stderr)
        raise


def _prewarm_anthropic() -> None:
    """Ping Anthropic with a 1-token message to verify the API key."""
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print("PREWARM: anthropic not configured (ANTHROPIC_API_KEY not set)")
        return
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        client.messages.create(
            model=os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6"),
            max_tokens=1,
            messages=[{"role": "user", "content": "hi"}],
        )
        print("PREWARM: anthropic ok")
    except Exception as e:
        print(f"PREWARM: anthropic FAILED — {e}", file=sys.stderr)
        raise


def main() -> None:
    _prewarm_embeddings()
    _prewarm_chroma()
    _prewarm_anthropic()
    print("PREWARM: all steps complete")


if __name__ == "__main__":
    main()
