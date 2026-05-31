/**
 * DriveLegal Service Worker
 * Strategy:
 *  - App shell + offline JSON: cache-first (install-time precache)
 *  - /_next/static/* and /offline/*: cache-first (runtime)
 *  - /api/*: network-first (runtime), no cache fallback
 *  - Everything else: network-first with cache fallback
 */

const CACHE_NAME = "drivelegal-v1";

const PRECACHE_URLS = [
  "/",
  "/calculator",
  "/rights",
  "/verify",
  "/offline/violations.json",
  "/offline/rights.json",
];

// ── Install: precache app shell ───────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch((err) => {
        // If some URLs fail (e.g. during dev), still activate
        console.warn("[SW] Precache partial failure:", err);
      }),
    ).then(() => self.skipWaiting()),
  );
});

// ── Activate: purge old caches ────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin + our API origin
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // /api/* — network-first, no cache fallback (live data preferred)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // /_next/static/* and /offline/* — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/offline/")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else (pages, fonts, images) — network-first with cache fallback
  event.respondWith(networkFirst(request));
});

// ── Strategies ────────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // No network, no cache — return a minimal 503
    return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
  }
}
