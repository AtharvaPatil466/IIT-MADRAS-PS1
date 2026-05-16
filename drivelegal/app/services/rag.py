"""RAG retriever.

Primary path: ChromaDB with sentence-transformers embeddings (persists to ./chroma).
Fallback path: in-memory keyword scorer if Chroma/embeddings can't load — keeps
the API functional in environments without the heavy ML deps installed.

Public API:
    ingest()      -> (re)builds the index from app.data.legal_corpus.CORPUS
    retrieve(q, k=4, country=None) -> list[dict] with {id,title,section,source,url,text,score}
"""

from __future__ import annotations

import logging
import re
from typing import Optional

from app.config import settings
from app.data.legal_corpus import CORPUS

log = logging.getLogger(__name__)

_COLLECTION = "drivelegal_legal_docs"

_chroma_client = None
_collection = None


def _try_init_chroma():
    """Best-effort init. Returns the collection or None."""
    global _chroma_client, _collection
    if _collection is not None:
        return _collection
    try:
        import chromadb
        from chromadb.utils import embedding_functions

        _chroma_client = chromadb.PersistentClient(path=settings.chroma_path)
        ef = embedding_functions.DefaultEmbeddingFunction()
        _collection = _chroma_client.get_or_create_collection(
            name=_COLLECTION, embedding_function=ef,
        )
        return _collection
    except Exception as e:  # pragma: no cover
        log.warning("Chroma unavailable, falling back to keyword retrieval: %s", e)
        _collection = None
        return None


def ingest() -> int:
    """(Re)build the vector index from CORPUS. Returns count indexed."""
    col = _try_init_chroma()
    if col is None:
        return len(CORPUS)  # keyword fallback indexes on the fly

    existing = col.get().get("ids") or []
    if existing:
        col.delete(ids=existing)

    col.add(
        ids=[c["id"] for c in CORPUS],
        documents=[c["text"] for c in CORPUS],
        metadatas=[
            {k: c[k] for k in ("country", "title", "section", "source", "url")}
            for c in CORPUS
        ],
    )
    return len(CORPUS)


_WORD = re.compile(r"[a-z0-9]+")


def _keyword_score(query: str, text: str) -> float:
    q = set(_WORD.findall(query.lower()))
    if not q:
        return 0.0
    t = _WORD.findall(text.lower())
    if not t:
        return 0.0
    hits = sum(1 for w in t if w in q)
    return hits / (len(t) ** 0.5)


def _keyword_retrieve(query: str, k: int, country: Optional[str]) -> list[dict]:
    pool = [c for c in CORPUS if country is None or c["country"] == country]
    if not pool:
        pool = CORPUS
    scored = sorted(
        ((_keyword_score(query, c["text"] + " " + c["title"]), c) for c in pool),
        key=lambda x: x[0], reverse=True,
    )
    out = []
    for score, c in scored[:k]:
        if score == 0:
            continue
        out.append({**c, "score": round(score, 4)})
    return out


def retrieve(query: str, k: int = 4, country: Optional[str] = None) -> list[dict]:
    col = _try_init_chroma()
    if col is None:
        return _keyword_retrieve(query, k, country)

    try:
        where = {"country": country} if country else None
        res = col.query(query_texts=[query], n_results=k, where=where)
    except Exception as e:  # pragma: no cover
        log.warning("Chroma query failed, falling back: %s", e)
        return _keyword_retrieve(query, k, country)

    ids = res.get("ids", [[]])[0]
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[None] * len(ids)])[0]
    out = []
    for i, doc, meta, dist in zip(ids, docs, metas, dists):
        out.append({
            "id": i, "text": doc,
            **(meta or {}),
            "score": None if dist is None else round(1.0 - float(dist), 4),
        })
    return out
