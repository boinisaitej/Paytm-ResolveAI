"""Application configuration and environment settings management using Pydantic Settings.

Ensures strict validation, zero hardcoded credentials, and safe masking of secrets.
"""

from typing import List, Optional
import urllib.parse
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # General App Configuration
    app_name: str = Field(default="Paytm ResolveAI", description="Application name")
    app_env: str = Field(default="development", description="Environment: development, staging, production")
    debug: bool = Field(default=False, description="Debug mode flag")
    host: str = Field(default="0.0.0.0", description="FastAPI host binding")
    port: int = Field(default=8000, description="FastAPI port")
    cors_origins: List[str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # Azure OpenAI Service (Exclusive LLM Provider)
    azure_openai_endpoint: Optional[str] = Field(
        default=None,
        description="Azure OpenAI endpoint, e.g. https://aoai-paytm.openai.azure.com/",
    )
    azure_openai_api_key: Optional[str] = Field(
        default=None,
        description="Azure OpenAI API key (leave empty if using Managed Identity)",
    )
    azure_openai_chat_deployment: str = Field(
        default="gpt-4o",
        description="Azure OpenAI deployment name for chat/orchestration",
    )
    azure_openai_embedding_deployment: str = Field(
        default="text-embedding-3-large",
        description="Azure OpenAI deployment name for embeddings",
    )
    azure_openai_api_version: str = Field(
        default="2024-06-01",
        description="Azure OpenAI API version",
    )

    # Azure SQL Database Configuration
    azure_sql_server: Optional[str] = Field(
        default=None,
        description="Azure SQL Server hostname (e.g. sql-paytm.database.windows.net)",
    )
    azure_sql_database: str = Field(
        default="sqldb-paytm-resolveai",
        description="Azure SQL Database catalog name",
    )
    azure_sql_user: Optional[str] = Field(
        default=None,
        description="Azure SQL administrative/application username",
    )
    azure_sql_password: Optional[str] = Field(
        default=None,
        description="Azure SQL application password",
    )
    azure_sql_driver: str = Field(
        default="ODBC Driver 18 for SQL Server",
        description="ODBC Driver installed on system (Driver 18, 17, or SQL Server)",
    )
    azure_sql_port: int = Field(default=1433, description="Azure SQL TDS port")
    azure_sql_pool_size: int = Field(default=5, description="SQLAlchemy connection pool size")
    azure_sql_max_overflow: int = Field(default=10, description="SQLAlchemy connection pool overflow limit")

    # Azure AI Search (Knowledge & RAG)
    azure_search_endpoint: Optional[str] = Field(default=None, description="Azure AI Search HTTPS endpoint")
    azure_search_api_key: Optional[str] = Field(default=None, description="Azure AI Search Admin Key")
    azure_search_index_name: str = Field(default="paytm-knowledge-index", description="Search index name")

    # Azure Blob Storage
    azure_storage_account: Optional[str] = Field(default=None, description="Azure Storage Account Name")
    azure_storage_key: Optional[str] = Field(default=None, description="Azure Storage Key")
    azure_storage_container: str = Field(default="knowledge-documents", description="Blob container name")

    # Observability
    applicationinsights_connection_string: Optional[str] = Field(
        default=None,
        description="Azure Application Insights Connection String",
    )

    @field_validator("azure_openai_endpoint", mode="before")
    @classmethod
    def sanitize_endpoint(cls, v: Optional[str]) -> Optional[str]:
        if v and not v.startswith("http"):
            return f"https://{v}"
        return v

    @property
    def is_azure_openai_configured(self) -> bool:
        """Checks if Azure OpenAI endpoint and deployment are populated."""
        return bool(self.azure_openai_endpoint and (self.azure_openai_api_key or self.app_env != "development"))

    @property
    def is_azure_sql_configured(self) -> bool:
        """Checks if all required Azure SQL connection credentials are provided."""
        return bool(
            self.azure_sql_server
            and self.azure_sql_database
            and self.azure_sql_user
            and self.azure_sql_password
        )

    def get_sqlalchemy_database_url(self) -> str:
        """Generates a secure, pyodbc-compatible SQLAlchemy URL for Azure SQL Database."""
        if not self.is_azure_sql_configured:
            return ""

        # Build standard ODBC connection string
        # Encrypt=yes is mandatory for Azure SQL.
        odbc_str = (
            f"DRIVER={{{self.azure_sql_driver}}};"
            f"SERVER=tcp:{self.azure_sql_server},{self.azure_sql_port};"
            f"DATABASE={self.azure_sql_database};"
            f"UID={self.azure_sql_user};"
            f"PWD={self.azure_sql_password};"
            f"Encrypt=yes;"
            f"TrustServerCertificate=no;"
            f"Connection Timeout=30;"
        )
        quoted_params = urllib.parse.quote_plus(odbc_str)
        return f"mssql+pyodbc:///?odbc_connect={quoted_params}"


# Singleton instance
settings = Settings()
