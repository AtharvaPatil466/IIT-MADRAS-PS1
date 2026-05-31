// Physical phones can't reach localhost — set EXPO_PUBLIC_API_BASE to your machine's LAN IP.
const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
}

export interface ChallanResult {
  location: LocationInfo;
  violation_code: string;
  violation_name: string;
  vehicle_type: string;
  fine_first: number;
  fine_repeat: number;
  suspension_days: number | null;
  currency: string;
  section_reference: string;
  compoundable: boolean;
  severity: string;
  how_to_pay: string;
  summary: string;
}

export interface Citation {
  section: string;
  source: string;
}

export interface SourceDocument {
  title: string;
  snippet: string;
  url: string | null;
}

export interface QueryResult {
  answer: string;
  language: string;
  citations: Citation[];
  source_documents: SourceDocument[];
  confidence: "high" | "medium" | "low";
}

export interface RightsResult {
  location: LocationInfo;
  documents_required: string[];
  cop_can_demand: string[];
  cop_cannot_demand: string[];
  dispute_process: string;
  payment_portal_url: string;
}

export interface VerifyResult {
  is_correct: boolean;
  actual_amount: number;
  amount_told: number;
  difference: number;
  currency: string;
  verdict: "correct" | "overcharged" | "undercharged" | "unknown_violation";
  explanation: string;
}

export interface ViolationItem {
  violation_code: string;
  violation_name: string;
  vehicle_type: string;
  fine_first: number;
  fine_repeat: number;
  section_reference: string;
  compoundable: boolean;
  severity: string;
}

export interface ViolationsResult {
  country: string;
  state: string;
  currency: string;
  violations: ViolationItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}${path}?${qs}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── API functions ──────────────────────────────────────────────────────────

export async function queryChat(
  question: string,
  language: string = "en",
  location_hint?: string
): Promise<QueryResult> {
  return post<QueryResult>("/api/query", { question, language, location_hint });
}

export async function calculateChallan(
  location: string,
  violation: string,
  vehicle_type: string,
  is_repeat: boolean = false,
  language: string = "en"
): Promise<ChallanResult> {
  return post<ChallanResult>("/api/challan", {
    location,
    violation,
    vehicle_type,
    is_repeat,
    language,
  });
}

export async function getRights(location: string): Promise<RightsResult> {
  return get<RightsResult>("/api/rights", { location });
}

export async function verifyFine(
  location: string,
  violation: string,
  vehicle_type: string,
  amount_told: number,
  currency: string = "INR"
): Promise<VerifyResult> {
  return post<VerifyResult>("/api/verify-fine", {
    location,
    violation,
    vehicle_type,
    amount_told,
    currency,
  });
}

export async function getViolations(
  country: string,
  state: string
): Promise<ViolationsResult> {
  return get<ViolationsResult>("/api/violations", { country, state });
}
