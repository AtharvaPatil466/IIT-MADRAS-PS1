"""Seed pre-2019 vs post-2019 (MV Amendment Act) fine history for India.

Run: python3 -m app.data.seed_history
"""

from app.database import get_conn

ROWS = [
    ("drunk_driving", "IN", None, 2000, 10000, "2019-09-01",
     "MV (Amendment) Act 2019 raised first-offence DUI from ₹2,000 to ₹10,000."),
    ("no_helmet", "IN", None, 100, 1000, "2019-09-01",
     "Raised from ₹100 to ₹1,000 plus 3-month licence suspension."),
    ("no_seatbelt", "IN", None, 100, 1000, "2019-09-01", "Raised 10x."),
    ("mobile_use", "IN", None, 1000, 5000, "2019-09-01",
     "Repeat-offence raised; also reclassified as 'dangerous driving' under §184."),
    ("red_light", "IN", None, 100, 1000, "2019-09-01",
     "Raised from ₹100 to ₹1,000; repeat ₹5,000."),
    ("no_licence", "IN", None, 500, 5000, "2019-09-01", "10x increase."),
    ("no_insurance", "IN", None, 1000, 2000, "2019-09-01", "Doubled."),
    ("overspeeding", "IN", None, 400, 1000, "2019-09-01",
     "LMV ₹400 → ₹1,000–2,000 band."),
    ("wrong_side", "IN", None, 500, 1000, "2019-09-01", "Reclassified as dangerous driving."),
    ("overloading", "IN", None, 2000, 20000, "2019-09-01",
     "Goods overloading flat fine 10x; plus ₹2,000 per excess tonne."),
]


def seed() -> int:
    sql = """
        INSERT INTO violation_history (
            violation_code, country, state, fine_pre_2019, fine_post_2019,
            change_date, change_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(country, state, violation_code) DO UPDATE SET
            fine_pre_2019=excluded.fine_pre_2019,
            fine_post_2019=excluded.fine_post_2019,
            change_date=excluded.change_date,
            change_reason=excluded.change_reason
    """
    with get_conn() as conn:
        for r in ROWS:
            conn.execute(sql, r)
    print(f"Seeded {len(ROWS)} history rows")
    return len(ROWS)


if __name__ == "__main__":
    seed()
