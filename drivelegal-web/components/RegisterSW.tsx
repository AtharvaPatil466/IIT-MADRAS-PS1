"use client";

import { useEffect } from "react";

/**
 * Registers the DriveLegal service worker (/sw.js) once the page has loaded.
 * Must be rendered inside a Client Component tree.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[SW] Registered, scope:", reg.scope);
        })
        .catch((err) => {
          // Non-fatal — offline mode won't work but the app still loads
          console.warn("[SW] Registration failed:", err);
        });
    });
  }, []);

  return null;
}
