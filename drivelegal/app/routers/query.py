from fastapi import APIRouter

from app.schemas import Citation, QueryRequest, QueryResponse, SourceDoc
from app.services import claude_client, geo, rag

router = APIRouter()


def _confidence_from_chunks(chunks: list[dict]) -> str:
    if not chunks:
        return "low"
    top = chunks[0].get("score")
    if top is None:
        return "medium"
    if top >= 0.5:
        return "high"
    if top >= 0.15:
        return "medium"
    return "low"


@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest) -> QueryResponse:
    country = None
    location_label = req.location_hint
    if req.location_hint:
        loc = geo.resolve(req.location_hint)
        if loc:
            country = loc.country
            location_label = loc.state or loc.country

    chunks = rag.retrieve(req.question, k=4, country=country)

    answer = claude_client.answer_with_rag(
        question=req.question,
        chunks=chunks,
        location=location_label,
        language=req.language,
    )

    citations = [
        Citation(section=c.get("section", "?"), source=c.get("source", "?"))
        for c in chunks
    ]
    sources = [
        SourceDoc(
            title=c.get("title", ""),
            snippet=(c.get("text", "")[:240] + ("..." if len(c.get("text", "")) > 240 else "")),
            url=c.get("url"),
        )
        for c in chunks
    ]

    return QueryResponse(
        answer=answer,
        language=req.language,
        citations=citations,
        source_documents=sources,
        confidence=_confidence_from_chunks(chunks),
    )
