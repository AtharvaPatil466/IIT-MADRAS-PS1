"""Initialize the DriveLegal SQLite database with all required tables.

Run from project root:
    python -m scripts.init_db
"""

import os
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = str(ROOT / "db" / "drivelegal.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS fines (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    country             TEXT    NOT NULL,
    state               TEXT,
    violation_code      TEXT    NOT NULL,
    violation_name      TEXT    NOT NULL,
    vehicle_type        TEXT    NOT NULL DEFAULT 'all',
    fine_first          REAL    NOT NULL,
    fine_repeat         REAL,
    suspension_days     INTEGER DEFAULT 0,
    section_reference   TEXT,
    compoundable        INTEGER NOT NULL DEFAULT 1,
    severity            TEXT    NOT NULL DEFAULT 'minor'
                        CHECK (severity IN ('minor', 'serious', 'criminal')),
    currency            TEXT    NOT NULL DEFAULT 'INR',
    notes               TEXT,
    last_updated        TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (country, state, violation_code, vehicle_type)
);

CREATE INDEX IF NOT EXISTS idx_fines_country_state
    ON fines (country, state);
CREATE INDEX IF NOT EXISTS idx_fines_violation
    ON fines (violation_code);

CREATE TABLE IF NOT EXISTS rights (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    country             TEXT    NOT NULL,
    state               TEXT,
    documents_required  TEXT    NOT NULL,
    cop_can_demand      TEXT    NOT NULL,
    cop_cannot_demand   TEXT    NOT NULL,
    dispute_process     TEXT    NOT NULL,
    payment_portal_url  TEXT,
    last_updated        TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (country, state)
);

CREATE TABLE IF NOT EXISTS violation_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    violation_code  TEXT    NOT NULL,
    country         TEXT    NOT NULL,
    state           TEXT,
    fine_pre_2019   REAL,
    fine_post_2019  REAL,
    change_date     TEXT,
    change_reason   TEXT,
    UNIQUE (country, state, violation_code)
);

CREATE TABLE IF NOT EXISTS locations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    city        TEXT    NOT NULL,
    state       TEXT,
    country     TEXT    NOT NULL,
    aliases     TEXT,
    UNIQUE (city, country)
);

CREATE INDEX IF NOT EXISTS idx_locations_city
    ON locations (city);
"""


def init_db(db_path: str | None = None) -> str:
    path = db_path or os.environ.get("DATABASE_PATH", DEFAULT_DB_PATH)
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    try:
        conn.executescript(SCHEMA)
        conn.commit()
    finally:
        conn.close()
    return os.path.abspath(path)


if __name__ == "__main__":
    out = init_db()
    print(f"Initialized DB at {out}")
