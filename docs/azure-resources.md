# Paytm ResolveAI - Azure Resource Creation Checklist & CLI Manual

This document details all Azure cloud resources required for the production deployment of Paytm ResolveAI, their configuration, pricing tiers, naming conventions, and exact Azure CLI commands.

---

## 1. Resource Inventory & Sizing

| # | Resource Type | Resource Name Example | SKU / Tier | Purpose |
|---|---------------|----------------------|------------|---------|
| 1 | **Resource Group** | `rg-paytm-resolveai-prod` | N/A | Logical boundary for all hackathon resources |
| 2 | **Azure OpenAI** | `aoai-paytm-resolveai` | S0 (Standard) | LLM inference (`gpt-4o`, `text-embedding-3-large`) |
| 3 | **Azure SQL Server** | `sql-paytm-resolveai-01` | Serverless / Basic | Relational transactional database |
| 4 | **Azure SQL Database** | `sqldb-paytm-resolveai` | General Purpose (Serverless GP_S_Gen5_1 or Basic 5 DTU) | 16-table normalized enterprise store |
| 5 | **Azure AI Search** | `srch-paytm-resolveai` | Basic | RAG knowledge base for Paytm policies |
| 6 | **Azure Storage Account** | `stpaytmresolveai01` | Standard_LRS | Blob storage for knowledge docs & audit exports |
| 7 | **Azure Key Vault** | `kv-paytm-resolveai01` | Standard | Zero-trust secrets and key management |
| 8 | **Log Analytics Workspace**| `log-paytm-resolveai` | PerGB2018 | Central log ingestion for container & tracing |
| 9 | **Application Insights** | `appi-paytm-resolveai` | Standard | Distributed APM telemetry & agent tracing |
| 10 | **Container Apps Env** | `cae-paytm-resolveai` | Consumption | Serverless container hosting environment |
| 11 | **Container App (Backend)**| `ca-paytm-backend` | 0.5 CPU / 1.0 GiB | FastAPI backend & agent runtime |
| 12 | **Static Web App (Frontend)**| `swa-paytm-frontend` | Free / Standard | React 19 single-page application |

---

## 2. Idempotent Azure CLI Provisioning Script

Run the following Azure CLI commands in PowerShell or Bash after executing `az login`.

```powershell
# ==============================================================================
# PAYTM RESOLVEAI - AZURE INFRASTRUCTURE PROVISIONING SCRIPT
# ==============================================================================
$ErrorActionPreference = "Stop"

# Configuration Variables
$LOCATION = "eastus2" # or centralindia / swedencentral
$RANDOM_SUFFIX = Get-Random -Minimum 1000 -Maximum 9999
$RG_NAME = "rg-paytm-resolveai-prod"
$AOAI_NAME = "aoai-paytm-$RANDOM_SUFFIX"
$SQL_SERVER_NAME = "sql-paytm-$RANDOM_SUFFIX"
$SQL_DB_NAME = "sqldb-paytm-resolveai"
$SQL_ADMIN_USER = "paytmadmin"
$SQL_ADMIN_PASS = "PaytmSecure#2026!" # Change before running in production
$SEARCH_NAME = "srch-paytm-$RANDOM_SUFFIX"
$STORAGE_NAME = "stpaytm$RANDOM_SUFFIX"
$KEYVAULT_NAME = "kv-paytm-$RANDOM_SUFFIX"
$WORKSPACE_NAME = "log-paytm-$RANDOM_SUFFIX"
$APPINS_NAME = "appi-paytm-$RANDOM_SUFFIX"
$CAE_NAME = "cae-paytm-$RANDOM_SUFFIX"

Write-Host ">>> Creating Resource Group: $RG_NAME ($LOCATION)..."
az group create --name $RG_NAME --location $LOCATION

# 1. Azure Storage Account & Containers
Write-Host ">>> Creating Azure Storage Account: $STORAGE_NAME..."
az storage account create `
    --name $STORAGE_NAME `
    --resource-group $RG_NAME `
    --location $LOCATION `
    --sku Standard_LRS `
    --kind StorageV2 `
    --allow-blob-public-access false

$STORAGE_KEY = (az storage account keys list --account-name $STORAGE_NAME --resource-group $RG_NAME --query "[0].value" -o tsv)
az storage container create --name "knowledge-documents" --account-name $STORAGE_NAME --account-key $STORAGE_KEY
az storage container create --name "audit-evidences" --account-name $STORAGE_NAME --account-key $STORAGE_KEY

# 2. Azure Key Vault
Write-Host ">>> Creating Azure Key Vault: $KEYVAULT_NAME..."
az keyvault create `
    --name $KEYVAULT_NAME `
    --resource-group $RG_NAME `
    --location $LOCATION `
    --enable-rbac-authorization false

# 3. Azure SQL Server & Database
Write-Host ">>> Creating Azure SQL Server: $SQL_SERVER_NAME..."
az sql server create `
    --name $SQL_SERVER_NAME `
    --resource-group $RG_NAME `
    --location $LOCATION `
    --admin-user $SQL_ADMIN_USER `
    --admin-password $SQL_ADMIN_PASS `
    --enable-public-network true

Write-Host ">>> Configuring SQL Firewall (Allow Azure Services)..."
az sql server firewall-rule create `
    --resource-group $RG_NAME `
    --server $SQL_SERVER_NAME `
    --name "AllowAzureServices" `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Add Client Current Public IP
$CLIENT_IP = (Invoke-RestMethod -Uri "https://api.ipify.org")
Write-Host ">>> Adding current client IP ($CLIENT_IP) to SQL Firewall..."
az sql server firewall-rule create `
    --resource-group $RG_NAME `
    --server $SQL_SERVER_NAME `
    --name "AllowClientIP" `
    --start-ip-address $CLIENT_IP `
    --end-ip-address $CLIENT_IP

Write-Host ">>> Creating Azure SQL Database: $SQL_DB_NAME (Basic tier for hackathon budget)..."
az sql db create `
    --resource-group $RG_NAME `
    --server $SQL_SERVER_NAME `
    --name $SQL_DB_NAME `
    --edition Basic `
    --capacity 5

# 4. Azure OpenAI Service & Model Deployments
Write-Host ">>> Creating Azure OpenAI Account: $AOAI_NAME..."
az cognitiveservices account create `
    --name $AOAI_NAME `
    --resource-group $RG_NAME `
    --location $LOCATION `
    --kind OpenAI `
    --sku S0

Write-Host ">>> Deploying gpt-4o model..."
az cognitiveservices account deployment create `
    --resource-group $RG_NAME `
    --name $AOAI_NAME `
    --deployment-name "gpt-4o" `
    --model-name "gpt-4o" `
    --model-version "2024-08-06" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard"

Write-Host ">>> Deploying text-embedding-3-large model..."
az cognitiveservices account deployment create `
    --resource-group $RG_NAME `
    --name $AOAI_NAME `
    --deployment-name "text-embedding-3-large" `
    --model-name "text-embedding-3-large" `
    --model-version "1" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard"

# 5. Azure AI Search
Write-Host ">>> Creating Azure AI Search Service: $SEARCH_NAME..."
az search service create `
    --name $SEARCH_NAME `
    --resource-group $RG_NAME `
    --location $LOCATION `
    --sku basic `
    --partition-count 1 `
    --replica-count 1

# 6. Log Analytics & Application Insights
Write-Host ">>> Creating Log Analytics Workspace..."
az monitor log-analytics workspace create `
    --resource-group $RG_NAME `
    --workspace-name $WORKSPACE_NAME `
    --location $LOCATION

$WORKSPACE_ID = (az monitor log-analytics workspace show --resource-group $RG_NAME --workspace-name $WORKSPACE_NAME --query id -o tsv)

Write-Host ">>> Creating Application Insights..."
az monitor app-insights component create `
    --app $APPINS_NAME `
    --location $LOCATION `
    --resource-group $RG_NAME `
    --workspace $WORKSPACE_ID

# 7. Extract Connection Strings & Populate Key Vault
$AOAI_KEY = (az cognitiveservices account keys list --name $AOAI_NAME --resource-group $RG_NAME --query key1 -o tsv)
$AOAI_ENDPOINT = (az cognitiveservices account show --name $AOAI_NAME --resource-group $RG_NAME --query "properties.endpoint" -o tsv)
$APPINS_CONN_STR = (az monitor app-insights component show --app $APPINS_NAME --resource-group $RG_NAME --query connectionString -o tsv)
$SEARCH_KEY = (az search admin-key show --service-name $SEARCH_NAME --resource-group $RG_NAME --query primaryKey -o tsv)

az keyvault secret set --vault-name $KEYVAULT_NAME --name "AzureOpenAIKey" --value $AOAI_KEY
az keyvault secret set --vault-name $KEYVAULT_NAME --name "AzureOpenAIEndpoint" --value $AOAI_ENDPOINT
az keyvault secret set --vault-name $KEYVAULT_NAME --name "SqlConnectionString" --value "Driver={ODBC Driver 18 for SQL Server};Server=tcp:$SQL_SERVER_NAME.database.windows.net,1433;Database=$SQL_DB_NAME;Uid=$SQL_ADMIN_USER;Pwd=$SQL_ADMIN_PASS;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"

Write-Host "================================================================="
Write-Host " PROVISIONING COMPLETE! COPY THESE ENVIRONMENT VARIABLES TO .env:"
Write-Host "================================================================="
Write-Host "AZURE_OPENAI_ENDPOINT=$AOAI_ENDPOINT"
Write-Host "AZURE_OPENAI_API_KEY=$AOAI_KEY"
Write-Host "AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o"
Write-Host "AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-large"
Write-Host "AZURE_SQL_SERVER=$SQL_SERVER_NAME.database.windows.net"
Write-Host "AZURE_SQL_DATABASE=$SQL_DB_NAME"
Write-Host "AZURE_SQL_USER=$SQL_ADMIN_USER"
Write-Host "AZURE_SQL_PASSWORD=$SQL_ADMIN_PASS"
Write-Host "AZURE_SEARCH_ENDPOINT=https://$SEARCH_NAME.search.windows.net"
Write-Host "AZURE_SEARCH_API_KEY=$SEARCH_KEY"
Write-Host "AZURE_STORAGE_ACCOUNT=$STORAGE_NAME"
Write-Host "AZURE_STORAGE_KEY=$STORAGE_KEY"
Write-Host "APPLICATIONINSIGHTS_CONNECTION_STRING=$APPINS_CONN_STR"
```

---

## 3. Cost-Optimization Guardrails
- **SQL Database**: Basic Tier (5 DTU, 2GB) costs ~\$5/month, fully adequate for hackathon benchmarks ($100k+$ synthetic records).
- **Azure OpenAI**: Pay-as-you-go token consumption. Rate-limited to 30k TPM.
- **Azure AI Search**: Basic SKU costs ~\$75/month. Can be stopped or torn down after judging.
- **Auto-Shutdown / Teardown**: Run `az group delete --name rg-paytm-resolveai-prod --yes --no-wait` when hackathon finishes.
