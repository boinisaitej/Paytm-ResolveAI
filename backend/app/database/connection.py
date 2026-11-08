"""Azure SQL Database connection management using SQLAlchemy 2.0 and pyodbc."""

import time
from typing import Any, Dict, Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.core.config import settings
from app.core.exceptions import DatabaseConfigurationError, DatabaseConnectionError
from app.core.logging import logger

Base = declarative_base()

_engine: Optional[Engine] = None
_session_maker: Optional[sessionmaker] = None


def get_engine() -> Engine:
    """Returns or lazily initializes the SQLAlchemy Engine for Azure SQL."""
    global _engine, _session_maker

    if _engine is not None:
        return _engine

    if not settings.is_azure_sql_configured:
        raise DatabaseConfigurationError(
            "Azure SQL Database is not configured. Please supply AZURE_SQL_SERVER, "
            "AZURE_SQL_USER, and AZURE_SQL_PASSWORD in environment variables."
        )

    db_url = settings.get_sqlalchemy_database_url()

    try:
        _engine = create_engine(
            db_url,
            pool_size=settings.azure_sql_pool_size,
            max_overflow=settings.azure_sql_max_overflow,
            pool_pre_ping=True,  # Proactively tests connection validity before checkout
            pool_recycle=300,    # Recycle connections every 5 minutes to avoid stale TCP sockets
            connect_args={"timeout": 15},
        )
        _session_maker = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        logger.info(
            "Initialized SQLAlchemy engine for Azure SQL",
            extra={"server": settings.azure_sql_server, "database": settings.azure_sql_database},
        )
        return _engine
    except Exception as e:
        logger.error(f"Failed to create SQLAlchemy engine: {str(e)}")
        raise DatabaseConnectionError(f"Database initialization error: {str(e)}")


def get_db_session() -> Generator[Session, None, None]:
    """FastAPI dependency for scoped database sessions."""
    if _session_maker is None:
        get_engine()

    session: Session = _session_maker()
    try:
        yield session
    finally:
        session.close()


def check_database_health() -> Dict[str, Any]:
    """Tests Azure SQL connectivity by executing a lightweight SELECT 1 query."""
    if not settings.is_azure_sql_configured:
        return {
            "status": "unconfigured",
            "message": "Azure SQL credentials not configured in environment.",
            "database": settings.azure_sql_database,
            "connected": False,
        }

    start_time = time.perf_counter()
    try:
        engine = get_engine()
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 AS alive")).scalar()
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            if result == 1:
                return {
                    "status": "healthy",
                    "connected": True,
                    "database": settings.azure_sql_database,
                    "server": settings.azure_sql_server,
                    "driver": settings.azure_sql_driver,
                    "latency_ms": latency_ms,
                }
            else:
                return {
                    "status": "degraded",
                    "connected": False,
                    "database": settings.azure_sql_database,
                    "message": "Query returned unexpected result.",
                    "latency_ms": latency_ms,
                }
    except Exception as exc:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.warning(f"Database health check failed: {str(exc)}")
        return {
            "status": "unhealthy",
            "connected": False,
            "database": settings.azure_sql_database,
            "server": settings.azure_sql_server,
            "error": "Connection attempt to Azure SQL timed out or failed.",
            "latency_ms": latency_ms,
        }
