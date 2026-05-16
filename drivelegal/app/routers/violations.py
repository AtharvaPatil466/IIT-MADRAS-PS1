from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas import ViolationEntry, ViolationsResponse
from app.services import geo, lookup

router = APIRouter()


@router.get("/violations", response_model=ViolationsResponse)
def violations(
    country: str = Query(..., description="ISO country code: IN, UK, AE, US"),
    state: Optional[str] = Query(None, description="State or region name"),
) -> ViolationsResponse:
    country = country.upper()
    if country not in geo.DEFAULT_CURRENCY:
        raise HTTPException(status_code=422, detail=f"Unsupported country code: {country}")

    rows = lookup.list_violations(country, state)
    return ViolationsResponse(
        country=country,
        state=state,
        currency=geo.currency_for(country),
        violations=[
            ViolationEntry(
                violation_code=r["violation_code"],
                violation_name=r["violation_name"],
                vehicle_type=r["vehicle_type"],
                fine_first=r["fine_first"],
                fine_repeat=r.get("fine_repeat"),
                section_reference=r.get("section_reference"),
                compoundable=bool(r["compoundable"]),
                severity=r["severity"],
            )
            for r in rows
        ],
    )
