"""Seed UAE fines. Source: moi.gov.ae federal traffic fines schedule.

Run: python3 -m app.data.seed_uae
"""

from app.data._common import upsert_fines

CURRENCY = "AED"
COUNTRY = "AE"


def _row(**kw) -> dict:
    kw.setdefault("country", COUNTRY)
    kw.setdefault("currency", CURRENCY)
    return kw


ROWS = [
    _row(
        violation_code="red_light", violation_name="Jumping a red light",
        fine_first=1000, fine_repeat=1000,
        section_reference="Federal Traffic Law, Article — red signal",
        compoundable=1, severity="serious",
        notes="AED 1,000 + 12 black points + 30-day vehicle impound.",
    ),
    _row(
        violation_code="mobile_use", violation_name="Using mobile while driving",
        fine_first=800, fine_repeat=800,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="serious",
        notes="AED 800 + 4 black points.",
    ),
    _row(
        violation_code="no_seatbelt", violation_name="Driving without seatbelt",
        fine_first=400, fine_repeat=400,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="minor",
        notes="AED 400 + 4 black points.",
    ),
    _row(
        violation_code="overspeeding", violation_name="Overspeeding 20–30 km/h over limit",
        fine_first=600, fine_repeat=600,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="minor",
        notes="AED 600 + 6 black points.",
    ),
    _row(
        violation_code="overspeeding_serious", violation_name="Overspeeding 60+ km/h over limit",
        fine_first=3000, fine_repeat=3000,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=0, severity="serious",
        notes="AED 3,000 + 23 black points + 60-day vehicle confiscation.",
    ),
    _row(
        violation_code="drunk_driving", violation_name="Driving under the influence",
        fine_first=20000, fine_repeat=20000,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=0, severity="criminal",
        notes="Court-determined fine (min AED 20,000) + imprisonment + 1-year ban.",
    ),
    _row(
        violation_code="wrong_way", violation_name="Entering a road in the wrong direction",
        fine_first=600, fine_repeat=600,  # https://gulfnews.com/guides/life/all-138-uae-traffic-violations-fines-and-black-points-1.1546486
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="serious",
        notes="AED 600 + 4 black points + 7-day vehicle retention.",
    ),
    _row(
        violation_code="no_insurance", violation_name="Driving without valid insurance",
        fine_first=500, fine_repeat=500,
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="serious",
    ),
    _row(
        violation_code="no_helmet", violation_name="Riding motorcycle without helmet",
        vehicle_type="two_wheeler",
        fine_first=500, fine_repeat=500,  # https://gulfnews.com/guides/life/all-138-uae-traffic-violations-fines-and-black-points-1.1546486
        section_reference="Federal Traffic Law (UAE)",
        compoundable=1, severity="minor",
        notes="AED 500 + 4 black points; applies to both driver and passenger.",
    ),
    _row(
        violation_code="no_licence", violation_name="Driving without a valid UAE licence",
        fine_first=5000, fine_repeat=5000,  # https://www.excellencedriving.com/en/blogs/penalties-for-driving-without-a-license
        section_reference="Federal Decree-Law No. 14 of 2024, Article on unlicensed driving",
        compoundable=0, severity="serious",
        notes="AED 5,000–50,000 + possible imprisonment under 2024 federal law.",
    ),
]


def seed() -> int:
    n = upsert_fines(ROWS)
    print(f"Seeded {n} UAE fine rows")
    return n


if __name__ == "__main__":
    seed()
