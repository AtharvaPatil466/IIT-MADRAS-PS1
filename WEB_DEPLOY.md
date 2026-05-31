# DriveLegal Web — Vercel Deployment Guide

## Prerequisites

- Vercel account at [vercel.com](https://vercel.com) (free Hobby tier is sufficient)
- Repo pushed to GitHub (any branch; `main` recommended)
- Backend already deployed and its public URL known (see `BACKEND_DEPLOY.md`)

---

## Deployment Steps

### 1. Connect the repo on Vercel

In the Vercel dashboard: **Add New > Project**, then import your GitHub repo.

### 2. Set Root Directory

In the **Configure Project** screen set **Root Directory** to `drivelegal-web`.

Vercel will auto-detect Next.js from `package.json` and set:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (runs `prebuild` first via npm lifecycle)
- **Output Directory**: `.next` (Vercel manages this automatically)
- **Install Command**: `npm install`

No `vercel.json` is needed — Next.js 14.2.x on Vercel is fully supported by auto-detection. `output: 'export'` is NOT set in `next.config.mjs`, so SSR routes and the service worker remain intact.

### 3. Add the environment variable

In **Environment Variables**, add:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_API_BASE` | `https://<your-backend-url>` | Production, Preview |

Replace `<your-backend-url>` with the deployed backend URL (e.g. `https://drivelegal-api.onrender.com`).

This variable is read by both `lib/api.ts` (runtime fetch calls) and `scripts/build-offline-snapshot.mjs` (prebuild snapshot fetch).

### 4. Deploy

Click **Deploy**. Vercel will:

1. Run `npm install`
2. Run `npm run prebuild` — fetches from `NEXT_PUBLIC_API_BASE` to populate `public/offline/violations.json` and `public/offline/rights.json`
3. Run `next build`
4. Serve the app globally via Vercel's edge network

---

## Post-Deploy Checks

- **Chat works**: open the deployed URL, ask a traffic-law question, and confirm the answer comes from the backend.
- **Service worker registers**: DevTools > Application > Service Workers — should show `sw.js` as activated.
- **Offline data populated**: visit `https://<your-vercel-url>/offline/violations.json` — should return a JSON object with country/state keys, not `{}`.
- **No CORS errors**: the backend `app/main.py` already sets permissive `allow_origins`; if you see CORS errors, verify `NEXT_PUBLIC_API_BASE` points to the correct backend URL.

---

## Troubleshooting

### Offline JSON files are empty (`{}`)

The prebuild script exits gracefully when it cannot reach the backend, leaving `public/offline/violations.json` and `public/offline/rights.json` as empty objects.

**Best fix — set the env var in Vercel build environment:**

Ensure `NEXT_PUBLIC_API_BASE` is set in Vercel's environment variables (step 3 above) with the live backend URL *before* deploying. On the next redeploy Vercel will call the live backend during `prebuild` and write real data.

**Fallback — commit pre-populated files locally:**

1. Set `NEXT_PUBLIC_API_BASE=https://<backend-url>` in your shell.
2. Run `npm run prebuild` from `drivelegal-web/` — this writes `public/offline/violations.json` and `public/offline/rights.json`.
3. Commit both files: `git add drivelegal-web/public/offline/ && git commit -m "chore: seed offline snapshot"`.
4. Push and redeploy on Vercel.

### Service worker not registering

Check the browser console for registration errors. Common causes:

- HTTPS is required for service workers; Vercel provides HTTPS by default on all deployments.
- On re-deploys the old SW cache version (`drivelegal-v1`) is cleared automatically by the `activate` handler.

### CORS errors in browser console

- Confirm `NEXT_PUBLIC_API_BASE` matches the exact deployed backend URL (no trailing slash, correct scheme).
- The backend `allow_origins` is already set to `["*"]` in `drivelegal/app/main.py`, so CORS should not be an issue.

---

## Notes

- Vercel's free Hobby tier supports unlimited personal projects and handles this app comfortably (Next.js App Router + static service worker + offline JSON assets).
- The app uses SSR-capable Next.js App Router pages — do **not** add `output: 'export'` to `next.config.mjs`, as that would break SSR and the service worker.
- Next.js 14.2.x only supports `next.config.js` and `next.config.mjs` as config filenames. A `next.config.ts` would be silently ignored (or throw if no `.mjs` exists) — this was removed from the project.
