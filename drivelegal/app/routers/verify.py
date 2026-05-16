from fastapi import APIRouter, HTTPException

from app.schemas import VerifyFineRequest, VerifyFineResponse
from app.services import geo, lookup

router = APIRouter()


@router.post("/verify-fine", response_model=VerifyFineResponse)
def verify_fine(req: VerifyFineRequest) -> VerifyFineResponse:
    loc = geo.resolve(req.location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Unknown location: {req.location}")

    row = lookup.find_fine(loc.country, loc.state, req.violation, req.vehicle_type)
    if not row:
        return VerifyFineResponse(
            is_correct=False,
            actual_amount=None,
            amount_told=req.amount_told,
            difference=None,
            currency=req.currency or geo.currency_for(loc.country),
            verdict="unknown_violation",
            explanation=(
                f"No record of violation '{req.violation}' in "
                f"{loc.state or loc.country}. Ask for an official challan receipt and "
                "verify the violation code before paying."
            ),
        )

    actual = row["fine_first"]
    diff = req.amount_told - actual
    currency = row["currency"]
    section = row.get("section_reference") or "the applicable law"

    if abs(diff) < 0.01:
        verdict = "correct"
        explanation = (
            f"Correct. {row['violation_name']} in {loc.state or loc.country} is "
            f"{currency} {actual:g} under {section}."
        )
    elif diff > 0:
        verdict = "overcharged"
        explanation = (
            f"First-offence {row['violation_name'].lower()} in {loc.state or loc.country} "
            f"is {currency} {actual:g} under {section}. You are being overcharged by "
            f"{currency} {diff:g}. Ask for an official challan receipt."
        )
    else:
        verdict = "undercharged"
        explanation = (
            f"The official fine is {currency} {actual:g} under {section}. "
            f"You were quoted less by {currency} {abs(diff):g} — this may indicate "
            "an off-the-books transaction. Always insist on an official receipt."
        )

    return VerifyFineResponse(
        is_correct=verdict == "correct",
        actual_amount=actual,
        amount_told=req.amount_told,
        difference=diff,
        currency=currency,
        verdict=verdict,
        explanation=explanation,
    )
