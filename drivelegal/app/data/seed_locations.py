"""Seed the locations table with 200+ major cities across IN, UK, AE, US.

Run: python3 -m app.data.seed_locations
"""

from app.database import get_conn

# (city, state, country)
# country codes and state names must match geo.py's CITY_MAP conventions.

INDIA = [
    # Maharashtra (5+)
    ("Mumbai", "Maharashtra", "IN"),
    ("Pune", "Maharashtra", "IN"),
    ("Nagpur", "Maharashtra", "IN"),
    ("Nashik", "Maharashtra", "IN"),
    ("Aurangabad", "Maharashtra", "IN"),
    ("Solapur", "Maharashtra", "IN"),
    ("Thane", "Maharashtra", "IN"),
    ("Kolhapur", "Maharashtra", "IN"),

    # Delhi (5+)
    ("Delhi", "Delhi", "IN"),
    ("New Delhi", "Delhi", "IN"),
    ("Dwarka", "Delhi", "IN"),
    ("Rohini", "Delhi", "IN"),
    ("Noida", "Delhi", "IN"),      # NCR but mapped to Delhi for fines
    ("Gurgaon", "Delhi", "IN"),    # NCR

    # Karnataka (5+)
    ("Bengaluru", "Karnataka", "IN"),
    ("Mysuru", "Karnataka", "IN"),
    ("Hubli", "Karnataka", "IN"),
    ("Dharwad", "Karnataka", "IN"),
    ("Mangaluru", "Karnataka", "IN"),
    ("Belagavi", "Karnataka", "IN"),
    ("Ballari", "Karnataka", "IN"),

    # Tamil Nadu (5+)
    ("Chennai", "Tamil Nadu", "IN"),
    ("Coimbatore", "Tamil Nadu", "IN"),
    ("Madurai", "Tamil Nadu", "IN"),
    ("Tiruchirappalli", "Tamil Nadu", "IN"),
    ("Salem", "Tamil Nadu", "IN"),
    ("Tirunelveli", "Tamil Nadu", "IN"),
    ("Vellore", "Tamil Nadu", "IN"),

    # Gujarat (5+)
    ("Ahmedabad", "Gujarat", "IN"),
    ("Surat", "Gujarat", "IN"),
    ("Vadodara", "Gujarat", "IN"),
    ("Rajkot", "Gujarat", "IN"),
    ("Bhavnagar", "Gujarat", "IN"),
    ("Jamnagar", "Gujarat", "IN"),
    ("Gandhinagar", "Gujarat", "IN"),

    # Telangana (5+)
    ("Hyderabad", "Telangana", "IN"),
    ("Warangal", "Telangana", "IN"),
    ("Nizamabad", "Telangana", "IN"),
    ("Karimnagar", "Telangana", "IN"),
    ("Khammam", "Telangana", "IN"),
    ("Secunderabad", "Telangana", "IN"),

    # West Bengal (5+)
    ("Kolkata", "West Bengal", "IN"),
    ("Howrah", "West Bengal", "IN"),
    ("Durgapur", "West Bengal", "IN"),
    ("Asansol", "West Bengal", "IN"),
    ("Siliguri", "West Bengal", "IN"),
    ("Bardhaman", "West Bengal", "IN"),

    # Uttar Pradesh (5+)
    ("Lucknow", "Uttar Pradesh", "IN"),
    ("Kanpur", "Uttar Pradesh", "IN"),
    ("Agra", "Uttar Pradesh", "IN"),
    ("Varanasi", "Uttar Pradesh", "IN"),
    ("Prayagraj", "Uttar Pradesh", "IN"),
    ("Meerut", "Uttar Pradesh", "IN"),
    ("Ghaziabad", "Uttar Pradesh", "IN"),

    # Rajasthan (5+)
    ("Jaipur", "Rajasthan", "IN"),
    ("Jodhpur", "Rajasthan", "IN"),
    ("Udaipur", "Rajasthan", "IN"),
    ("Kota", "Rajasthan", "IN"),
    ("Ajmer", "Rajasthan", "IN"),
    ("Bikaner", "Rajasthan", "IN"),

    # Kerala (5+)
    ("Thiruvananthapuram", "Kerala", "IN"),
    ("Kochi", "Kerala", "IN"),
    ("Kozhikode", "Kerala", "IN"),
    ("Thrissur", "Kerala", "IN"),
    ("Kollam", "Kerala", "IN"),
    ("Palakkad", "Kerala", "IN"),

    # Madhya Pradesh (5+)
    ("Bhopal", "Madhya Pradesh", "IN"),
    ("Indore", "Madhya Pradesh", "IN"),
    ("Jabalpur", "Madhya Pradesh", "IN"),
    ("Gwalior", "Madhya Pradesh", "IN"),
    ("Ujjain", "Madhya Pradesh", "IN"),
    ("Sagar", "Madhya Pradesh", "IN"),

    # Andhra Pradesh (5+)
    ("Visakhapatnam", "Andhra Pradesh", "IN"),
    ("Vijayawada", "Andhra Pradesh", "IN"),
    ("Guntur", "Andhra Pradesh", "IN"),
    ("Nellore", "Andhra Pradesh", "IN"),
    ("Tirupati", "Andhra Pradesh", "IN"),
    ("Kurnool", "Andhra Pradesh", "IN"),

    # Punjab (5+)
    ("Ludhiana", "Punjab", "IN"),
    ("Amritsar", "Punjab", "IN"),
    ("Jalandhar", "Punjab", "IN"),
    ("Patiala", "Punjab", "IN"),
    ("Bathinda", "Punjab", "IN"),
    ("Mohali", "Punjab", "IN"),

    # Haryana (5+)
    ("Faridabad", "Haryana", "IN"),
    ("Gurugram", "Haryana", "IN"),
    ("Panipat", "Haryana", "IN"),
    ("Ambala", "Haryana", "IN"),
    ("Yamunanagar", "Haryana", "IN"),
    ("Rohtak", "Haryana", "IN"),
]

UK = [
    # England
    ("London", "England", "UK"),
    ("Manchester", "England", "UK"),
    ("Birmingham", "England", "UK"),
    ("Leeds", "England", "UK"),
    ("Liverpool", "England", "UK"),
    ("Sheffield", "England", "UK"),
    ("Bristol", "England", "UK"),
    ("Newcastle upon Tyne", "England", "UK"),
    ("Nottingham", "England", "UK"),
    ("Southampton", "England", "UK"),
    ("Leicester", "England", "UK"),
    ("Coventry", "England", "UK"),
    ("Bradford", "England", "UK"),
    ("Oxford", "England", "UK"),
    ("Cambridge", "England", "UK"),
    ("Brighton", "England", "UK"),
    ("Exeter", "England", "UK"),
    ("Plymouth", "England", "UK"),
    ("Reading", "England", "UK"),
    ("Portsmouth", "England", "UK"),
    # Scotland
    ("Edinburgh", "Scotland", "UK"),
    ("Glasgow", "Scotland", "UK"),
    ("Aberdeen", "Scotland", "UK"),
    ("Dundee", "Scotland", "UK"),
    ("Inverness", "Scotland", "UK"),
    # Wales
    ("Cardiff", "Wales", "UK"),
    ("Swansea", "Wales", "UK"),
    ("Newport", "Wales", "UK"),
    # Northern Ireland
    ("Belfast", "Northern Ireland", "UK"),
    ("Derry", "Northern Ireland", "UK"),
]

UAE = [
    # Abu Dhabi
    ("Abu Dhabi", "Abu Dhabi", "AE"),
    ("Al Ain", "Abu Dhabi", "AE"),
    # Dubai
    ("Dubai", "Dubai", "AE"),
    # Sharjah
    ("Sharjah", "Sharjah", "AE"),
    # Ajman
    ("Ajman", "Ajman", "AE"),
    # Umm Al Quwain
    ("Umm Al Quwain", "Umm Al Quwain", "AE"),
    # Ras Al Khaimah
    ("Ras Al Khaimah", "Ras Al Khaimah", "AE"),
    ("Al Jazirah Al Hamra", "Ras Al Khaimah", "AE"),
    # Fujairah
    ("Fujairah", "Fujairah", "AE"),
    ("Dibba Al Fujairah", "Fujairah", "AE"),
]

USA = [
    # California (heavy coverage)
    ("Los Angeles", "California", "US"),
    ("San Francisco", "California", "US"),
    ("San Diego", "California", "US"),
    ("San Jose", "California", "US"),
    ("Sacramento", "California", "US"),
    ("Fresno", "California", "US"),
    ("Long Beach", "California", "US"),
    ("Oakland", "California", "US"),
    ("Bakersfield", "California", "US"),
    ("Anaheim", "California", "US"),
    ("Riverside", "California", "US"),
    ("Santa Ana", "California", "US"),
    ("Stockton", "California", "US"),
    ("Irvine", "California", "US"),
    ("Chula Vista", "California", "US"),

    # New York (heavy coverage)
    ("New York City", "New York", "US"),
    ("New York", "New York", "US"),
    ("Buffalo", "New York", "US"),
    ("Rochester", "New York", "US"),
    ("Yonkers", "New York", "US"),
    ("Syracuse", "New York", "US"),
    ("Albany", "New York", "US"),

    # Texas (heavy coverage)
    ("Houston", "Texas", "US"),
    ("Dallas", "Texas", "US"),
    ("Austin", "Texas", "US"),
    ("San Antonio", "Texas", "US"),
    ("Fort Worth", "Texas", "US"),
    ("El Paso", "Texas", "US"),
    ("Arlington", "Texas", "US"),
    ("Corpus Christi", "Texas", "US"),
    ("Plano", "Texas", "US"),
    ("Lubbock", "Texas", "US"),

    # Florida (heavy coverage)
    ("Miami", "Florida", "US"),
    ("Orlando", "Florida", "US"),
    ("Tampa", "Florida", "US"),
    ("Jacksonville", "Florida", "US"),
    ("St. Petersburg", "Florida", "US"),
    ("Hialeah", "Florida", "US"),
    ("Tallahassee", "Florida", "US"),
    ("Fort Lauderdale", "Florida", "US"),
    ("Cape Coral", "Florida", "US"),
    ("Pembroke Pines", "Florida", "US"),

    # Other major US cities
    ("Chicago", "Illinois", "US"),
    ("Phoenix", "Arizona", "US"),
    ("Philadelphia", "Pennsylvania", "US"),
    ("San Antonio", "Texas", "US"),
    ("Seattle", "Washington", "US"),
    ("Denver", "Colorado", "US"),
    ("Boston", "Massachusetts", "US"),
    ("Nashville", "Tennessee", "US"),
    ("Las Vegas", "Nevada", "US"),
    ("Portland", "Oregon", "US"),
    ("Memphis", "Tennessee", "US"),
    ("Louisville", "Kentucky", "US"),
    ("Baltimore", "Maryland", "US"),
    ("Milwaukee", "Wisconsin", "US"),
    ("Albuquerque", "New Mexico", "US"),
    ("Tucson", "Arizona", "US"),
    ("Fresno", "California", "US"),
    ("Mesa", "Arizona", "US"),
    ("Kansas City", "Missouri", "US"),
    ("Atlanta", "Georgia", "US"),
    ("Omaha", "Nebraska", "US"),
    ("Colorado Springs", "Colorado", "US"),
    ("Raleigh", "North Carolina", "US"),
    ("Virginia Beach", "Virginia", "US"),
    ("Minneapolis", "Minnesota", "US"),
    ("Honolulu", "Hawaii", "US"),
    ("New Orleans", "Louisiana", "US"),
    ("Cleveland", "Ohio", "US"),
    ("Detroit", "Michigan", "US"),
    ("Pittsburgh", "Pennsylvania", "US"),
    ("Indianapolis", "Indiana", "US"),
    ("Charlotte", "North Carolina", "US"),
]


def seed() -> int:
    sql = "INSERT OR IGNORE INTO locations (city, state, country) VALUES (?, ?, ?)"
    counts: dict[str, int] = {}

    with get_conn() as conn:
        for dataset, label in [
            (INDIA, "IN"),
            (UK, "UK"),
            (UAE, "AE"),
            (USA, "US"),
        ]:
            inserted = 0
            for city, state, country in dataset:
                cur = conn.execute(sql, (city, state, country))
                inserted += cur.rowcount
            counts[label] = inserted

    total = sum(counts.values())
    for label, n in counts.items():
        print(f"  locations seeded ({label}): {n}")
    print(f"Seeded {total} location rows total")
    return total


if __name__ == "__main__":
    seed()
