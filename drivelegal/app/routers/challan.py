from fastapi import APIRouter, HTTPException

from app.schemas import ChallanRequest, ChallanResponse, LocationDTO
from app.services import claude_client, geo, lookup

router = APIRouter()


def _build_summary(row: dict, loc: geo.Location, is_repeat: bool) -> str:
    section = row.get("section_reference") or "the applicable traffic law"
    state_or_country = loc.state or loc.country
    amount = row["fine_repeat"] if (is_repeat and row.get("fine_repeat")) else row["fine_first"]
    compoundable = "compoundable — you can pay on the spot" if row["compoundable"] else "non-compoundable — you must appear in court"
    suspension = ""
    if row.get("suspension_days"):
        suspension = f" plus a {row['suspension_days']}-day licence suspension"
    return (
        f"Under {section}, {row['violation_name'].lower()} in {state_or_country} is "
        f"{row['currency']} {amount:g}{suspension}. This offence is {compoundable}."
    )


@router.post("/challan", response_model=ChallanResponse)
def challan(req: ChallanRequest) -> ChallanResponse:
    loc = geo.resolve(req.location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Unknown location: {req.location}")

    row = lookup.find_fine(loc.country, loc.state, req.violation, req.vehicle_type)
    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"No fine data for violation '{req.violation}' in {loc.state or loc.country}",
        )

    summary = _build_summary(row, loc, req.is_repeat)
    if req.language == "hi":
        summary = claude_client.translate(summary, "hi")

    return ChallanResponse(
        location=LocationDTO(**loc.as_dict()),
        violation_code=row["violation_code"],
        violation_name=row["violation_name"],
        vehicle_type=row["vehicle_type"],
        fine_first=row["fine_first"],
        fine_repeat=row.get("fine_repeat"),
        suspension_days=row.get("suspension_days") or 0,
        currency=row["currency"],
        section_reference=row.get("section_reference"),
        compoundable=bool(row["compoundable"]),
        severity=row["severity"],
        how_to_pay=geo.payment_portal(loc.country, loc.state),
        summary=summary,
    )
