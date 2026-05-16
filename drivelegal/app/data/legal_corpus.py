"""Curated legal-document chunks for the RAG retriever.

Each chunk is short, self-contained, and citable. The retriever indexes the
`text` field; `meta` is returned to callers and used to build citations.
"""

CORPUS: list[dict] = [
    {
        "id": "in_mv_185",
        "country": "IN", "title": "MV Act 1988 — Section 185 (Drunk driving)",
        "section": "MV Act Section 185",
        "source": "Motor Vehicles Act 1988 (amended 2019)",
        "url": "https://morth.nic.in/sites/default/files/MVA-Amendment-2019.pdf",
        "text": (
            "Whoever, while driving, has alcohol exceeding 30 mg per 100 ml of blood or "
            "is under the influence of a drug, shall be punishable for a first offence "
            "with imprisonment up to 6 months and/or a fine of ten thousand rupees (₹10,000); "
            "for a repeat offence within 3 years, imprisonment up to 2 years and/or fine "
            "of fifteen thousand rupees (₹15,000)."
        ),
    },
    {
        "id": "in_mv_129",
        "country": "IN", "title": "MV Act 1988 — Section 129 (Wearing of helmet)",
        "section": "MV Act Section 129",
        "source": "Motor Vehicles Act 1988",
        "url": "https://morth.nic.in/",
        "text": (
            "Every person driving or riding (otherwise than in a sidecar) on a motorcycle "
            "of any class or description shall, while in a public place, wear protective "
            "headgear conforming to the standards of the Bureau of Indian Standards. "
            "Non-compliance attracts a fine of ₹1,000 and disqualification of the licence "
            "for three months under Section 194D."
        ),
    },
    {
        "id": "in_mv_184",
        "country": "IN", "title": "MV Act 1988 — Section 184 (Dangerous driving)",
        "section": "MV Act Section 184",
        "source": "Motor Vehicles Act 1988 (amended 2019)",
        "url": "https://morth.nic.in/",
        "text": (
            "Driving dangerously — including jumping a red light, using a mobile phone "
            "while driving, driving on the wrong side, or aggressive overtaking — is "
            "punishable for first offence with up to 1 year imprisonment and/or fine "
            "between ₹1,000 and ₹5,000. Repeat offence within 3 years attracts up to "
            "2 years and/or ₹10,000."
        ),
    },
    {
        "id": "in_mv_194b",
        "country": "IN", "title": "MV Act 1988 — Section 194B (Seat belt)",
        "section": "MV Act Section 194B",
        "source": "Motor Vehicles Act 1988",
        "url": "https://morth.nic.in/",
        "text": (
            "Driver, or any person seated in a front seat or other seat provided with "
            "a seat belt, shall wear it. Contravention is punishable with a fine of "
            "₹1,000. Children under 14 must be secured in a child restraint system."
        ),
    },
    {
        "id": "in_cmvr_100",
        "country": "IN", "title": "Central MV Rule 100 — Safety glass / sun-film",
        "section": "CMVR Rule 100",
        "source": "Central Motor Vehicles Rules 1989",
        "url": "https://morth.nic.in/",
        "text": (
            "Glass of windscreen and rear window must have a Visual Light Transmission "
            "(VLT) of at least 70%, and side windows 50%. The Supreme Court (Avishek "
            "Goenka v UOI, 2012) banned all after-market sun-films. Violation is a "
            "compoundable offence under Section 177 with fine ₹500 (first) / ₹1,500."
        ),
    },
    {
        "id": "in_mv_196",
        "country": "IN", "title": "MV Act 1988 — Section 196 (No insurance)",
        "section": "MV Act Section 196",
        "source": "Motor Vehicles Act 1988 (amended 2019)",
        "url": "https://morth.nic.in/",
        "text": (
            "Driving a motor vehicle in a public place without a valid third-party "
            "insurance policy is punishable with imprisonment up to 3 months and/or "
            "fine of ₹2,000 for first offence, ₹4,000 for repeat."
        ),
    },
    {
        "id": "in_dispute",
        "country": "IN", "title": "Disputing an e-challan in India",
        "section": "Procedure",
        "source": "Parivahan e-challan portal",
        "url": "https://echallan.parivahan.gov.in/",
        "text": (
            "An e-challan can be paid or contested at echallan.parivahan.gov.in. To "
            "dispute, log in with the challan number, click 'Dispute', upload evidence "
            "(photos, dashcam, GPS), and submit. Unresolved disputes proceed to the "
            "Virtual Court or Lok Adalat. Citizens must dispute within 60 days; failing "
            "to act may result in licence suspension or vehicle blacklisting."
        ),
    },
    {
        "id": "uk_rta_s5",
        "country": "UK", "title": "Road Traffic Act 1988 — Section 5 (Drink driving)",
        "section": "RTA 1988 s.5",
        "source": "UK Road Traffic Act 1988",
        "url": "https://www.gov.uk/drink-driving-penalties",
        "text": (
            "Driving or being in charge of a motor vehicle with breath alcohol over "
            "35 micrograms per 100 ml is an offence. Penalty: up to 6 months prison, "
            "an unlimited fine, and a minimum 12-month driving ban. A high-risk offender "
            "scheme applies for repeat offences."
        ),
    },
    {
        "id": "uk_fpn",
        "country": "UK", "title": "UK Fixed Penalty Notice procedure",
        "section": "Procedure",
        "source": "gov.uk/penalty-points-endorsements",
        "url": "https://www.gov.uk/penalty-points-endorsements",
        "text": (
            "Most minor motoring offences are dealt with by a Fixed Penalty Notice "
            "(FPN). The recipient has 28 days to pay or to request a court hearing. "
            "An FPN typically endorses penalty points on the licence (3 for speeding, "
            "6 for using a mobile)."
        ),
    },
    {
        "id": "uae_redlight",
        "country": "AE", "title": "UAE Federal Traffic Law — Red signal offence",
        "section": "Federal Traffic Law",
        "source": "Ministry of Interior, UAE",
        "url": "https://www.moi.gov.ae/",
        "text": (
            "Crossing a red traffic signal carries an AED 1,000 fine, 12 black points, "
            "and 30-day vehicle impoundment. Accumulation of 24 or more black points "
            "results in a licence suspension."
        ),
    },
    {
        "id": "uae_dui",
        "country": "AE", "title": "UAE — Driving under the influence",
        "section": "Federal Traffic Law",
        "source": "Ministry of Interior, UAE",
        "url": "https://www.moi.gov.ae/",
        "text": (
            "The UAE applies zero tolerance: any measurable alcohol while driving is "
            "a criminal offence. Penalty is court-determined imprisonment and fines "
            "from AED 20,000, plus 23 black points and a minimum one-year licence ban."
        ),
    },
    {
        "id": "us_ca_dui",
        "country": "US", "title": "California Vehicle Code §23152 (DUI)",
        "section": "CVC §23152",
        "source": "California DMV",
        "url": "https://www.dmv.ca.gov/",
        "text": (
            "It is unlawful to drive with a blood alcohol concentration of 0.08% or more "
            "(0.04% commercial, 0.01% under 21). First offence: up to $1,000 fine "
            "(plus assessments totalling ~$1,800), 6-month licence suspension, and up "
            "to 6 months in county jail."
        ),
    },
    {
        "id": "us_ny_1180",
        "country": "US", "title": "NY V&T §1180 (Speeding)",
        "section": "NY V&T §1180",
        "source": "NY DMV",
        "url": "https://dmv.ny.gov/",
        "text": (
            "Speeding fines in New York range from $90 to $600 plus a mandatory $93 "
            "surcharge depending on how much over the limit. Driver Responsibility "
            "Assessment applies if 6+ points are accrued in 18 months."
        ),
    },
]
