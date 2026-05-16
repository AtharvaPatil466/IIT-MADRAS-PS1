"""Full smoke tests against the seeded DB."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_challan_pune_no_helmet():
    r = client.post("/api/challan", json={
        "location": "Pune", "violation": "no_helmet", "vehicle_type": "two_wheeler",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["location"]["state"] == "Maharashtra"
    assert body["fine_first"] == 1000
    assert body["section_reference"].startswith("MV Act")
    assert body["compoundable"] is True
    assert body["how_to_pay"]
    assert "Maharashtra" in body["summary"]


def test_challan_bengaluru_helmet_state_override():
    # Karnataka reduced helmet fine to ₹500.
    r = client.post("/api/challan", json={
        "location": "Bengaluru", "violation": "no_helmet", "vehicle_type": "two_wheeler",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["location"]["state"] == "Karnataka"
    assert body["fine_first"] == 500


def test_challan_london_speeding():
    r = client.post("/api/challan", json={
        "location": "London", "violation": "overspeeding", "vehicle_type": "car",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["currency"] == "GBP"
    assert body["fine_first"] == 100


def test_challan_dubai_red_light():
    r = client.post("/api/challan", json={
        "location": "Dubai", "violation": "red_light",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["currency"] == "AED"
    assert body["fine_first"] == 1000


def test_challan_los_angeles_dui():
    r = client.post("/api/challan", json={
        "location": "Los Angeles", "violation": "drunk_driving",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["currency"] == "USD"
    assert body["severity"] == "criminal"
    assert body["compoundable"] is False


def test_challan_unknown_location_returns_404():
    r = client.post("/api/challan", json={
        "location": "Atlantis", "violation": "no_helmet",
    })
    assert r.status_code == 404


def test_challan_unknown_violation_returns_404():
    r = client.post("/api/challan", json={
        "location": "Mumbai", "violation": "definitely_not_a_thing",
    })
    assert r.status_code == 404


def test_violations_lists_india_national():
    r = client.get("/api/violations", params={"country": "IN"})
    assert r.status_code == 200
    body = r.json()
    codes = {v["violation_code"] for v in body["violations"]}
    assert {"drunk_driving", "no_helmet", "red_light"} <= codes


def test_violations_maharashtra_includes_state_row():
    r = client.get("/api/violations", params={"country": "IN", "state": "Maharashtra"})
    assert r.status_code == 200
    assert any(v["violation_code"] == "no_helmet" for v in r.json()["violations"])


def test_violations_unsupported_country():
    r = client.get("/api/violations", params={"country": "ZZ"})
    assert r.status_code == 422


def test_rights_india_national():
    r = client.get("/api/rights", params={"location": "India"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert "Driving Licence" in body["documents_required"]
    assert body["payment_portal_url"]


def test_rights_mumbai_picks_maharashtra():
    r = client.get("/api/rights", params={"location": "Mumbai"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["location"]["state"] == "Maharashtra"


def test_rights_dubai():
    r = client.get("/api/rights", params={"location": "Dubai"})
    assert r.status_code == 200
    assert "Emirates ID" in r.json()["documents_required"]


def test_verify_fine_correct():
    r = client.post("/api/verify-fine", json={
        "location": "Pune", "violation": "no_helmet", "amount_told": 1000,
        "vehicle_type": "two_wheeler",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["verdict"] == "correct"
    assert body["is_correct"] is True


def test_verify_fine_overcharged():
    r = client.post("/api/verify-fine", json={
        "location": "Bengaluru", "violation": "no_helmet", "amount_told": 2500,
        "vehicle_type": "two_wheeler",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["verdict"] == "overcharged"
    assert body["actual_amount"] == 500
    assert body["difference"] == 2000


def test_verify_fine_unknown_violation():
    r = client.post("/api/verify-fine", json={
        "location": "Mumbai", "violation": "made_up", "amount_told": 500,
    })
    assert r.status_code == 200
    assert r.json()["verdict"] == "unknown_violation"


def test_query_returns_citations():
    r = client.post("/api/query", json={
        "question": "What is the fine for not wearing a helmet in India?",
        "language": "en",
        "location_hint": "Mumbai",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["answer"]
    # Either RAG matched helmet docs, or returned the no-data caveat — both acceptable.
    if body["citations"]:
        sections = [c["section"] for c in body["citations"]]
        assert any("129" in s or "194" in s or "MV Act" in s for s in sections)
