"""Seed India national + state fines. MV (Amendment) Act 2019.

Run: python3 -m app.data.seed_india
"""

from app.data._common import upsert_fines

CURRENCY = "INR"
COUNTRY = "IN"


def _row(**kw) -> dict:
    kw.setdefault("country", COUNTRY)
    kw.setdefault("currency", CURRENCY)
    return kw


NATIONAL = [
    _row(
        violation_code="drunk_driving", violation_name="Driving under the influence",
        fine_first=10000, fine_repeat=15000, suspension_days=0,
        section_reference="MV Act Section 185", compoundable=0, severity="criminal",
        notes="First offence may include 6 months imprisonment; repeat up to 2 years.",
    ),
    _row(
        violation_code="no_helmet", violation_name="Riding without helmet",
        vehicle_type="two_wheeler",
        fine_first=1000, fine_repeat=1000, suspension_days=90,
        section_reference="MV Act Section 194D", compoundable=1, severity="minor",
    ),
    _row(
        violation_code="no_seatbelt", violation_name="Driving without seatbelt",
        vehicle_type="car",
        fine_first=1000, fine_repeat=1000,
        section_reference="MV Act Section 194B", compoundable=1, severity="minor",
    ),
    _row(
        violation_code="mobile_use", violation_name="Using mobile while driving",
        fine_first=5000, fine_repeat=10000,  # https://www.acko.com/car-guide/what-is-section-184-of-the-motor-vehicle-act/
        section_reference="MV Act Section 184", compoundable=1, severity="serious",
    ),
    _row(
        violation_code="red_light", violation_name="Jumping a red light",
        fine_first=5000, fine_repeat=10000,  # https://www.acko.com/car-guide/what-is-section-184-of-the-motor-vehicle-act/
        section_reference="MV Act Section 184", compoundable=1, severity="serious",
    ),
    _row(
        violation_code="no_licence", violation_name="Driving without a valid licence",
        fine_first=5000, fine_repeat=5000,
        section_reference="MV Act Section 181", compoundable=0, severity="serious",
    ),
    _row(
        violation_code="no_insurance", violation_name="Driving without insurance",
        fine_first=2000, fine_repeat=4000,
        section_reference="MV Act Section 196", compoundable=1, severity="serious",
    ),
    _row(
        violation_code="overspeeding", violation_name="Overspeeding (light vehicle)",
        vehicle_type="car",
        fine_first=1000, fine_repeat=2000,
        section_reference="MV Act Section 183", compoundable=1, severity="minor",
    ),
    _row(
        violation_code="overspeeding", violation_name="Overspeeding (commercial)",
        vehicle_type="commercial",
        fine_first=2000, fine_repeat=4000,
        section_reference="MV Act Section 183", compoundable=1, severity="serious",
    ),
    _row(
        violation_code="wrong_side", violation_name="Driving on the wrong side",
        fine_first=5000, fine_repeat=10000,  # https://www.acko.com/car-guide/what-is-section-184-of-the-motor-vehicle-act/
        section_reference="MV Act Section 184", compoundable=1, severity="serious",
    ),
    _row(
        violation_code="overloading", violation_name="Overloading goods vehicle",
        vehicle_type="commercial",
        fine_first=20000, fine_repeat=20000,
        section_reference="MV Act Section 194", compoundable=0, severity="serious",
        notes="Plus ₹2,000 per extra tonne.",
    ),
    _row(
        violation_code="no_puc", violation_name="No Pollution Under Control certificate",
        fine_first=10000, fine_repeat=10000,
        section_reference="MV Act Section 190(2)", compoundable=1, severity="minor",
    ),
    _row(
        violation_code="tinted_windows", violation_name="Sun-film below legal VLT",
        vehicle_type="car",
        fine_first=500, fine_repeat=1500,
        section_reference="MV Act Section 177 / CMVR Rule 100", compoundable=1, severity="minor",
    ),
]


# State variations — only override fields that differ from national.
def _state_override(state: str, base_code: str, **overrides) -> dict:
    base = next(r for r in NATIONAL if r["violation_code"] == base_code
                and r.get("vehicle_type", "all") == overrides.get("vehicle_type", "all"))
    return _row(**{**base, "state": state, **overrides})


STATES = [
    # Maharashtra — generally aligns with central; helmet enforcement is strict.
    _state_override("Maharashtra", "no_helmet", fine_first=1000, suspension_days=90,
                    notes="3-month licence suspension strictly enforced (Mumbai/Pune).",
                    vehicle_type="two_wheeler"),
    _state_override("Maharashtra", "mobile_use", fine_first=1000, fine_repeat=10000),

    # Delhi — known for stricter on-spot enforcement; PUC sweep.
    _state_override("Delhi", "no_puc", fine_first=10000, severity="serious",
                    notes="Delhi Transport runs aggressive PUC checks; fine non-negotiable."),
    _state_override("Delhi", "red_light", fine_first=1000, fine_repeat=5000),
    _state_override("Delhi", "tinted_windows", fine_first=500, fine_repeat=1500,
                    vehicle_type="car"),

    # Karnataka — softened some on-spot amounts via state notification (2019-2020).
    _state_override("Karnataka", "no_helmet", fine_first=500, fine_repeat=500,
                    suspension_days=0,
                    notes="State reduced central ₹1,000 to ₹500 via gazette notification.",
                    vehicle_type="two_wheeler"),
    _state_override("Karnataka", "no_seatbelt", fine_first=500, fine_repeat=500,
                    vehicle_type="car"),
    _state_override("Karnataka", "mobile_use", fine_first=1500, fine_repeat=5000),
    _state_override("Karnataka", "red_light", fine_first=1000, fine_repeat=5000),

    # Tamil Nadu
    _state_override("Tamil Nadu", "no_helmet", fine_first=1000, suspension_days=90,
                    vehicle_type="two_wheeler"),
    _state_override("Tamil Nadu", "red_light", fine_first=1000, fine_repeat=5000),
    _state_override("Tamil Nadu", "no_puc", fine_first=10000,
                    notes="Chennai City Traffic Police enforces via e-challan."),

    # Gujarat — published one of the lowest revised schedules.
    _state_override("Gujarat", "no_helmet", fine_first=500, fine_repeat=500,
                    suspension_days=0,
                    notes="Gujarat slashed central ₹1,000 to ₹500.",
                    vehicle_type="two_wheeler"),
    _state_override("Gujarat", "no_seatbelt", fine_first=500, fine_repeat=500,
                    vehicle_type="car"),
    _state_override("Gujarat", "mobile_use", fine_first=500, fine_repeat=1000),
    _state_override("Gujarat", "red_light", fine_first=1000, fine_repeat=3000),
]


def seed() -> int:
    n = upsert_fines(NATIONAL + STATES)
    print(f"Seeded {n} India fine rows")
    return n


if __name__ == "__main__":
    seed()
