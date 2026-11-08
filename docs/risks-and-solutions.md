# Paytm ResolveAI - Technical Risks & Architectural Mitigations

This document outlines key technical, financial, and operational risks identified for the autonomous multi-agent payment support workforce and their engineering solutions.

---

## 1. Risk Matrix

| # | Risk Description | Severity | Probability | Architectural Mitigation |
|---|------------------|----------|-------------|--------------------------|
| 1 | **Autonomous Financial Damage**: Agent hallucinates or executes an unauthorized monetary refund or account credit. | **CRITICAL** | Low | **Absolute Safety Boundary**: Payment Agent and Customer Support Agent have strictly read-only tools on financial ledgers. Any monetary action issues a `PendingApproval` record in Azure SQL requiring authenticated human review. |
| 2 | **Infinite Multi-Agent Loop**: Specialist agents bounce a difficult query recursively between each other, exhausting tokens and budget. | **HIGH** | Medium | **Bounded Graph Execution**: The Orchestrator enforces a hard maximum of 8 iterations and a 45-second execution timeout. If exceeded, the task automatically escalates to a human operator. |
| 3 | **Azure OpenAI Rate Limiting (HTTP 429)**: Sudden burst of user inquiries exceeds 30k TPM quota during live demo. | **HIGH** | Medium | **Resilience & Fallback**: Implement exponential backoff with jitter using `tenacity`. Use `gpt-4o-mini` for intent classification and entity extraction, reserving `gpt-4o` only for complex multi-agent orchestration. |
| 4 | **SQL Connection Exhaustion / Cold Start Latency**: Serverless or Basic Azure SQL pauses or rejects connections. | **MEDIUM** | Medium | **SQLAlchemy Connection Pooling**: Pre-ping enabled (`pool_pre_ping=True`), recycled every 300 seconds, with pool size capped at 5 to remain safely within Basic tier DTU limits. Multi-driver fallback dynamically selects ODBC Driver 18, 17, or standard SQL Server. |
| 5 | **Cross-Customer Data Leakage in LLM Context**: Customer A's private VPA or transaction details leak into Customer B's session. | **HIGH** | Low | **Strict Session Scoping**: Agent execution state is instantiated per request with clean context memory. No shared in-memory session caches between separate customer IDs. |
| 6 | **False Positive Tool Execution**: Agent creates a ticket or triggers follow-up in the database, but reports an error to user. | **MEDIUM** | Medium | **Self-Verification Engine**: The orchestrator performs a post-execution read from Azure SQL to verify that the generated `ticket_id` exists before outputting confirmation to the user. |
| 7 | **Cloud Resource Absence / Offline Dev Environment**: Developer or evaluator runs application without live Azure credentials configured. | **MEDIUM** | High | **Graceful Offline Mode**: Health endpoints report exact unconfigured services clearly (`503 Service Unavailable` with actionable setup messages) rather than crashing the entire FastAPI backend. |
