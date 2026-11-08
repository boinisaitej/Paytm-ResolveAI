"""Paytm ResolveAI - Autonomous Multi-Agent Payment Support & Operations Backend.

Entry point for the FastAPI application.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.core.config import settings
from app.core.exceptions import (
    ResolveAIException,
    resolveai_exception_handler,
    unhandled_exception_handler,
)
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan managing startup validation and shutdown hooks."""
    logger.info(
        f"Starting {settings.app_name} on environment: {settings.app_env}",
        extra={
            "debug": settings.debug,
            "azure_openai_configured": settings.is_azure_openai_configured,
            "azure_sql_configured": settings.is_azure_sql_configured,
        },
    )
    yield
    logger.info(f"Shutting down {settings.app_name}")


def create_app() -> FastAPI:
    """Factory function to build and configure the FastAPI instance."""
    app = FastAPI(
        title=settings.app_name,
        description="Autonomous AI Teammates for Payment Support and Merchant Operations",
        version="1.0.0",
        docs_url="/docs" if settings.debug or settings.app_env == "development" else None,
        redoc_url="/redoc" if settings.debug or settings.app_env == "development" else None,
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register Exception Handlers
    app.add_exception_handler(ResolveAIException, resolveai_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    # Register Health Routes
    app.include_router(health_router)

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)
