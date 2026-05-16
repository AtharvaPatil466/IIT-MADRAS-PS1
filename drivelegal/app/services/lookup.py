"""Fine lookup with state fallback to national row.

Resolution order for a given (country, state, violation_code, vehicle_type):
  1. exact state + vehicle match
  2. exact state, vehicle_type='all'
  3. country only (state IS NULL) + vehicle match
  4. country only, vehicle_type='all'
"""

from typing import Optional

from app.database import get_conn


def find_fine(
    country: str,
    state: Optional[str],
    violation_code: str,
    vehicle_type: str = "all",
) -> Optional[dict]:
    queries = [
        (
            "SELECT * FROM fines WHERE country=? AND state=? AND violation_code=? AND vehicle_type=?",
            (country, state, violation_code, vehicle_type),
        ),
        (
            "SELECT * FROM fines WHERE country=? AND state=? AND violation_code=? AND vehicle_type='all'",
            (country, state, violation_code),
        ),
        (
            "SELECT * FROM fines WHERE country=? AND state IS NULL AND violation_code=? AND vehicle_type=?",
            (country, violation_code, vehicle_type),
        ),
        (
            "SELECT * FROM fines WHERE country=? AND state IS NULL AND violation_code=? AND vehicle_type='all'",
            (country, violation_code),
        ),
    ]
    with get_conn() as conn:
        for sql, params in queries:
            # Skip the state-specific queries if no state given.
            if state is None and "state=?" in sql:
                continue
            row = conn.execute(sql, params).fetchone()
            if row:
                return dict(row)
    return None


def list_violations(country: str, state: Optional[str]) -> list[dict]:
    with get_conn() as conn:
        if state:
            rows = conn.execute(
                """SELECT * FROM fines
                   WHERE country=? AND (state=? OR state IS NULL)
                   ORDER BY violation_code, vehicle_type""",
                (country, state),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM fines WHERE country=? ORDER BY violation_code, vehicle_type",
                (country,),
            ).fetchall()
    return [dict(r) for r in rows]
