export interface ChatResponse {
  answer: string;
  citations: string[];
}

export interface ChallanResponse {
  fine_first: number;
  fine_repeat: number;
  mv_section: string;
  compoundable: boolean;
  severity: string;
  how_to_pay: string;
}

export interface RightsResponse {
  documents_required: string[];
  cop_powers: string[];
  cop_cannot_demand: string[];
  dispute_steps: string[];
  payment_link: string;
}

export interface VerifyFineResponse {
  is_correct: boolean;
  actual_amount: number;
  difference: number;
}

export interface Violation {
  code: string;
  name: string;
  vehicle_types: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function queryChat(question: string, language: string): Promise<ChatResponse> {
  await delay(800);
  return {
    answer: `Based on Indian traffic laws, ${question}. This information is provided as general guidance and may vary by state.`,
    citations: ["Motor Vehicles Act, 1988", "Central Motor Vehicles Rules, 1989"]
  };
}

export async function calculateChallan(
  location: string,
  violation: string,
  vehicle_type: string
): Promise<ChallanResponse> {
  await delay(800);
  
  const violations: Record<string, ChallanResponse> = {
    "no helmet": {
      fine_first: 1000,
      fine_repeat: 1500,
      mv_section: "Section 129",
      compoundable: true,
      severity: "Minor",
      how_to_pay: "https://parivahan.gov.in"
    },
    "no seatbelt": {
      fine_first: 1000,
      fine_repeat: 1500,
      mv_section: "Section 138(3)",
      compoundable: true,
      severity: "Minor",
      how_to_pay: "https://parivahan.gov.in"
    },
    "overspeeding": {
      fine_first: 2000,
      fine_repeat: 4000,
      mv_section: "Section 183",
      compoundable: true,
      severity: "Moderate",
      how_to_pay: "https://parivahan.gov.in"
    },
    "drunk driving": {
      fine_first: 10000,
      fine_repeat: 15000,
      mv_section: "Section 185",
      compoundable: false,
      severity: "Major",
      how_to_pay: "https://parivahan.gov.in"
    },
    "red light jumping": {
      fine_first: 1000,
      fine_repeat: 2000,
      mv_section: "Section 177",
      compoundable: true,
      severity: "Minor",
      how_to_pay: "https://parivahan.gov.in"
    },
    "using mobile phone": {
      fine_first: 5000,
      fine_repeat: 10000,
      mv_section: "Section 184",
      compoundable: true,
      severity: "Moderate",
      how_to_pay: "https://parivahan.gov.in"
    }
  };

  return violations[violation.toLowerCase()] || {
    fine_first: 500,
    fine_repeat: 1000,
    mv_section: "Section 177",
    compoundable: true,
    severity: "Minor",
    how_to_pay: "https://parivahan.gov.in"
  };
}

export async function getRights(location: string, language: string): Promise<RightsResponse> {
  await delay(800);
  return {
    documents_required: [
      "Driving License",
      "Vehicle Registration Certificate (RC)",
      "Valid Insurance Certificate",
      "Pollution Under Control (PUC) Certificate"
    ],
    cop_powers: [
      "Stop and inspect your vehicle",
      "Check your driving license and vehicle documents",
      "Issue challan for traffic violations",
      "Seize vehicle if documents are invalid"
    ],
    cop_cannot_demand: [
      "Force you to get out of the vehicle without reason",
      "Confiscate your original documents (only seize if invalid)",
      "Demand bribe or payment on the spot",
      "Search your vehicle without reasonable suspicion"
    ],
    dispute_steps: [
      "Note the police officer's name and badge number",
      "Request a copy of the challan",
      "Pay the fine if you agree with the violation",
      "File a complaint with the traffic police if you disagree",
      "Approach the court if the matter is not resolved"
    ],
    payment_link: "https://parivahan.gov.in"
  };
}

export async function verifyFine(
  location: string,
  violation: string,
  amount_told: number
): Promise<VerifyFineResponse> {
  await delay(800);
  
  const actualAmounts: Record<string, number> = {
    "no helmet": 1000,
    "no seatbelt": 1000,
    "overspeeding": 2000,
    "drunk driving": 10000,
    "red light jumping": 1000,
    "using mobile phone": 5000
  };
  
  const actualAmount = actualAmounts[violation.toLowerCase()] || 500;
  const isCorrect = amount_told === actualAmount;
  
  return {
    is_correct: isCorrect,
    actual_amount: actualAmount,
    difference: Math.abs(amount_told - actualAmount)
  };
}

export async function getViolations(country: string, state: string): Promise<Violation[]> {
  await delay(800);
  return [
    {
      code: "MV-129",
      name: "No Helmet",
      vehicle_types: ["Two-wheeler"]
    },
    {
      code: "MV-138(3)",
      name: "No Seatbelt",
      vehicle_types: ["Four-wheeler"]
    },
    {
      code: "MV-183",
      name: "Overspeeding",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    },
    {
      code: "MV-185",
      name: "Drunk Driving",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    },
    {
      code: "MV-177",
      name: "Red Light Jumping",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    },
    {
      code: "MV-184",
      name: "Using Mobile Phone",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    },
    {
      code: "MV-132",
      name: "No Pollution Certificate",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    },
    {
      code: "MV-139",
      name: "No Insurance",
      vehicle_types: ["Two-wheeler", "Three-wheeler", "Four-wheeler"]
    }
  ];
}
