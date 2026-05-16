# DriveLegal — Backend

AI-powered, location-aware traffic-law assistant.
Road Safety Hackathon 2026 · CoERS / RBG Labs / IIT Madras · deadline **31 May 2026**.

This repository hosts the **backend** (Person A). Frontend lives in a sibling repo and consumes the API documented in [`docs/api_contract.md`](docs/api_contract.md).

---

## Quick start

```bash
# 1. Clone + enter
cd drivelegal

# 2. Create venv + install
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Configure
cp .env.example .env        # then add your ANTHROPIC_API_KEY

# 4. One-shot: init schema + seed all data + build RAG index
python3 -m scripts.seed_all

# 5. Run the API
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for the auto-generated Swagger UI.

## Project layout

```
drivelegal/
├── app/
│   ├── main.py             # FastAPI entry
│   ├── config.py           # env + settings (pydantic)
│   ├── database.py         # SQLite connection helper
│   ├── schemas.py          # Pydantic request/response models
│   ├── routers/            # one file per endpoint
│   │   ├── challan.py
│   │   ├── query.py
│   │   ├── rights.py
│   │   ├── verify.py
│   │   └── violations.py
│   ├── services/
│   │   ├── geo.py          # city → state → country resolver
│   │   ├── lookup.py       # DB lookups for fines
│   │   ├── rag.py          # ChromaDB + LangChain  (Day 5)
│   │   └── claude_client.py# Anthropic SDK wrapper (Day 6)
│   └── data/               # seed scripts per country
├── scripts/
│   └── init_db.py          # creates SQLite schema
├── db/                     # SQLite file lives here
├── chroma/                 # ChromaDB persistence
├── docs/api_contract.md    # ← share this with frontend
├── tests/
└── requirements.txt
```

## Endpoints (v1)

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/challan` | Exact fine for location + violation + vehicle |
| `POST` | `/api/query` | Free-form Q&A (RAG-grounded) |
| `GET`  | `/api/rights` | Know-your-rights data per state/country |
| `POST` | `/api/verify-fine` | "Am I being scammed?" checker |
| `GET`  | `/api/violations` | Catalogue of violations for country/state |
| `GET`  | `/api/health` | Liveness check |

Full request/response shapes: [`docs/api_contract.md`](docs/api_contract.md).

## Status

All planned backend deliverables are implemented:

- **Data** — India (national + Maharashtra/Delhi/Karnataka/Tamil Nadu/Gujarat),
  UK, UAE, and USA (CA, NY, TX, FL) fine schedules seeded.
- **Rights** — documents, cop powers, dispute process, and payment portals per
  jurisdiction.
- **RAG** — `app/services/rag.py` indexes the legal corpus in ChromaDB when
  available, with a keyword-scoring fallback so the API works without the ML deps.
- **Claude** — `app/services/claude_client.py` calls Anthropic when
  `ANTHROPIC_API_KEY` is set; otherwise returns a deterministic RAG-grounded
  answer. Hindi via `language="hi"`.
- **Endpoints** — `/challan`, `/query`, `/rights`, `/verify-fine`, `/violations`,
  `/health` all live and tested (18 passing tests).
- **Demo cities verified** — Mumbai, Pune, Bengaluru, Chennai, Delhi, London,
  Dubai, Los Angeles.

To re-seed after editing data, just rerun `python3 -m scripts.seed_all`.
