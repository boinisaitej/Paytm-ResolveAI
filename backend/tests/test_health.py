"""Unit tests for FastAPI health and probe endpoints."""

from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_overall_unconfigured():
    """When Azure credentials are not set, /health returns pending_configuration with 200."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "Paytm ResolveAI"
    assert "services" in data
    assert data["services"]["azure_openai"]["status"] == "unconfigured"
    assert data["services"]["azure_sql_database"]["status"] == "unconfigured"


def test_health_azure_openai_unconfigured():
    """When Azure OpenAI is not configured, /health/azure-openai reports unconfigured."""
    response = client.get("/health/azure-openai")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unconfigured"
    assert data["connected"] is False


def test_health_database_unconfigured():
    """When Azure SQL is not configured, /health/database reports unconfigured."""
    response = client.get("/health/database")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unconfigured"
    assert data["connected"] is False


@patch("app.api.health.check_azure_openai_health")
@patch("app.api.health.check_database_health")
def test_health_overall_healthy(mock_db, mock_aoai):
    """When both cloud services report connected, /health returns healthy status."""
    mock_aoai.return_value = {
        "status": "healthy",
        "connected": True,
        "provider": "Azure OpenAI",
        "latency_ms": 45.2,
    }
    mock_db.return_value = {
        "status": "healthy",
        "connected": True,
        "database": "sqldb-paytm-resolveai",
        "latency_ms": 12.8,
    }

    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["services"]["azure_openai"]["connected"] is True
    assert data["services"]["azure_sql_database"]["connected"] is True


@patch("app.api.health.check_azure_openai_health")
@patch("app.api.health.check_database_health")
def test_health_overall_degraded(mock_db, mock_aoai):
    """When one cloud service reports unhealthy failure, /health returns 503."""
    mock_aoai.return_value = {
        "status": "healthy",
        "connected": True,
        "provider": "Azure OpenAI",
    }
    mock_db.return_value = {
        "status": "unhealthy",
        "connected": False,
        "error": "Connection timed out",
    }

    response = client.get("/health")
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "degraded"
