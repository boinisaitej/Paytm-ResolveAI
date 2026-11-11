"""Unit tests for configuration validation, secret masking, and connection builders."""

import pytest
from app.core.config import Settings
from app.core.logging import mask_sensitive_data


def test_default_settings():
    """Verifies default settings fallbacks."""
    cfg = Settings(
        azure_openai_endpoint=None,
        azure_openai_api_key=None,
        azure_sql_server=None,
        azure_sql_user=None,
        azure_sql_password=None,
    )
    assert cfg.app_name == "Paytm ResolveAI"
    assert cfg.port == 8000
    assert cfg.is_azure_openai_configured is False
    assert cfg.is_azure_sql_configured is False
    assert cfg.get_sqlalchemy_database_url() == ""


def test_azure_openai_configured_flag():
    """Verifies Azure OpenAI configuration detection."""
    configured = Settings(
        azure_openai_endpoint="https://aoai-paytm.openai.azure.com/",
        azure_openai_api_key="secret-key-12345",
    )
    assert configured.is_azure_openai_configured is True
    assert configured.azure_openai_chat_deployment in ["gpt-4o", "gpt-4o-mini"]


def test_azure_sql_url_builder():
    """Verifies Azure SQL SQLAlchemy connection URL formatting and parameters."""
    cfg = Settings(
        azure_sql_server="sql-paytm-test.database.windows.net",
        azure_sql_database="sqldb-test",
        azure_sql_user="testuser",
        azure_sql_password="testpassword#123",
        azure_sql_driver="ODBC Driver 18 for SQL Server",
    )
    assert cfg.is_azure_sql_configured is True
    url = cfg.get_sqlalchemy_database_url()
    assert url.startswith("mssql+pyodbc:///?odbc_connect=")
    assert "sql-paytm-test.database.windows.net" in url
    assert "sqldb-test" in url
    assert "Encrypt%3Dyes" in url or "Encrypt=yes" in url


def test_mask_sensitive_data_logging():
    """Verifies that secrets and tokens are redacted before logging."""
    sample_text = "Connecting with api_key: 'my_secret_token_abc123' and password: 'SecretPassword99'"
    masked = mask_sensitive_data(sample_text)
    assert "my_secret_token_abc123" not in masked
    assert "SecretPassword99" not in masked
    assert "[REDACTED]" in masked

    bearer_text = "Header Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    masked_bearer = mask_sensitive_data(bearer_text)
    assert "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" not in masked_bearer
    assert "Bearer [REDACTED]" in masked_bearer
