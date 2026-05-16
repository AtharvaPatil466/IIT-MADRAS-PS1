"""Geo-fencing: map a free-text location string to (city, state, country).

Strategy: lowercase the input, check a city map first, then state map, then
country map. The DB has a `locations` table for richer lookups later, but a
static map covers the demo cities reliably without a round-trip.
"""

from dataclasses import dataclass
from typing import Optional

from app.database import get_conn


@dataclass(frozen=True)
class Location:
    city: Optional[str]
    state: Optional[str]
    country: str  # ISO alpha-2

    def as_dict(self) -> dict:
        return {"city": self.city, "state": self.state, "country": self.country}


# Demo-critical cities (PRD calls out Chennai, Mumbai, London, Dubai).
CITY_MAP: dict[str, tuple[str, str]] = {
    # India
    "mumbai": ("Maharashtra", "IN"),
    "pune": ("Maharashtra", "IN"),
    "nagpur": ("Maharashtra", "IN"),
    "delhi": ("Delhi", "IN"),
    "new delhi": ("Delhi", "IN"),
    "bengaluru": ("Karnataka", "IN"),
    "bangalore": ("Karnataka", "IN"),
    "mysuru": ("Karnataka", "IN"),
    "chennai": ("Tamil Nadu", "IN"),
    "coimbatore": ("Tamil Nadu", "IN"),
    "madurai": ("Tamil Nadu", "IN"),
    "ahmedabad": ("Gujarat", "IN"),
    "surat": ("Gujarat", "IN"),
    "vadodara": ("Gujarat", "IN"),
    "hyderabad": ("Telangana", "IN"),
    "kolkata": ("West Bengal", "IN"),
    # UK
    "london": ("England", "UK"),
    "manchester": ("England", "UK"),
    "birmingham": ("England", "UK"),
    "edinburgh": ("Scotland", "UK"),
    # UAE
    "dubai": ("Dubai", "AE"),
    "abu dhabi": ("Abu Dhabi", "AE"),
    "sharjah": ("Sharjah", "AE"),
    # USA
    "los angeles": ("California", "US"),
    "san francisco": ("California", "US"),
    "san diego": ("California", "US"),
    "new york": ("New York", "US"),
    "new york city": ("New York", "US"),
    "nyc": ("New York", "US"),
    "buffalo": ("New York", "US"),
    "houston": ("Texas", "US"),
    "dallas": ("Texas", "US"),
    "austin": ("Texas", "US"),
    "miami": ("Florida", "US"),
    "orlando": ("Florida", "US"),
    "tampa": ("Florida", "US"),
}

STATE_MAP: dict[str, tuple[str, str]] = {
    # IN states
    "maharashtra": ("Maharashtra", "IN"),
    "delhi": ("Delhi", "IN"),
    "karnataka": ("Karnataka", "IN"),
    "tamil nadu": ("Tamil Nadu", "IN"),
    "tamilnadu": ("Tamil Nadu", "IN"),
    "gujarat": ("Gujarat", "IN"),
    "telangana": ("Telangana", "IN"),
    "west bengal": ("West Bengal", "IN"),
    # UK regions
    "england": ("England", "UK"),
    "scotland": ("Scotland", "UK"),
    "wales": ("Wales", "UK"),
    # UAE emirates
    "dubai": ("Dubai", "AE"),
    "abu dhabi": ("Abu Dhabi", "AE"),
    "sharjah": ("Sharjah", "AE"),
    # USA states
    "california": ("California", "US"),
    "new york": ("New York", "US"),
    "texas": ("Texas", "US"),
    "florida": ("Florida", "US"),
}

COUNTRY_MAP: dict[str, str] = {
    "india": "IN",
    "in": "IN",
    "uk": "UK",
    "united kingdom": "UK",
    "england": "UK",
    "britain": "UK",
    "uae": "AE",
    "united arab emirates": "AE",
    "ae": "AE",
    "usa": "US",
    "united states": "US",
    "us": "US",
    "america": "US",
}

DEFAULT_CURRENCY: dict[str, str] = {
    "IN": "INR",
    "UK": "GBP",
    "AE": "AED",
    "US": "USD",
}

PAYMENT_PORTAL: dict[tuple[str, str | None], str] = {
    ("IN", None): "https://echallan.parivahan.gov.in/",
    ("IN", "Maharashtra"): "https://mahatrafficechallan.gov.in/",
    ("IN", "Delhi"): "https://traffic.delhipolice.gov.in/",
    ("IN", "Karnataka"): "https://echallan.parivahan.gov.in/",
    ("IN", "Tamil Nadu"): "https://tnpolice.gov.in/eChallan/",
    ("IN", "Gujarat"): "https://echallan.parivahan.gov.in/",
    ("UK", None): "https://www.gov.uk/pay-fixed-penalty-notice",
    ("AE", None): "https://www.moi.gov.ae/",
    ("US", "California"): "https://www.courts.ca.gov/traffic.htm",
    ("US", "New York"): "https://dmv.ny.gov/tickets",
    ("US", "Texas"): "https://www.txcourts.gov/",
    ("US", "Florida"): "https://www.flhsmv.gov/",
}


def payment_portal(country: str, state: str | None) -> str | None:
    return (
        PAYMENT_PORTAL.get((country, state))
        or PAYMENT_PORTAL.get((country, None))
    )


def resolve(text: str) -> Optional[Location]:
    if not text:
        return None
    key = text.strip().lower()
    if not key:
        return None

    if key in CITY_MAP:
        state, country = CITY_MAP[key]
        return Location(city=text.strip().title(), state=state, country=country)

    if key in STATE_MAP:
        state, country = STATE_MAP[key]
        return Location(city=None, state=state, country=country)

    if key in COUNTRY_MAP:
        return Location(city=None, state=None, country=COUNTRY_MAP[key])

    # DB fallback (locations table can be populated later for richer coverage)
    with get_conn() as conn:
        row = conn.execute(
            "SELECT city, state, country FROM locations WHERE LOWER(city) = ?",
            (key,),
        ).fetchone()
        if row:
            return Location(city=row["city"], state=row["state"], country=row["country"])

    return None


def currency_for(country: str) -> str:
    return DEFAULT_CURRENCY.get(country, "INR")
