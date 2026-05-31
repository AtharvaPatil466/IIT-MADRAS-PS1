#!/usr/bin/env node
/**
 * build-offline-snapshot.mjs
 * Fetches violation and rights data from the running backend and writes
 * static JSON files to public/offline/ for use as an offline cache seed.
 * If the backend is unreachable, logs a warning and exits 0 (non-fatal).
 */

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_DIR = join(__dirname, "..", "public", "offline");

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const VIOLATIONS_QUERIES = [
  // India — state level
  { country: "IN", state: "Maharashtra" },
  { country: "IN", state: "Delhi" },
  { country: "IN", state: "Karnataka" },
  { country: "IN", state: "Tamil Nadu" },
  { country: "IN", state: "Gujarat" },
  // Country-only fallbacks
  { country: "IN" },
  { country: "UK" },
  { country: "AE" },
  { country: "US" },
  // US state level
  { country: "US", state: "California" },
  { country: "US", state: "New York" },
  { country: "US", state: "Texas" },
  { country: "US", state: "Florida" },
];

const RIGHTS_LOCATIONS = [
  "Mumbai",
  "Pune",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "London",
  "Dubai",
  "Los Angeles",
];

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  console.log(`[offline-snapshot] Fetching from ${BASE} …`);

  // ── violations ──────────────────────────────────────────────────────────────
  const violationsMap = {};
  for (const q of VIOLATIONS_QUERIES) {
    const params = new URLSearchParams({ country: q.country });
    if (q.state) params.set("state", q.state);
    const url = `${BASE}/api/violations?${params}`;
    try {
      const data = await fetchJson(url);
      const key = q.state ? `${q.country}__${q.state}` : q.country;
      violationsMap[key] = data;
      console.log(`  ✓ violations ${key} (${data.violations?.length ?? 0} entries)`);
    } catch (err) {
      // Backend unreachable — bail out gracefully
      console.warn(`[offline-snapshot] WARNING: Could not reach backend at ${url}`);
      console.warn(`  Reason: ${err.message}`);
      console.warn("[offline-snapshot] Skipping snapshot generation (not a build failure).");
      process.exit(0);
    }
  }

  // ── rights ───────────────────────────────────────────────────────────────────
  const rightsMap = {};
  for (const loc of RIGHTS_LOCATIONS) {
    const url = `${BASE}/api/rights?location=${encodeURIComponent(loc)}`;
    try {
      const data = await fetchJson(url);
      rightsMap[loc.toLowerCase()] = data;
      console.log(`  ✓ rights ${loc}`);
    } catch (err) {
      console.warn(`[offline-snapshot] WARNING: rights fetch failed for ${loc}: ${err.message}`);
      // Continue — partial data is still useful
    }
  }

  // ── write ────────────────────────────────────────────────────────────────────
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, "violations.json"),
    JSON.stringify(violationsMap, null, 2),
  );
  writeFileSync(
    join(OUT_DIR, "rights.json"),
    JSON.stringify(rightsMap, null, 2),
  );
  console.log(`[offline-snapshot] Written to public/offline/violations.json + rights.json`);
}

main().catch((err) => {
  console.error("[offline-snapshot] Unexpected error:", err);
  // Still exit 0 — never fail the build due to missing snapshot
  process.exit(0);
});
