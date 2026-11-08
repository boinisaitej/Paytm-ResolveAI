# Paytm ResolveAI - Azure Cost Estimates, Quotas & Dependencies

## 1. Hackathon Cloud Cost Model (Monthly / Daily Breakdown)

| Azure Service | SKU / Tier | Units / Allocation | Est. Monthly Cost | Est. Hackathon Run Cost (3 Days) | Cost Optimization Strategy |
|---------------|------------|-------------------|-------------------|----------------------------------|---------------------------|
| **Azure OpenAI** | Standard S0 | gpt-4o (30k TPM), text-embedding-3-large (30k TPM) | Pay-as-you-go (~$15 / 1M tokens) | ~$10 - $25 | Cache frequent classification prompts; enforce 500 max response tokens |
| **Azure SQL Database** | Basic Tier | 5 DTU, 2 GB Storage | ~$4.99 / mo | ~$0.50 | Basic tier is 100% sufficient for hackathon scale (10,000+ demo rows) |
| **Azure AI Search** | Basic Tier | 1 Search Unit, 1 Partition | ~$73.00 / mo | ~$7.30 | Provision during Phase 5, decommission immediately after hackathon judging |
| **Azure Blob Storage** | Standard Hot | LRS, 5 GB storage + 10k read ops | ~$0.20 / mo | ~$0.05 | Minimal footprint for compliance SOPs |
| **Azure Container Apps** | Consumption | 0.5 vCPU, 1.0 GiB RAM (1 replica) | ~$15.00 / mo | ~$1.50 | Serverless scale-to-zero when idle |
| **Azure Static Web Apps** | Free Tier | 1 App, global CDN, custom domain | Free ($0.00) | $0.00 | Free tier includes 100 GB bandwidth & SSL |
| **Application Insights & Log Analytics** | PerGB2018 | 5 GB ingestion / mo | Free tier (<5 GB) | $0.00 | Within 5GB free monthly ingestion threshold |
| **Total Estimated Budget** | | | **~$108 / month** | **~$20 - $35 Total** | |

---

## 2. Resource Quotas & Rate Limits
- **Azure OpenAI (East US 2 / Sweden Central)**:
  - Default Quota: 30k - 50k Tokens Per Minute (TPM) on `gpt-4o`.
  - Quota Guardrail: Agent orchestrator implements exponential backoff with jitter on HTTP 429 (`RateLimitError`).
- **Azure SQL Database**:
  - Connection Pool: Max 30 concurrent connections on Basic tier. SQLAlchemy pool size configured to 5 with max overflow of 10.
- **Azure AI Search**:
  - Maximum 3 indexes on Basic SKU, up to 2 GB storage and 1M documents.

---

## 3. Prerequisites & Deployment Dependencies
1. **Azure Subscription**: Active subscription with Microsoft.CognitiveServices and Microsoft.Sql resource providers registered.
2. **Azure CLI**: Version $\ge 2.50.0$ installed locally.
3. **ODBC Driver**: Microsoft ODBC Driver 18 for SQL Server (or Driver 17 / built-in SQL Server driver) installed on host.
4. **Python**: Python 3.10 64-bit environment.
5. **Node.js**: Node 18+ for Vite/React frontend build.
