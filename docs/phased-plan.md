# Paytm ResolveAI - Phased Implementation Plan

This master plan details the 8 discrete execution phases required to build and verify Paytm ResolveAI.

---

## Phase Breakdown & Deliverables

### Phase 1: Environment & Backend Foundation (Current Focus)
- [x] Inspect project environment (Windows, Python 3.10, Node.js 24, Azure CLI 2.91.0).
- [x] Research and test official Microsoft Agent Framework (`agent-framework-core`, `agent-framework-openai`).
- [x] Author comprehensive architecture blueprints, Azure CLI scripts, schema specs, and API contracts.
- [ ] Configure `pyproject.toml` / `requirements.txt` with verified dependencies.
- [ ] Implement Pydantic Settings configuration (`app/core/config.py`) reading only from environment variables.
- [ ] Implement structured JSON logging (`app/core/logging.py`) with secret token masking.
- [ ] Implement SQLAlchemy 2.0 Azure SQL engine with `pyodbc` connection pooling and fallback drivers (`ODBC Driver 18`, `ODBC Driver 17`, `SQL Server`).
- [ ] Implement Azure OpenAI client wrapper and ping check (`app/services/azure_openai.py`).
- [ ] Implement FastAPI application with `/health`, `/health/azure-openai`, `/health/database`.
- [ ] Write unit tests for configuration, error handling, and health endpoints.
- [ ] Verify test suite and local server launch.

### Phase 2: Azure SQL Schema, Migrations & Synthetic Data Seeding
- Define SQLAlchemy ORM models matching all 16 normalized tables.
- Write database migration scripts or auto-table generator.
- Seed synthetic, realistic demo records:
  - 10 Customer profiles (various KYC states, UPI IDs).
  - 10 Merchant profiles (Retail, Dining, Soundbox devices, EDC POS).
  - 25 Transactions (Pending, Failed, U69 bank timeouts, duplicate charges, successful debits).
  - Baseline employees and roles (Payment Ops Officer, Support Lead, Merchant Ops).
- Provide health-check SQL query validation.

### Phase 3: Microsoft Agent Framework & Specialist Agents
- Configure Microsoft Agent Framework orchestrator and agent runners.
- Implement Customer Support Agent tools (`get_customer`, `search_customer_by_mobile`, `create_ticket`).
- Implement Payment Investigation Agent tools (`get_transaction`, `analyze_payment_status`).
- Implement Merchant Operations Agent tools (`get_merchant`, `get_missing_documents`).
- Implement Operations Agent tools (`assign_ticket`, `request_approval`, `verify_task`).
- Implement shared typed execution state across agent handoffs.

### Phase 4: Autonomous Workflows, Self-Verification & Approvals
- Implement the primary hackathon workflow:
  *"My ₹1,500 payment was deducted, but the merchant hasn't received the money."*
- Implement deterministic anomaly detection (double debit, bank delay U69, pending settlement).
- Implement human-in-the-loop approval lifecycle in Azure SQL.
- Implement self-verification engine to confirm database mutations.
- Implement automated escalation when SLAs expire or confidence drops.

### Phase 5: Azure AI Search RAG, Blob Storage & Memory
- Create Azure Blob Storage container client for policy PDFs and SOP markdown documents.
- Implement Azure AI Search index schema (hybrid vector + keyword search).
- Implement grounding engine: citations, policy compliance tags, and hallucination shields.
- Implement conversation session persistence in Azure SQL.
- Add multilingual prompt templates for Hindi, Telugu, and English.

### Phase 6: React 19 SaaS Dashboard & Real-Time SSE Telemetry
- Initialize Vite + React 19 + TypeScript + Tailwind CSS in `frontend/`.
- Build Paytm-branded design system and layouts.
- Implement all 13 sidebar pages (Overview, AI Teammates, AI Workspace, Approvals, Analytics, etc.).
- Build 3-column AI Workspace with real-time SSE stream for agent thoughts, tool logs, and approvals.
- Build analytics charts using Recharts for SLA metrics and agent workloads.

### Phase 7: End-to-End Automated Testing & Security Hardening
- Write end-to-end integration tests using `pytest` and `httpx`.
- Test failure scenarios: transaction not found, SQL connection drop, agent loop timeout, rejected approval.
- Verify zero secret leakage in logs and API error responses.
- Verify Entra ID token validation middleware.

### Phase 8: Cloud Deployment & DevOps
- Execute automated Azure provisioning script (`scripts/provision_azure_resources.ps1`).
- Build Dockerfile for backend and deploy to Azure Container Apps.
- Deploy frontend to Azure Static Web Apps.
- Bind Application Insights OpenTelemetry exporter.
- Write production runbook and live hackathon demonstration script.
