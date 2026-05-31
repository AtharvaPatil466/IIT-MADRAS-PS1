"""Seed UK fines. Source: gov.uk/penalty-points-endorsements.

Run: python3 -m app.data.seed_uk
"""

from app.data._common import upsert_fines

CURRENCY = "GBP"
COUNTRY = "UK"


def _row(**kw) -> dict:
    kw.setdefault("country", COUNTRY)
    kw.setdefault("currency", CURRENCY)
    return kw


ROWS = [
    _row(
        violation_code="overspeeding", violation_name="Speeding (minor)",
        fine_first=100, fine_repeat=100,
        section_reference="Road Traffic Act 1988 s.89",
        compoundable=1, severity="minor",
        notes="Fixed Penalty Notice: £100 + 3 points. Code SP30/SP50.",
    ),
    _row(
        violation_code="overspeeding_serious", violation_name="Speeding (serious / motorway)",
        fine_first=1000, fine_repeat=2500,
        section_reference="Road Traffic Act 1988 s.89",
        compoundable=0, severity="serious",
        notes="Up to £1,000 (£2,500 motorway). Court decides.",
    ),
    _row(
        violation_code="mobile_use", violation_name="Using a hand-held mobile",
        fine_first=200, fine_repeat=200,
        section_reference="Road Vehicles (Construction & Use) Regs 1986, reg 110",
        compoundable=1, severity="serious",
        notes="£200 + 6 points (CU80).",
    ),
    _row(
        violation_code="no_seatbelt", violation_name="Driving without seatbelt",
        fine_first=100, fine_repeat=500,
        section_reference="Road Traffic Act 1988 s.14",
        compoundable=1, severity="minor",
    ),
    _row(
        violation_code="red_light", violation_name="Failing to comply with traffic signals",
        fine_first=100, fine_repeat=1000,
        section_reference="Road Traffic Act 1988 s.36",
        compoundable=1, severity="serious",
        notes="£100 + 3 points (TS10). Court max £1,000.",
    ),
    _row(
        violation_code="no_insurance", violation_name="Using a vehicle uninsured",
        fine_first=300, fine_repeat=5000,
        section_reference="Road Traffic Act 1988 s.143",
        compoundable=1, severity="serious",
        notes="£300 + 6 points fixed penalty; unlimited in court (IN10).",
    ),
    _row(
        violation_code="drunk_driving", violation_name="Driving under the influence",
        fine_first=5000, fine_repeat=5000,
        section_reference="Road Traffic Act 1988 s.5",
        compoundable=0, severity="criminal",
        notes="Unlimited fine + up to 6 months prison + 12-month ban minimum.",
    ),
    _row(
        violation_code="no_mot", violation_name="Driving without a valid MOT",
        fine_first=1000, fine_repeat=1000,
        section_reference="Road Traffic Act 1988 s.47",
        compoundable=1, severity="minor",
    ),
    _row(
        violation_code="no_licence", violation_name="Driving otherwise than in accordance with a licence",
        fine_first=1000, fine_repeat=1000,  # https://www.highwaycodeuk.co.uk/penalty-table.html
        section_reference="Road Traffic Act 1988 s.87",
        compoundable=1, severity="serious",
        notes="Up to £1,000 fine + 3-6 penalty points (IN10). Discretionary disqualification.",
    ),
]


def seed() -> int:
    n = upsert_fines(ROWS)
    print(f"Seeded {n} UK fine rows")
    return n


if __name__ == "__main__":
    seed()
