"""Unit tests for Advanced AI Intelligence Engine (Outage Clustering, SLA Forecaster, Cross-Agent Negotiation)."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_intelligence_incident_clusters():
    response = client.get("/api/v1/intelligence/incident-clusters")
    assert response.status_code == 200
    clusters = response.json()
    assert isinstance(clusters, list)
    if len(clusters) > 0:
        c = clusters[0]
        assert "incident_id" in c
        assert "title" in c
        assert "severity" in c
        assert "root_cause_summary" in c

def test_intelligence_sla_predictions():
    response = client.get("/api/v1/intelligence/sla-predictions?ticket_id=TCK101")
    assert response.status_code == 200
    pred = response.json()
    assert "ticket_id" in pred
    assert "breach_probability" in pred
    assert "risk_tier" in pred
    assert "rbi_mandate_hours" in pred

def test_intelligence_negotiate_resolution():
    payload = {
        "transaction_amount": 1500.0,
        "gateway_code": "U69",
        "delay_days": 3
    }
    response = client.post("/api/v1/intelligence/negotiate-resolution", json=payload)
    assert response.status_code == 200
    neg = response.json()
    assert neg["consensus_status"] == "AGREED"
    assert "statutory_compliance" in neg
    # Delay > 1 day: 2 days delayed beyond T+1 => 2 * 100 = 200 INR compensation
    assert neg["statutory_compliance"]["statutory_compensation_inr"] == 200.0
    assert neg["statutory_compliance"]["total_proposed_disbursement"] == 1700.0
