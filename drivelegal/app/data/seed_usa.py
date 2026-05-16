"""Seed USA fines for CA, NY, TX, FL.

Source: dmv.ca.gov, dmv.ny.gov, txdot.gov, flhsmv.gov.
Amounts are typical base fines; total with court fees is often 2-3x.

Run: python3 -m app.data.seed_usa
"""

from app.data._common import upsert_fines

CURRENCY = "USD"
COUNTRY = "US"


def _row(**kw) -> dict:
    kw.setdefault("country", COUNTRY)
    kw.setdefault("currency", CURRENCY)
    return kw


CA = [
    _row(state="California", violation_code="red_light",
         violation_name="Running a red light",
         fine_first=490, fine_repeat=490,
         section_reference="CVC §21453(a)", compoundable=1, severity="serious",
         notes="Base $100; with state/county fees total ~$490."),
    _row(state="California", violation_code="overspeeding",
         violation_name="Speeding 1–15 mph over",
         fine_first=238, fine_repeat=238,
         section_reference="CVC §22350", compoundable=1, severity="minor"),
    _row(state="California", violation_code="drunk_driving",
         violation_name="DUI — first offence",
         fine_first=1800, fine_repeat=1800,
         section_reference="CVC §23152", compoundable=0, severity="criminal",
         notes="Plus 6-month licence suspension and possible jail."),
    _row(state="California", violation_code="no_seatbelt",
         violation_name="Driving without seatbelt",
         fine_first=162, fine_repeat=162,
         section_reference="CVC §27315", compoundable=1, severity="minor"),
    _row(state="California", violation_code="mobile_use",
         violation_name="Hand-held mobile use",
         fine_first=162, fine_repeat=285,
         section_reference="CVC §23123", compoundable=1, severity="minor"),
]

NY = [
    _row(state="New York", violation_code="red_light",
         violation_name="Running a red light",
         fine_first=150, fine_repeat=450,
         section_reference="NY V&T §1111(d)", compoundable=1, severity="serious"),
    _row(state="New York", violation_code="overspeeding",
         violation_name="Speeding 1–10 mph over",
         fine_first=150, fine_repeat=300,
         section_reference="NY V&T §1180", compoundable=1, severity="minor"),
    _row(state="New York", violation_code="drunk_driving",
         violation_name="DWI — first offence",
         fine_first=1000, fine_repeat=5000,
         section_reference="NY V&T §1192", compoundable=0, severity="criminal"),
    _row(state="New York", violation_code="no_seatbelt",
         violation_name="Driving without seatbelt",
         fine_first=50, fine_repeat=50,
         section_reference="NY V&T §1229-c", compoundable=1, severity="minor"),
    _row(state="New York", violation_code="mobile_use",
         violation_name="Using a hand-held device",
         fine_first=200, fine_repeat=450,
         section_reference="NY V&T §1225-c", compoundable=1, severity="minor"),
]

TX = [
    _row(state="Texas", violation_code="red_light",
         violation_name="Running a red light",
         fine_first=300, fine_repeat=300,
         section_reference="TX Transp. Code §544.007", compoundable=1, severity="serious"),
    _row(state="Texas", violation_code="overspeeding",
         violation_name="Speeding (typical)",
         fine_first=200, fine_repeat=200,
         section_reference="TX Transp. Code §545.351", compoundable=1, severity="minor"),
    _row(state="Texas", violation_code="drunk_driving",
         violation_name="DWI — first offence",
         fine_first=2000, fine_repeat=4000,
         section_reference="TX Penal Code §49.04", compoundable=0, severity="criminal"),
    _row(state="Texas", violation_code="no_seatbelt",
         violation_name="Driving without seatbelt",
         fine_first=200, fine_repeat=200,
         section_reference="TX Transp. Code §545.413", compoundable=1, severity="minor"),
    _row(state="Texas", violation_code="mobile_use",
         violation_name="Texting while driving",
         fine_first=99, fine_repeat=200,
         section_reference="TX Transp. Code §545.4251", compoundable=1, severity="minor"),
]

FL = [
    _row(state="Florida", violation_code="red_light",
         violation_name="Running a red light",
         fine_first=158, fine_repeat=262,
         section_reference="FL Stat. §316.075", compoundable=1, severity="serious"),
    _row(state="Florida", violation_code="overspeeding",
         violation_name="Speeding 10–14 mph over",
         fine_first=204, fine_repeat=204,
         section_reference="FL Stat. §316.183", compoundable=1, severity="minor"),
    _row(state="Florida", violation_code="drunk_driving",
         violation_name="DUI — first offence",
         fine_first=1000, fine_repeat=2000,
         section_reference="FL Stat. §316.193", compoundable=0, severity="criminal"),
    _row(state="Florida", violation_code="no_seatbelt",
         violation_name="Driving without seatbelt",
         fine_first=30, fine_repeat=30,
         section_reference="FL Stat. §316.614", compoundable=1, severity="minor"),
    _row(state="Florida", violation_code="mobile_use",
         violation_name="Texting while driving",
         fine_first=30, fine_repeat=60,
         section_reference="FL Stat. §316.305", compoundable=1, severity="minor"),
]


def seed() -> int:
    n = upsert_fines(CA + NY + TX + FL)
    print(f"Seeded {n} USA fine rows")
    return n


if __name__ == "__main__":
    seed()
