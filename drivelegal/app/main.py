from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import challan, query, rights, verify, violations
from app.schemas import HealthResponse

API_VERSION = "1.0"

app = FastAPI(
    title="DriveLegal API",
    description="Location-aware traffic-law assistant — Road Safety Hackathon 2026.",
    version=API_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(challan.router, prefix="/api", tags=["challan"])
app.include_router(query.router, prefix="/api", tags=["query"])
app.include_router(rights.router, prefix="/api", tags=["rights"])
app.include_router(verify.router, prefix="/api", tags=["verify"])
app.include_router(violations.router, prefix="/api", tags=["violations"])


@app.get("/api/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    return HealthResponse(status="ok", version=API_VERSION)
