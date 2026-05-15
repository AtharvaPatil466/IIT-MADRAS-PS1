/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * API Contract for Backend Integration
 * 
 * 1. POST /api/query
 *    Body: { question: string, language: string }
 *    Returns: { answer: string, citations: string[] }
 * 
 * 2. POST /api/calculate
 *    Body: { location: string, violation: string, vehicle_type: string }
 *    Returns: { fine_first: number, fine_repeat: number, mv_section: string, compoundable: boolean, severity: string, how_to_pay: string }
 * 
 * 3. POST /api/rights
 *    Body: { location: string, language: string }
 *    Returns: { documents_required: string[], cop_powers: string[], cop_cannot_demand: string[], dispute_steps: string[], payment_link: string }
 * 
 * 4. POST /api/verify
 *    Body: { location: string, violation: string, amount_told: number }
 *    Returns: { is_correct: boolean, actual_amount: number, difference: number }
 * 
 * 5. POST /api/violations
 *    Body: { country: string, state: string }
 *    Returns: Array of { code: string, name: string, vehicle_types: string[] }
 */

const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Utility function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function queryChat(question: string, language: string = "en") {
  if (!USE_MOCK) {
    /*
    const res = await fetch(`${API_BASE}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, language })
    });
    if (!res.ok) throw new Error("API failed");
    return res.json();
    */
  }

  await delay(800);
  return {
    answer: "Based on the Motor Vehicles Act, 1988, driving without a helmet is a punishable offence under Section 129.",
    citations: ["Motor Vehicles Act, 1988, Section 129"]
  };
}

export interface ChallanResult {
  fine_first: number;
  fine_repeat: number;
  mv_section: string;
  compoundable: boolean;
  severity: string;
  how_to_pay: string;
}

const challanData: Record<string, ChallanResult> = {
  "Driving without Helmet": { fine_first: 1000, fine_repeat: 1500, mv_section: "Section 129", compoundable: true, severity: "Minor", how_to_pay: "https://parivahan.gov.in" },
  "Over-speeding": { fine_first: 2000, fine_repeat: 4000, mv_section: "Section 183", compoundable: true, severity: "Serious", how_to_pay: "https://parivahan.gov.in" },
  "Drunk Driving": { fine_first: 10000, fine_repeat: 15000, mv_section: "Section 185", compoundable: false, severity: "Criminal", how_to_pay: "https://parivahan.gov.in" },
  "Jumping Red Light": { fine_first: 1000, fine_repeat: 5000, mv_section: "Section 119/177", compoundable: true, severity: "Serious", how_to_pay: "https://parivahan.gov.in" },
  "Driving without Seatbelt": { fine_first: 1000, fine_repeat: 1500, mv_section: "Section 138(3)", compoundable: true, severity: "Minor", how_to_pay: "https://parivahan.gov.in" },
  "Using Mobile while Driving": { fine_first: 5000, fine_repeat: 10000, mv_section: "Section 184", compoundable: true, severity: "Serious", how_to_pay: "https://parivahan.gov.in" },
  "No Valid Insurance": { fine_first: 2000, fine_repeat: 4000, mv_section: "Section 196", compoundable: false, severity: "Serious", how_to_pay: "https://parivahan.gov.in" },
  "Overloading": { fine_first: 2000, fine_repeat: 5000, mv_section: "Section 194", compoundable: true, severity: "Serious", how_to_pay: "https://parivahan.gov.in" },
};

export async function calculateChallan(location: string, violation: string, vehicle_type: string): Promise<ChallanResult> {
  if (!USE_MOCK) {
    /*
    const res = await fetch(`${API_BASE}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, violation, vehicle_type })
    });
    if (!res.ok) throw new Error("API failed");
    return res.json();
    */
  }

  await delay(800);
  const data = challanData[violation];
  if (data) return data;
  return {
    fine_first: 1000,
    fine_repeat: 1500,
    mv_section: "Section 129",
    compoundable: true,
    severity: "Minor",
    how_to_pay: "https://parivahan.gov.in"
  };
}

export async function getRights(location: string, language: string = "en") {
  if (!USE_MOCK) {
    /*
    const res = await fetch(`${API_BASE}/api/rights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, language })
    });
    if (!res.ok) throw new Error("API failed");
    return res.json();
    */
  }

  await delay(800);
  return {
    documents_required: ["Driving License", "Registration Certificate (RC)", "Insurance", "PUC Certificate"],
    cop_powers: ["Can demand to see documents", "Can issue challan for visible violations", "Can impound vehicle if RC/Insurance is missing"],
    cop_cannot_demand: ["Cannot seize original documents without a receipt", "Cannot physically harass or abuse"],
    dispute_steps: ["Do not argue on the spot", "Pay under protest if necessary", "Contest the challan in a virtual traffic court"],
    payment_link: "https://echallan.parivahan.gov.in/index/accused-challan"
  };
}

export async function verifyFine(location: string, violation: string, amount_told: number) {
  if (!USE_MOCK) {
    /*
    const res = await fetch(`${API_BASE}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, violation, amount_told })
    });
    if (!res.ok) throw new Error("API failed");
    return res.json();
    */
  }

  await delay(800);
  const actual = challanData[violation]?.fine_first || 1000;
  return {
    is_correct: amount_told <= actual,
    actual_amount: actual,
    difference: amount_told > actual ? amount_told - actual : 0
  };
}

export interface Violation {
  code: string;
  name: string;
  vehicle_types: string[];
}

export async function getViolations(country: string, state: string): Promise<Violation[]> {
  if (!USE_MOCK) {
    /*
    const res = await fetch(`${API_BASE}/api/violations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state })
    });
    if (!res.ok) throw new Error("API failed");
    return res.json();
    */
  }

  await delay(800);

  if (country === "India") {
    return [
      { code: "V01", name: "Driving without Helmet", vehicle_types: ["2 Wheeler"] },
      { code: "V02", name: "Over-speeding", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "V03", name: "Drunk Driving", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "V04", name: "Jumping Red Light", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "V05", name: "Driving without Seatbelt", vehicle_types: ["Car"] },
      { code: "V06", name: "Using Mobile while Driving", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "V07", name: "No Valid Insurance", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "V08", name: "Overloading", vehicle_types: ["Commercial"] },
    ];
  }
  if (country === "United Kingdom") {
    return [
      { code: "UK01", name: "Over-speeding", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "UK02", name: "Drunk Driving", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "UK03", name: "Jumping Red Light", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "UK04", name: "Using Mobile while Driving", vehicle_types: ["Car", "Commercial"] },
    ];
  }
  if (country === "United Arab Emirates") {
    return [
      { code: "AE01", name: "Over-speeding", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "AE02", name: "Jumping Red Light", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
      { code: "AE03", name: "Driving without Seatbelt", vehicle_types: ["Car"] },
    ];
  }
  // USA
  return [
    { code: "US01", name: "Over-speeding", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
    { code: "US02", name: "Drunk Driving", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
    { code: "US03", name: "Jumping Red Light", vehicle_types: ["2 Wheeler", "Car", "Commercial"] },
    { code: "US04", name: "Driving without Seatbelt", vehicle_types: ["Car"] },
  ];
}
