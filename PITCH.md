# DriveLegal

**Location-aware traffic-law assistant**

Road Safety Hackathon 2026 · CoERS / RBG Labs / IIT Madras

Sub-track: DriveLegal

---

# The Problem

- Most citizens have no idea what the actual fine for a traffic violation is in their city.
- Legal language in the Motor Vehicles Act and state rules is inaccessible to the average driver.
- Corrupt or mistaken on-the-spot demands go unchallenged — no reference point to push back.
- India alone recorded 1.68 lakh road accident deaths in 2022 (MoRTH); poor legal awareness compounds the toll.

---

# The Solution

**DriveLegal** — one app, four tools:

- **Chat** — ask any traffic-law question in plain English or Hindi; get a cited, RAG-grounded answer.
- **Challan Calculator** — pick city + violation + vehicle type, get the exact statutory fine and law section.
- **Know Your Rights** — required documents, what a cop can and cannot legally demand, dispute steps.
- **Scam Verifier** — enter what you were told to pay; the app compares it against the official amount.

Bilingual (EN / HI). Web + mobile (Expo). Works offline via cached snapshot.

---

# Demo: Chat

Judge types: `"What's the fine for no helmet in Mumbai?"`

1. Query hits `POST /api/query` with `location_hint: "Mumbai"`.
2. RAG layer retrieves MV Act §129 chunk from ChromaDB.
3. Claude synthesises: *"Under MV Act Section 129, riding without a helmet in Maharashtra is ₹1,000 for the first offence plus a 3-month licence suspension."*
4. Response renders with citation badges: `[MV Act Section 129]`.
5. Confidence indicator shows `high`; low-confidence answers carry an automatic caveat.

Switch the language toggle to Hindi — the same flow returns Devanagari text.

---

# Demo: Challan Calculator

**Inputs:** Mumbai · No helmet · Two-wheeler · First offence

**Output card:**

| Field | Value |
|---|---|
| Fine (first) | INR 1,000 |
| Fine (repeat) | INR 1,000 |
| Suspension | 90 days |
| Section | MV Act 1988 §129 |
| Compoundable | Yes |
| Pay at | echallan.parivahan.gov.in |

Summary line: *"Riding without a helmet in Maharashtra is ₹1,000 plus a 3-month licence suspension. This offence is compoundable — you can settle on the spot."*

---

# Demo: Scam Verifier

**Scenario:** Officer demands ₹2,500 for jumping a red light in Bengaluru.

**Inputs:** Karnataka · Red light · Car · Amount told: ₹2,500

**Verdict card:**

| | |
|---|---|
| Amount told | INR 2,500 |
| Actual (official) | INR 1,000 |
| Difference | INR 1,500 |
| Verdict | **OVERCHARGED** |

Explanation: *"First-offence red-light jumping in Karnataka is ₹1,000 under MV Act Section 184. You are being overcharged by ₹1,500. Ask for an official challan receipt."*

---

# Global Applicability

**Countries seeded:**

| Country | Scope |
|---|---|
| India | National + Maharashtra, Delhi, Karnataka, Tamil Nadu, Gujarat |
| United Kingdom | National schedule |
| UAE | Dubai, Abu Dhabi, Sharjah |
| USA | California, New York, Texas, Florida |

- 120+ fine entries across jurisdictions.
- 200+ cities resolvable by the geo-lookup service.
- Rights data (documents, cop powers, dispute process, payment portal) per jurisdiction.
- Violation catalogue covers 14 standard codes — drunk driving through wrong-way.

---

# Offline Mode

- Next.js web app ships a **service worker** that caches the last-fetched fine schedule and rights data.
- On subsequent visits without a network, the cache snapshot serves calculator and rights lookups instantly.
- Chat and verify fall back gracefully with a banner: *"Offline — showing cached data."*
- Expo mobile app mirrors this pattern with local AsyncStorage persistence.
- Designed for low-bandwidth conditions on Indian highways where 4G is inconsistent.

---

# Technical Architecture

```
Browser / Expo mobile
        |
   Next.js  (React, Tailwind, EN/HI i18n, Service Worker)
        |  REST JSON
   FastAPI  (Python 3.12, Uvicorn)
     |          |            |
  SQLite     ChromaDB      Anthropic Claude
  (fines,    (RAG index,   (claude-sonnet-4-6)
   rights)    LangChain)   [Ollama dev fallback]
```

- **Geo service** — city name -> state -> country, 200+ cities.
- **RAG** — ChromaDB + keyword-scoring fallback (no ML deps required).
- **Claude client** — switches to deterministic RAG answer when `ANTHROPIC_API_KEY` is absent.
- 18 passing backend tests; Swagger UI auto-generated at `/docs`.

---

# Alignment with Evaluation Criteria

| Criterion | DriveLegal Deliverable |
|---|---|
| **Legal accuracy** | Every fine is sourced from the MV Act / state schedules and stored with its section reference; RAG retrieval grounds Claude answers in the corpus; low-confidence answers are flagged. |
| **Calculator correctness** | `POST /api/challan` returns statutory first/repeat amount, suspension days, compoundability, and payment URL — tested against 18 unit tests. |
| **Information integration across countries** | India (5 states), UK, UAE, USA (4 states) in one unified API; currency, section reference, and rights data adapt per jurisdiction. |
| **UI / Accessibility** | Bilingual EN/HI toggle on every screen; semantic HTML; mobile-responsive (Next.js web + Expo native); offline-capable service worker. |

---

# Roadmap

- **More Indian languages** — Tamil, Marathi, Telugu (i18n strings + Hindi pipeline already in place).
- **More jurisdictions** — remaining Indian states; EU (Germany, France); Singapore; Australia.
- **Photo-of-challan OCR** — snap a challan, auto-fill the verify form.
- **Voice input** — Web Speech API for drivers who cannot type while pulled over.
- **Push alerts** — notify users of fine-schedule changes in their registered state.

---

# Team and Try It

**Team:** `<fill in — add all team members' names and roles here>`

**Mentor / guide:** `<fill in if applicable>`

**Try the demo:** `<insert live demo URL here>`

**Backend repo:** `<insert repo URL>`
**Frontend repo:** `<insert repo URL>`

> To judges: the backend API is live at the demo URL above.
> Run `GET /api/health` to confirm liveness, then try `POST /api/challan` with the Mumbai / no_helmet example from slide 5.
