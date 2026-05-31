export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function jsonOrThrow(res: Response) {
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}

// ── offline helpers ──────────────────────────────────────────────────────────

/** Load the pre-built violations snapshot (served from /offline/violations.json). */
async function loadOfflineViolations(): Promise<Record<string, ViolationsResponse>> {
  try {
    const res = await fetch("/offline/violations.json");
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

/** Load the pre-built rights snapshot (served from /offline/rights.json). */
async function loadOfflineRights(): Promise<Record<string, RightsResponse>> {
  try {
    const res = await fetch("/offline/rights.json");
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

/**
 * Derive a violations lookup key from country + optional state.
 * Mirrors the key format written by build-offline-snapshot.mjs.
 */
function violationsKey(country: string, state?: string): string {
  return state ? `${country}__${state}` : country;
}

// ── public types ─────────────────────────────────────────────────────────────

export type Lang = "en" | "hi";

export type Citation = { section: string; source: string };
export type SourceDoc = { title: string; snippet: string; url: string | null };

export type QueryResponse = {
  answer: string;
  language: Lang;
  citations: Citation[];
  source_documents: SourceDoc[];
  confidence: "high" | "medium" | "low";
};

export async function postQuery(
  question: string,
  language: Lang = "en",
  location_hint?: string,
): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, language, location_hint }),
  });
  return jsonOrThrow(res);
}

export type ChallanResponse = {
  location: { city: string | null; state: string | null; country: string };
  violation_code: string;
  violation_name: string;
  vehicle_type: string;
  fine_first: number;
  fine_repeat: number | null;
  suspension_days: number;
  currency: string;
  section_reference: string | null;
  compoundable: boolean;
  severity: "minor" | "serious" | "criminal";
  how_to_pay: string | null;
  summary: string;
  /** Present when the response was served from the offline snapshot. */
  __offline?: true;
};

export async function postChallan(payload: {
  location: string;
  violation: string;
  vehicle_type: string;
  is_repeat?: boolean;
  language?: Lang;
}): Promise<ChallanResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/challan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return jsonOrThrow(res);
  } catch {
    // Network error — try offline snapshot
    const snapshot = await loadOfflineViolations();
    // Best-effort: search all snapshot entries for a matching violation
    for (const data of Object.values(snapshot)) {
      const match = data.violations.find(
        (v) => v.violation_code === payload.violation,
      );
      if (match) {
        const fine = payload.is_repeat ? (match.fine_repeat ?? match.fine_first) : match.fine_first;
        return {
          location: { city: null, state: payload.location, country: data.country },
          violation_code: match.violation_code,
          violation_name: match.violation_name,
          vehicle_type: match.vehicle_type,
          fine_first: match.fine_first,
          fine_repeat: match.fine_repeat,
          suspension_days: 0,
          currency: data.currency,
          section_reference: match.section_reference,
          compoundable: match.compoundable,
          severity: match.severity,
          how_to_pay: null,
          summary: `Offline data: ${match.violation_name} — fine ${data.currency} ${fine}`,
          __offline: true,
        };
      }
    }
    throw new Error("Offline — no cached data for this violation.");
  }
}

export type RightsResponse = {
  location: { city: string | null; state: string | null; country: string };
  documents_required: string[];
  cop_can_demand: string[];
  cop_cannot_demand: string[];
  dispute_process: string;
  payment_portal_url: string | null;
  /** Present when the response was served from the offline snapshot. */
  __offline?: true;
};

export async function getRights(location: string): Promise<RightsResponse> {
  try {
    const url = `${API_BASE}/api/rights?location=${encodeURIComponent(location)}`;
    const res = await fetch(url);
    return jsonOrThrow(res);
  } catch {
    // Network error — try offline snapshot
    const snapshot = await loadOfflineRights();
    const key = location.toLowerCase();
    // Exact match first, then partial
    const entry = snapshot[key] ?? Object.entries(snapshot).find(
      ([k]) => k.includes(key) || key.includes(k),
    )?.[1];
    if (entry) {
      return { ...entry, __offline: true };
    }
    throw new Error("Offline — no cached rights data for this location.");
  }
}

export type VerifyResponse = {
  is_correct: boolean;
  actual_amount: number | null;
  amount_told: number;
  difference: number | null;
  currency: string;
  verdict: "correct" | "overcharged" | "undercharged" | "unknown_violation";
  explanation: string;
  /** Present when the response was served from the offline snapshot. */
  __offline?: true;
};

export async function postVerify(payload: {
  location: string;
  violation: string;
  vehicle_type: string;
  amount_told: number;
}): Promise<VerifyResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-fine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return jsonOrThrow(res);
  } catch {
    // Network error — derive answer from offline violations snapshot
    const snapshot = await loadOfflineViolations();
    for (const data of Object.values(snapshot)) {
      const match = data.violations.find(
        (v) => v.violation_code === payload.violation,
      );
      if (match) {
        const actual = match.fine_first;
        const diff = payload.amount_told - actual;
        const verdict =
          diff === 0 ? "correct" :
          diff > 0 ? "overcharged" : "undercharged";
        return {
          is_correct: verdict === "correct",
          actual_amount: actual,
          amount_told: payload.amount_told,
          difference: Math.abs(diff),
          currency: data.currency,
          verdict,
          explanation: `Offline data: official fine is ${data.currency} ${actual}. You were told ${data.currency} ${payload.amount_told}.`,
          __offline: true,
        };
      }
    }
    throw new Error("Offline — no cached data for this violation.");
  }
}

export type ViolationEntry = {
  violation_code: string;
  violation_name: string;
  vehicle_type: string;
  fine_first: number;
  fine_repeat: number | null;
  section_reference: string | null;
  compoundable: boolean;
  severity: "minor" | "serious" | "criminal";
};

export type ViolationsResponse = {
  country: string;
  state: string | null;
  currency: string;
  violations: ViolationEntry[];
  /** Present when the response was served from the offline snapshot. */
  __offline?: true;
};

export async function getViolations(
  country: string,
  state?: string,
): Promise<ViolationsResponse> {
  try {
    const params = new URLSearchParams({ country });
    if (state) params.set("state", state);
    const res = await fetch(`${API_BASE}/api/violations?${params}`);
    return jsonOrThrow(res);
  } catch {
    // Network error — serve from offline snapshot
    const snapshot = await loadOfflineViolations();
    // Try exact key, then country-only fallback
    const key = violationsKey(country, state);
    const entry = snapshot[key] ?? snapshot[country];
    if (entry) {
      return { ...entry, __offline: true };
    }
    throw new Error("Offline — no cached violations data for this location.");
  }
}
