# DriveLegal Backend — Deployment Guide

## Prerequisites

- Render account at [render.com](https://render.com)
- Repo pushed to GitHub (any branch works; `main` recommended)
- `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com)

---

## Path A — Blueprint (recommended, one-click)

1. Commit and push this repo to GitHub (including `drivelegal/render.yaml`).
2. In Render dashboard: **New > Blueprint**.
3. Connect your GitHub account and select the repo + branch.
4. Render detects `drivelegal/render.yaml` automatically.
5. In the **Environment** section set `ANTHROPIC_API_KEY` to your real key.
6. Click **Apply** — Render builds the Docker image and deploys.

The 1 GB persistent disk (`/data`) is provisioned automatically. The service
URL will be `https://drivelegal-api.onrender.com` (or similar).

---

## Path B — Manual (Docker web service)

1. In Render dashboard: **New > Web Service**.
2. Connect the GitHub repo.
3. Set **Root Directory** to `drivelegal/` (or leave blank and point Dockerfile
   to `drivelegal/Dockerfile`).
4. Set **Runtime** to **Docker**.
5. Set **Dockerfile Path** to `./Dockerfile` and **Docker Context** to `.`.
6. Under **Environment Variables** add:

   | Key | Value |
   |-----|-------|
   | `ANTHROPIC_API_KEY` | *(your key)* |
   | `CLAUDE_MODEL` | `claude-sonnet-4-6` |
   | `DATABASE_PATH` | `/data/drivelegal.db` |
   | `CHROMA_PATH` | `/data/chroma` |
   | `DEFAULT_COUNTRY` | `IN` |
   | `LOG_LEVEL` | `INFO` |
   | `OLLAMA_TIMEOUT_S` | `5` |

7. Under **Disks**: add a disk named `data`, mount path `/data`, size 1 GB.
8. **Create Web Service**.

---

## Post-Deploy Verification

```bash
# 1. Health check
curl https://<your-render-url>/api/health
# Expected: {"status":"ok","version":"1.0"}

# 2. Pre-warm heavy assets via Render Shell
#    (Render dashboard → service → Shell tab)
python -m scripts.prewarm
# Expected lines:
#   PREWARM: embeddings ok
#   PREWARM: chroma ok (N docs indexed)
#   PREWARM: anthropic ok
#   PREWARM: all steps complete
```

---

## Troubleshooting

**Cold-start latency (free tier)**
Render free services spin down after 15 minutes of inactivity. The first
request after a spin-down takes 30–60 s. Use [UptimeRobot](https://uptimerobot.com)
(free) to ping `/api/health` every 5 minutes to keep it warm, or upgrade to
Starter plan.

**ChromaDB / ONNX model download failure**
If the first request returns a 500 with a message about ONNX or
sentence-transformers, run prewarm manually in the Render Shell:
```bash
python -m scripts.prewarm
```

**Environment variable mismatches**
Compare your Render env vars against `.env.example`. `DATABASE_PATH` and
`CHROMA_PATH` must point to `/data/...` (the persistent disk) — not `./db/`
or `./chroma/` — so data survives redeploys.

**Disk filling up**
```bash
# In Render Shell
du -sh /data/*
```
ChromaDB SQLite and the SQLite app DB together should stay well under 500 MB
for the current corpus.

---

## Local fallback (if Render free tier is asleep)

```bash
cd drivelegal
uvicorn app.main:app
# API available at http://localhost:8000
# Set ANTHROPIC_API_KEY in .env, or leave blank to use Ollama fallback.
```
