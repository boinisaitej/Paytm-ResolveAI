# Paytm ResolveAI - Autonomous Multi-Agent Workforce

> **Paytm AI Hackathon Hyderabad**  
> **Enterprise Multi-Agent Platform for Payment Support and Merchant Operations**

Paytm ResolveAI is an enterprise-grade autonomous AI multi-agent workforce designed to solve real customer payment issues, manage merchant operations, enforce deterministic safety constraints, and automate operations with full human-in-the-loop auditability.

---

## 🏛️ High-Level Architecture
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, Recharts (13 dedicated enterprise views).
- **Backend**: Python 3.10, FastAPI, Pydantic Settings, SQLAlchemy 2.0 (`pyodbc`).
- **AI Orchestration**: Official Microsoft Agent Framework (`agent-framework-core`, `agent-framework-openai`).
- **Cloud Infrastructure**: Azure OpenAI (`gpt-4o`, `text-embedding-3-large`), Azure SQL Database, Azure AI Search, Azure Blob Storage, Azure Key Vault, Azure Application Insights.

---

## 📁 Repository Structure
```
paytm-resolve-ai/
├── docs/                               # Comprehensive Technical Blueprints
│   ├── architecture.md                 # End-to-end system topology & data flows
│   ├── azure-resources.md              # Azure resource checklist & CLI guide
│   ├── database-schema.md              # 16-table normalized Azure SQL schema
│   ├── agent-orchestration.md          # Multi-agent state graph & handoff rules
│   ├── api-contracts.md                # REST & SSE streaming OpenAPI specs
│   ├── frontend-plan.md                # 13 views & 3-column AI Workspace design
│   ├── phased-plan.md                  # 8-phase execution roadmap
│   ├── costs-and-quotas.md             # Sizing, quotas, and cost optimization
│   └── risks-and-solutions.md          # Risk matrix & architectural safeguards
├── scripts/
│   └── provision_azure_resources.ps1   # Idempotent Azure CLI infrastructure script
├── backend/
│   ├── app/
│   │   ├── api/health.py               # Health & readiness probe endpoints
│   │   ├── core/                       # Config, logging, domain exceptions
│   │   ├── database/connection.py      # SQLAlchemy 2.0 Azure SQL connection pool
│   │   ├── services/azure_openai.py    # Azure OpenAI client wrapper & health check
│   │   └── main.py                     # FastAPI application factory
│   ├── tests/                          # Automated test suite
│   ├── requirements.txt                # Pinned dependencies
│   ├── .env.example                    # Environment template
│   └── README.md                       # Backend guide
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quickstart

### 1. Azure Resource Provisioning
Ensure you are authenticated with Azure CLI:
```powershell
az login
.\scripts\provision_azure_resources.ps1
```

### 2. Backend Setup & Test Suite
```powershell
# In PowerShell:
cd "c:\Paytm ResolveAI"
.\backend\.venv\Scripts\Activate.ps1
$env:PYTHONPATH="backend"

# Run tests
pytest backend/tests -v

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Verify in your browser or curl:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/health/azure-openai`
- `http://127.0.0.1:8000/health/database`
- `http://127.0.0.1:8000/docs`
