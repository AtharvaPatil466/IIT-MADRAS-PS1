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
};

export async function postChallan(payload: {
  location: string;
  violation: string;
  vehicle_type: string;
  is_repeat?: boolean;
  language?: Lang;
}): Promise<ChallanResponse> {
  const res = await fetch(`${API_BASE}/api/challan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}

export type RightsResponse = {
  location: { city: string | null; state: string | null; country: string };
  documents_required: string[];
  cop_can_demand: string[];
  cop_cannot_demand: string[];
  dispute_process: string;
  payment_portal_url: string | null;
};

export async function getRights(location: string): Promise<RightsResponse> {
  const url = `${API_BASE}/api/rights?location=${encodeURIComponent(location)}`;
  const res = await fetch(url);
  return jsonOrThrow(res);
}

export type VerifyResponse = {
  is_correct: boolean;
  actual_amount: number | null;
  amount_told: number;
  difference: number | null;
  currency: string;
  verdict: "correct" | "overcharged" | "undercharged" | "unknown_violation";
  explanation: string;
};

export async function postVerify(payload: {
  location: string;
  violation: string;
  vehicle_type: string;
  amount_told: number;
}): Promise<VerifyResponse> {
  const res = await fetch(`${API_BASE}/api/verify-fine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
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
};

export async function getViolations(
  country: string,
  state?: string,
): Promise<ViolationsResponse> {
  const params = new URLSearchParams({ country });
  if (state) params.set("state", state);
  const res = await fetch(`${API_BASE}/api/violations?${params}`);
  return jsonOrThrow(res);
}
