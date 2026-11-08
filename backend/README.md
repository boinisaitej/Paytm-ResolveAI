# Paytm ResolveAI - Backend Foundation Manual

## Overview
The backend for Paytm ResolveAI is built with **FastAPI**, **Pydantic Settings**, **SQLAlchemy 2.0**, and the official **Microsoft Agent Framework (`agent-framework-core`, `agent-framework-openai`)**.

It enforces an Azure-first architecture with **Azure OpenAI** as the sole LLM provider and **Azure SQL Database** as the enterprise relational data store.

---

## 1. Local Environment Setup

### Prerequisites
- Python 3.10+ (64-bit)
- Microsoft ODBC Driver 18 (or 17) for SQL Server
- Azure CLI (`az`) 2.50+

### Installation Steps

1. **Activate Virtual Environment**:
   ```powershell
   # Windows PowerShell
   .\backend\.venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies**:
   ```powershell
   pip install -r backend\requirements.txt
   ```

3. **Configure Environment Variables**:
   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```
   Supply your Azure credentials in `backend\.env`:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_CHAT_DEPLOYMENT` (default: `gpt-4o`)
   - `AZURE_SQL_SERVER`
   - `AZURE_SQL_DATABASE`
   - `AZURE_SQL_USER`
   - `AZURE_SQL_PASSWORD`

---

## 2. Running the Health Probes & Server

### Run Automated Tests
```powershell
$env:PYTHONPATH="backend"
pytest backend/tests -v
```

### Start Development Server
```powershell
$env:PYTHONPATH="backend"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Verify Endpoints
- **System Health**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Azure OpenAI Probe**: [http://127.0.0.1:8000/health/azure-openai](http://127.0.0.1:8000/health/azure-openai)
- **Azure SQL Probe**: [http://127.0.0.1:8000/health/database](http://127.0.0.1:8000/health/database)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 3. Provisioning Azure Cloud Resources via CLI
An automated provisioning script is provided in `scripts/provision_azure_resources.ps1`.
```powershell
az login
.\scripts\provision_azure_resources.ps1
```
The script provisions:
- Azure Resource Group
- Azure Storage Account (`knowledge-documents`, `audit-evidences`)
- Azure Key Vault
- Azure SQL Server & Database (Basic 5 DTU tier) + Firewall rules
- Azure OpenAI Account + `gpt-4o` and `text-embedding-3-large` deployments
- Azure AI Search Service (Basic tier)
- Application Insights & Log Analytics Workspace
- Automatically writes generated connection strings to `backend\.env`
