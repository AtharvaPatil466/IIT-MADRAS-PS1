# DriveLegal — Web

Next.js 14 + Tailwind frontend for the DriveLegal API (Person B track).

## Quick start

```bash
cd drivelegal-web
npm install
cp .env.local.example .env.local      # points to http://localhost:8000

# Make sure the backend is running:
#   cd ../drivelegal && python3 -m scripts.seed_all
#   uvicorn app.main:app --reload --port 8000

npm run dev                            # http://localhost:3000
```

## Pages

| Route | Purpose | Backend |
| --- | --- | --- |
| `/` | Chat | `POST /api/query` |
| `/calculator` | Challan calculator | `GET /api/violations`, `POST /api/challan` |
| `/rights` | Know your rights | `GET /api/rights` |
| `/verify` | Scam checker | `POST /api/verify-fine` |

Hindi: toggle EN/हिं in the header — UI labels, placeholders, and the
`language=hi` flag on every API call all switch in sync.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (clean Claude-style palette: paper, ink, soft accent)
- No external UI library — small `components/ui.tsx` for buttons / cards / badges
