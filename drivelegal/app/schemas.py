from typing import Literal, Optional

from pydantic import BaseModel, Field

Language = Literal["en", "hi"]
VehicleType = Literal["two_wheeler", "car", "commercial", "all"]
Severity = Literal["minor", "serious", "criminal"]
Confidence = Literal["high", "medium", "low"]
Verdict = Literal["correct", "overcharged", "undercharged", "unknown_violation"]


class LocationDTO(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    country: str


class ChallanRequest(BaseModel):
    location: str = Field(..., description="City, state, or country name")
    violation: str
    vehicle_type: VehicleType = "all"
    is_repeat: bool = False
    language: Language = "en"


class ChallanResponse(BaseModel):
    location: LocationDTO
    violation_code: str
    violation_name: str
    vehicle_type: VehicleType
    fine_first: float
    fine_repeat: Optional[float] = None
    suspension_days: int = 0
    currency: str
    section_reference: Optional[str] = None
    compoundable: bool
    severity: Severity
    how_to_pay: Optional[str] = None
    summary: str


class Citation(BaseModel):
    section: str
    source: str


class SourceDoc(BaseModel):
    title: str
    snippet: str
    url: Optional[str] = None


class QueryRequest(BaseModel):
    question: str
    language: Language = "en"
    location_hint: Optional[str] = None


class QueryResponse(BaseModel):
    answer: str
    language: Language
    citations: list[Citation] = []
    source_documents: list[SourceDoc] = []
    confidence: Confidence = "medium"


class RightsResponse(BaseModel):
    location: LocationDTO
    documents_required: list[str]
    cop_can_demand: list[str]
    cop_cannot_demand: list[str]
    dispute_process: str
    payment_portal_url: Optional[str] = None


class VerifyFineRequest(BaseModel):
    location: str
    violation: str
    vehicle_type: VehicleType = "all"
    amount_told: float
    currency: Optional[str] = None


class VerifyFineResponse(BaseModel):
    is_correct: bool
    actual_amount: Optional[float] = None
    amount_told: float
    difference: Optional[float] = None
    currency: str
    verdict: Verdict
    explanation: str


class ViolationEntry(BaseModel):
    violation_code: str
    violation_name: str
    vehicle_type: VehicleType
    fine_first: float
    fine_repeat: Optional[float] = None
    section_reference: Optional[str] = None
    compoundable: bool
    severity: Severity


class ViolationsResponse(BaseModel):
    country: str
    state: Optional[str] = None
    currency: str
    violations: list[ViolationEntry]


class HealthResponse(BaseModel):
    status: str
    version: str
