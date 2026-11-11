"""Unit and Integration Tests for ResolveAI Azure AI Search RAG Pipeline."""

import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.services.resolveai_rag_service import ResolveAIRagService


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)


def test_rag_service_npci_retrieval():
    """Validates that a U69/deducted payment query matches NPCI TAT Guidelines."""
    results = ResolveAIRagService.search_policy_knowledge(
        query="UPI Turnaround Time deemed failure gateway code U69 NPCI TAT",
        top_k=2,
    )
    assert len(results) > 0
    top = results[0]
    assert "NPCI" in top["citation"] or "NPCI" in top["title"]
    assert top["score"] > 0.5
    assert "blob_url" in top
    assert "https://stpaytmresolveaihyd.blob.core.windows.net" in top["blob_url"]


def test_rag_service_duplicate_debit_retrieval():
    """Validates that a duplicate debit query retrieves Paytm Refund SOP v4.1."""
    results = ResolveAIRagService.search_policy_knowledge(
        query="Customer was charged twice for duplicate debit refund request",
        top_k=2,
    )
    assert len(results) > 0
    categories = [r["category"] for r in results]
    assert "REFUND_POLICY" in categories
    assert any("Paytm Merchant & Customer Refund SOP" in r["citation"] for r in results)


def test_rag_service_soundbox_retrieval():
    """Validates that soundbox audio delay queries retrieve Soundbox operational manual."""
    results = ResolveAIRagService.search_policy_knowledge(
        query="Soundbox speaker audio delay not announcing payment merchant",
        top_k=2,
    )
    assert len(results) > 0
    categories = [r["category"] for r in results]
    assert "SOUNDBOX_TROUBLESHOOTING" in categories


def test_api_knowledge_documents_endpoint(client: TestClient):
    """Tests GET /api/v1/knowledge/documents returns all registered policy documents."""
    resp = client.get("/api/v1/knowledge/documents")
    assert resp.status_code == 200
    docs = resp.json()
    assert len(docs) >= 3
    doc_ids = [d["doc_id"] for d in docs]
    assert "DOC-NPCI-01" in doc_ids
    assert "DOC-REFUND-02" in doc_ids
    assert "DOC-SOUNDBOX-03" in doc_ids


def test_api_knowledge_query_endpoint(client: TestClient):
    """Tests POST /api/v1/knowledge/query performs semantic retrieval and returns citations."""
    payload = {
        "query": "What is the turnaround time for UPI pending transactions under NPCI?",
        "top_k": 2,
    }
    resp = client.post("/api/v1/knowledge/query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["results_count"] > 0
    assert len(data["chunks"]) <= 2
    assert "citation" in data["chunks"][0]
    assert "content" in data["chunks"][0]
    assert data["chunks"][0]["score"] > 0
