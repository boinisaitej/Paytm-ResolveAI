"""Integration tests for Paytm ResolveAI multi-agent workflows and REST APIs."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.workflows.payment_investigation_workflow import PaymentInvestigationWorkflow

client = TestClient(app)


@pytest.mark.asyncio
async def test_payment_investigation_workflow_end_to_end():
    """Tests the primary hackathon autonomous workflow:
    'My ₹1,500 payment was deducted, but the merchant hasn't received the money.'
    """
    result = await PaymentInvestigationWorkflow.run(
        user_message="My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
        session_id="test_sess_01",
        customer_id="CUST101",
    )

    assert result["status"] == "COMPLETED"
    assert result["intent"] == "PAYMENT_DEDUCTED_MERCHANT_NOT_RECEIVED"
    assert result["transaction_id"] == "TXN1024"
    assert result["ticket_id"].startswith("TICK-")
    assert result["verification_status"] == "VERIFIED"
    assert result["all_verified"] is True
    assert len(result["execution_timeline"]) >= 5

    # Confirm customer response has empathetic explanation & SLA
    response_text = result["response_text"]
    assert "TXN1024" in response_text
    assert result["ticket_id"] in response_text


def test_api_orchestrator_run_endpoint():
    """Tests POST /api/v1/orchestrator/run."""
    payload = {
        "message": "My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
        "session_id": "api_test_sess",
        "customer_id": "CUST101",
    }
    response = client.post("/api/v1/orchestrator/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert data["transaction_id"] == "TXN1024"
    assert data["verification_status"] == "VERIFIED"


def test_api_list_agents():
    """Tests GET /api/v1/orchestrator/agents returns all 5 agents."""
    response = client.get("/api/v1/orchestrator/agents")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) == 5
    agent_names = [a["name"] for a in agents]
    assert "CentralOrchestrator" in agent_names
    assert "CustomerSupportAgent" in agent_names
    assert "PaymentInvestigationAgent" in agent_names
    assert "MerchantOperationsAgent" in agent_names
    assert "OperationsAgent" in agent_names


def test_api_transaction_investigation():
    """Tests GET /api/v1/transactions/TXN1024."""
    response = client.get("/api/v1/transactions/TXN1024")
    assert response.status_code == 200
    data = response.json()
    assert data["transaction"]["transaction_id"] == "TXN1024"
    assert data["investigation"]["anomaly_analysis"]["category"] == "BANK_RECONCILIATION_PENDING"


def test_api_merchant_details():
    """Tests GET /api/v1/merchants/MERCHANT201."""
    response = client.get("/api/v1/merchants/MERCHANT201")
    assert response.status_code == 200
    data = response.json()
    assert data["profile"]["merchant_id"] == "MERCHANT201"
    assert data["operational_status"]["soundbox_device_id"] == "SB-HYD-4091"
    assert data["operational_status"]["sales_opportunity"]["type"] == "HARDWARE_UPGRADE"


def test_api_approvals_lifecycle():
    """Tests GET /api/v1/approvals and POST /api/v1/approvals/{id}/action."""
    get_res = client.get("/api/v1/approvals")
    assert get_res.status_code == 200
    approvals = get_res.json()
    assert len(approvals) >= 1
    appr_id = approvals[0]["approval_id"]

    # Review approval
    action_res = client.post(
        f"/api/v1/approvals/{appr_id}/action",
        json={"action": "APPROVE", "reviewed_by": "EMP201", "comments": "Authorized refund"},
    )
    assert action_res.status_code == 200
    updated = action_res.json()
    assert updated["status"] == "APPROVED"
    assert updated["reviewed_by"] == "EMP201"


def test_api_analytics_overview():
    """Tests GET /api/v1/analytics/overview."""
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert data["kpis"]["total_ai_agents"] == 5
    assert "agent_performance" in data
