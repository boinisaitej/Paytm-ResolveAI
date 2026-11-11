"""Paytm ResolveAI - Autonomous Multi-Agent Payment Support & Operations Backend.

Entry point for the FastAPI application.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.orchestrator import router as orchestrator_router
from app.api.tickets import router as tickets_router
from app.api.transactions import router as transactions_router
from app.api.merchants import router as merchants_router
from app.api.approvals import router as approvals_router
from app.api.analytics import router as analytics_router
from app.api.activity_logs import router as activity_logs_router
from app.api.knowledge import router as knowledge_router
from app.api.settings import router as settings_router
from app.api.intelligence import router as intelligence_router

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

    # Configure CORS for Vite React frontend
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

    # Register API Route Blueprints
    app.include_router(health_router)
    app.include_router(orchestrator_router)
    app.include_router(tickets_router)
    app.include_router(transactions_router)
    app.include_router(merchants_router)
    app.include_router(approvals_router)
    app.include_router(analytics_router)
    app.include_router(activity_logs_router)
    app.include_router(knowledge_router)
    app.include_router(settings_router)
    app.include_router(intelligence_router)

    # Mount compiled frontend static build if available
    possible_dirs = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "dist")),
        os.path.abspath("frontend/dist"),
        os.path.abspath("dist"),
    ]
    dist_dir = None
    for p in possible_dirs:
        if os.path.exists(p) and os.path.isfile(os.path.join(p, "index.html")):
            dist_dir = p
            break

    if dist_dir:
        assets_dir = os.path.join(dist_dir, "assets")
        if os.path.exists(assets_dir):
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        @app.get("/{full_path:path}", include_in_schema=False)
        async def serve_spa(full_path: str):
            if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json", "health"]:
                raise HTTPException(status_code=404, detail="API route not found")
            target_file = os.path.join(dist_dir, full_path)
            if os.path.isfile(target_file):
                return FileResponse(target_file)
            index_file = os.path.join(dist_dir, "index.html")
            if os.path.isfile(index_file):
                return FileResponse(index_file)
            raise HTTPException(status_code=404, detail="Page not found")

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)
