"""Knowledge Base and RAG Retrieval API Endpoints for Paytm ResolveAI."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.resolveai_rag_service import ResolveAIRagService

router = APIRouter(prefix="/api/v1/knowledge", tags=["Knowledge Base & RAG"])


class KnowledgeQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500, description="Natural language search query")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of policy chunks to retrieve")


class KnowledgeChunkResponse(BaseModel):
    chunk_id: str
    doc_id: str
    title: str
    category: str
    citation: str
    section: str
    content: str
    score: float
    blob_url: str


class KnowledgeQueryResponse(BaseModel):
    query: str
    retrieval_mode: str
    results_count: int
    chunks: List[KnowledgeChunkResponse]


@router.get("/documents", summary="List All Indexed Policy Documents")
def list_documents() -> List[Dict[str, Any]]:
    """Returns metadata of all indexed policy documents in Azure Blob Storage & Search."""
    return ResolveAIRagService.get_all_documents()


@router.post("/query", response_model=KnowledgeQueryResponse, summary="Query RAG Knowledge Base")
def query_knowledge(request: KnowledgeQueryRequest) -> KnowledgeQueryResponse:
    """Performs hybrid vector & keyword semantic search against Azure AI Search.
    
    Grounds agent decisions in NPCI guidelines, refund SOPs, and hardware manuals.
    """
    try:
        results = ResolveAIRagService.search_policy_knowledge(query=request.query, top_k=request.top_k)
        return KnowledgeQueryResponse(
            query=request.query,
            retrieval_mode="Azure AI Search (Hybrid Vector + Keyword Grounding)",
            results_count=len(results),
            chunks=[KnowledgeChunkResponse(**r) for r in results],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Knowledge retrieval failed: {str(exc)}")
