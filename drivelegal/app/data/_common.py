"""Shared seed helpers. Each seeder calls upsert_fines(rows)."""

from app.database import get_conn

FINE_COLS = (
    "country", "state", "violation_code", "violation_name",
    "vehicle_type", "fine_first", "fine_repeat",
    "suspension_days", "section_reference", "compoundable",
    "severity", "currency", "notes",
)


def upsert_fines(rows: list[dict]) -> int:
    placeholders = ", ".join(["?"] * len(FINE_COLS))
    cols = ", ".join(FINE_COLS)
    sql = f"""
        INSERT INTO fines ({cols}) VALUES ({placeholders})
        ON CONFLICT(country, state, violation_code, vehicle_type) DO UPDATE SET
            violation_name=excluded.violation_name,
            fine_first=excluded.fine_first,
            fine_repeat=excluded.fine_repeat,
            suspension_days=excluded.suspension_days,
            section_reference=excluded.section_reference,
            compoundable=excluded.compoundable,
            severity=excluded.severity,
            currency=excluded.currency,
            notes=excluded.notes,
            last_updated=datetime('now')
    """
    with get_conn() as conn:
        for r in rows:
            r.setdefault("state", None)
            r.setdefault("vehicle_type", "all")
            r.setdefault("fine_repeat", None)
            r.setdefault("suspension_days", 0)
            r.setdefault("section_reference", None)
            r.setdefault("compoundable", 1)
            r.setdefault("severity", "minor")
            r.setdefault("notes", None)
            conn.execute(sql, tuple(r[c] for c in FINE_COLS))
    return len(rows)
