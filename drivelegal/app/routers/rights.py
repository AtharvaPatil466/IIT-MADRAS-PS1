import json

from fastapi import APIRouter, HTTPException, Query

from app.database import get_conn
from app.schemas import LocationDTO, RightsResponse
from app.services import geo

router = APIRouter()


@router.get("/rights", response_model=RightsResponse)
def rights(location: str = Query(..., description="City, state, or country")) -> RightsResponse:
    loc = geo.resolve(location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Unknown location: {location}")

    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM rights WHERE country=? AND (state=? OR state IS NULL) "
            "ORDER BY state IS NULL LIMIT 1",
            (loc.country, loc.state),
        ).fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No rights data for {loc.state or loc.country}",
        )

    return RightsResponse(
        location=LocationDTO(**loc.as_dict()),
        documents_required=json.loads(row["documents_required"]),
        cop_can_demand=json.loads(row["cop_can_demand"]),
        cop_cannot_demand=json.loads(row["cop_cannot_demand"]),
        dispute_process=row["dispute_process"],
        payment_portal_url=row["payment_portal_url"],
    )
