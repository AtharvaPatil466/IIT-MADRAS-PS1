# DriveLegal — Backend ↔ Frontend API Contract v1

Base URL (local dev): `http://localhost:8000`
All endpoints accept and return `application/json`.

Currency in responses is the local one (INR, GBP, AED, USD).
Amounts are numbers (no symbols, no commas).
Missing data fields are returned as `null`, not omitted.

---

## 1. POST `/api/challan` — Challan Calculator

The centrepiece. Given a location + violation + vehicle, returns the exact fine.

### Request
```json
{
  "location": "Pune",
  "violation": "no_helmet",
  "vehicle_type": "two_wheeler",
  "is_repeat": false,
  "language": "en"
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `location` | string | yes | City, state, or country name. Geo-fenced to nearest match. |
| `violation` | string | yes | Either a `violation_code` (e.g. `no_helmet`) or a free-text description. |
| `vehicle_type` | string | no | One of: `two_wheeler`, `car`, `commercial`, `all`. Defaults to `all`. |
| `is_repeat` | bool | no | If true, return repeat-offence amount. Default `false`. |
| `language` | string | no | `en` (default) or `hi`. |

### Response (200)
```json
{
  "location": { "city": "Pune", "state": "Maharashtra", "country": "IN" },
  "violation_code": "no_helmet",
  "violation_name": "Riding without helmet",
  "vehicle_type": "two_wheeler",
  "fine_first": 1000,
  "fine_repeat": 1000,
  "suspension_days": 90,
  "currency": "INR",
  "section_reference": "MV Act 1988 Section 129",
  "compoundable": true,
  "severity": "minor",
  "how_to_pay": "https://echallan.parivahan.gov.in/",
  "summary": "Under MV Act Section 129, riding without a helmet in Maharashtra is ₹1,000 for the first offence plus a 3-month licence suspension. This offence is compoundable — you can pay on the spot."
}
```

### Errors
| Code | Meaning |
| --- | --- |
| 404 | No matching fine for that location + violation. |
| 422 | Invalid request body. |

---

## 2. POST `/api/query` — Natural Language Q&A (RAG)

Free-form questions. RAG-grounded, returns citations.

### Request
```json
{
  "question": "Can cops stop me for tinted windows in Delhi?",
  "language": "en",
  "location_hint": "Delhi"
}
```

### Response (200)
```json
{
  "answer": "Yes — under MV Act Section 100 and CMVR Rule 100, sun-film with visible light transmission below 70% (front/rear) or 50% (side) is prohibited. Delhi Traffic Police can stop and challan you ₹500 (first offence) under Section 177.",
  "language": "en",
  "citations": [
    { "section": "MV Act Section 100", "source": "Motor Vehicles Act 1988" },
    { "section": "CMVR Rule 100", "source": "Central Motor Vehicle Rules" }
  ],
  "source_documents": [
    { "title": "MV Act 1988 — Section 100", "snippet": "...", "url": null }
  ],
  "confidence": "high"
}
```

`confidence` is one of `high`, `medium`, `low`. `low` is returned when the model could not ground the answer firmly in retrieved docs — frontend should display a caveat.

---

## 3. GET `/api/rights?location=<city>` — Know Your Rights

### Response (200)
```json
{
  "location": { "city": "Mumbai", "state": "Maharashtra", "country": "IN" },
  "documents_required": [
    "Driving Licence",
    "Vehicle Registration Certificate (RC)",
    "Insurance Certificate",
    "Pollution Under Control (PUC) Certificate"
  ],
  "cop_can_demand": [
    "Inspect documents in person",
    "Issue an on-the-spot challan for compoundable offences",
    "Seize licence for serious violations (with receipt)"
  ],
  "cop_cannot_demand": [
    "Cash without an official receipt",
    "Confiscate original documents without a written notice",
    "Stop a vehicle without identifying themselves"
  ],
  "dispute_process": "Step 1: Request a written challan...",
  "payment_portal_url": "https://echallan.parivahan.gov.in/"
}
```

---

## 4. POST `/api/verify-fine` — "Am I Being Scammed?"

### Request
```json
{
  "location": "Bengaluru",
  "violation": "red_light",
  "vehicle_type": "car",
  "amount_told": 2500,
  "currency": "INR"
}
```

### Response (200)
```json
{
  "is_correct": false,
  "actual_amount": 1000,
  "amount_told": 2500,
  "difference": 1500,
  "currency": "INR",
  "verdict": "overcharged",
  "explanation": "First-offence red-light jumping in Karnataka is ₹1,000 under MV Act Section 184. You are being overcharged by ₹1,500. Ask for an official challan receipt."
}
```

`verdict` ∈ {`correct`, `overcharged`, `undercharged`, `unknown_violation`}.

---

## 5. GET `/api/violations?country=IN&state=Maharashtra` — Catalogue

Lists every violation we have data for at the given scope.

### Response (200)
```json
{
  "country": "IN",
  "state": "Maharashtra",
  "currency": "INR",
  "violations": [
    {
      "violation_code": "no_helmet",
      "violation_name": "Riding without helmet",
      "vehicle_type": "two_wheeler",
      "fine_first": 1000,
      "fine_repeat": 1000,
      "section_reference": "MV Act Section 129",
      "compoundable": true,
      "severity": "minor"
    }
  ]
}
```

---

## Standard violation codes (v1)

Used by `/challan`, `/verify-fine`, `/violations`. Frontend can hard-code this list for the dropdown:

```
drunk_driving
no_helmet
no_seatbelt
mobile_use
red_light
no_licence
no_insurance
overspeeding
wrong_side
overloading
no_puc
tinted_windows
no_mot          # UK only
wrong_way       # UAE
```

## Standard vehicle types
`two_wheeler`, `car`, `commercial`, `all`

## Standard languages
`en`, `hi`

---

## Health check
`GET /api/health` → `{"status": "ok", "version": "1.0"}`
