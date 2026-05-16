"""Seed the `rights` table — Know Your Rights data per country/state.

Run: python3 -m app.data.seed_rights
"""

import json

from app.database import get_conn

ROWS = [
    {
        "country": "IN", "state": None,
        "documents_required": [
            "Driving Licence",
            "Vehicle Registration Certificate (RC)",
            "Insurance Certificate",
            "Pollution Under Control (PUC) Certificate",
            "Permit (commercial vehicles only)",
            "Fitness Certificate (commercial only)",
        ],
        "cop_can_demand": [
            "Inspect documents in person",
            "Issue an on-the-spot challan for compoundable offences",
            "Seize licence for serious violations (with written receipt)",
            "Use breathalyser for suspected drunk driving",
        ],
        "cop_cannot_demand": [
            "Cash without an official receipt",
            "Confiscate original documents without a written notice",
            "Stop a vehicle without identifying themselves (name + badge)",
            "Search a private vehicle without cause or a warrant",
            "Challan you below the rank of Assistant Sub-Inspector for many offences (varies by state)",
        ],
        "dispute_process": (
            "1. Request a written challan receipt with officer's badge number.\n"
            "2. Photograph the scene if you believe the charge is wrong.\n"
            "3. Pay online or contest at the local traffic court (Lok Adalat) within 60 days.\n"
            "4. For e-challans, log in at echallan.parivahan.gov.in and use 'Dispute'.\n"
            "5. Escalate to the Deputy Commissioner of Police (Traffic) if no resolution."
        ),
        "payment_portal_url": "https://echallan.parivahan.gov.in/",
    },
    {
        "country": "IN", "state": "Maharashtra",
        "documents_required": [
            "Driving Licence", "RC", "Insurance", "PUC",
        ],
        "cop_can_demand": [
            "Inspect documents",
            "On-spot challan for compoundable offences",
            "Use e-challan device (Mumbai/Pune Traffic Police)",
        ],
        "cop_cannot_demand": [
            "Cash without receipt",
            "Confiscate documents without written notice",
            "Detain a vehicle for compoundable offence after fine is paid",
        ],
        "dispute_process": (
            "Pay or contest at mahatrafficechallan.gov.in within 60 days. "
            "Unpaid challans after 90 days are forwarded to the Lok Adalat."
        ),
        "payment_portal_url": "https://mahatrafficechallan.gov.in/",
    },
    {
        "country": "IN", "state": "Delhi",
        "documents_required": ["Driving Licence", "RC", "Insurance", "PUC"],
        "cop_can_demand": [
            "Inspect documents",
            "Issue e-challan via handheld device",
            "Tow vehicle for serious violations (with notice)",
        ],
        "cop_cannot_demand": [
            "Cash without receipt",
            "Stop you without showing ID on request",
        ],
        "dispute_process": (
            "Delhi Traffic Police issues e-challans payable at delhipolice.gov.in or "
            "echallan.parivahan.gov.in. Contest at the Virtual Court within 60 days."
        ),
        "payment_portal_url": "https://traffic.delhipolice.gov.in/",
    },
    {
        "country": "UK", "state": None,
        "documents_required": [
            "Driving licence (must produce within 7 days at a station if not on you)",
            "Insurance certificate",
            "MOT certificate (vehicles 3+ years old)",
            "V5C logbook (not required to carry)",
        ],
        "cop_can_demand": [
            "Stop any vehicle under s.163 Road Traffic Act 1988",
            "Issue a Fixed Penalty Notice (FPN)",
            "Conduct a roadside breath test on reasonable suspicion",
            "Seize an uninsured/unlicensed vehicle",
        ],
        "cop_cannot_demand": [
            "Cash payment on the spot — all FPNs are paid online or by post",
            "Search the vehicle without grounds (PACE Code A)",
            "Refuse to give their name, rank, and station",
        ],
        "dispute_process": (
            "1. You have 28 days to pay or contest an FPN.\n"
            "2. To contest, request a court hearing on the FPN reply form.\n"
            "3. Magistrates' court will hear the case; legal aid may apply."
        ),
        "payment_portal_url": "https://www.gov.uk/pay-fixed-penalty-notice",
    },
    {
        "country": "AE", "state": None,
        "documents_required": [
            "Emirates ID",
            "UAE driving licence (or accepted international one)",
            "Vehicle registration card (Mulkiya)",
            "Insurance (valid for the emirate)",
        ],
        "cop_can_demand": [
            "Inspect documents",
            "Issue a fine via MOI/RTA system (no on-the-spot cash)",
            "Impound vehicle for reckless driving / 60+ km/h overspeed",
            "Conduct a breathalyser test (zero tolerance: any alcohol is an offence)",
        ],
        "cop_cannot_demand": [
            "Cash on the spot",
            "Confiscate Emirates ID",
            "Search vehicle without cause",
        ],
        "dispute_process": (
            "Object to a fine within 30 days at the Traffic Prosecution office "
            "(MOI app or es.moi.gov.ae). Provide evidence (photos, GPS). "
            "Decisions can be appealed to a traffic court."
        ),
        "payment_portal_url": "https://www.moi.gov.ae/",
    },
    {
        "country": "US", "state": "California",
        "documents_required": ["Driver licence", "Vehicle registration", "Proof of insurance"],
        "cop_can_demand": [
            "Stop on reasonable suspicion of a violation",
            "Request licence, registration, and insurance",
            "Conduct DUI investigation if signs of impairment",
        ],
        "cop_cannot_demand": [
            "Search the vehicle without consent, warrant, or probable cause",
            "Force you to answer questions beyond identification",
            "Take cash on the spot — citations are paid by mail or online",
        ],
        "dispute_process": (
            "Plead 'not guilty' on the citation and request a court date. "
            "California allows a Trial by Written Declaration for most infractions."
        ),
        "payment_portal_url": "https://www.courts.ca.gov/traffic.htm",
    },
    {
        "country": "US", "state": None,
        "documents_required": ["Driver licence", "Vehicle registration", "Proof of insurance"],
        "cop_can_demand": [
            "Stop on reasonable suspicion",
            "Request ID and vehicle documents",
        ],
        "cop_cannot_demand": [
            "Search without consent, warrant, or probable cause",
            "On-the-spot cash payment",
        ],
        "dispute_process": (
            "Most states allow you to plead not guilty and request a court hearing. "
            "Check the citation for the response deadline (typically 30 days)."
        ),
        "payment_portal_url": None,
    },
]


def seed() -> int:
    sql = """
        INSERT INTO rights (country, state, documents_required, cop_can_demand,
                            cop_cannot_demand, dispute_process, payment_portal_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(country, state) DO UPDATE SET
            documents_required=excluded.documents_required,
            cop_can_demand=excluded.cop_can_demand,
            cop_cannot_demand=excluded.cop_cannot_demand,
            dispute_process=excluded.dispute_process,
            payment_portal_url=excluded.payment_portal_url,
            last_updated=datetime('now')
    """
    with get_conn() as conn:
        for r in ROWS:
            conn.execute(sql, (
                r["country"], r["state"],
                json.dumps(r["documents_required"]),
                json.dumps(r["cop_can_demand"]),
                json.dumps(r["cop_cannot_demand"]),
                r["dispute_process"], r["payment_portal_url"],
            ))
    print(f"Seeded {len(ROWS)} rights rows")
    return len(ROWS)


if __name__ == "__main__":
    seed()
