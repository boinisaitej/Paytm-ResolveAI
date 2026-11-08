# ==============================================================================
# PAYTM RESOLVEAI - AZURE RESOURCE PROVISIONING SCRIPT (HYDERABAD AI HACKATHON)
# New Project-Specific Azure Services:
#   Resource Group: rg-paytm-resolveai-hyd
#   Azure OpenAI:   aoai-paytm-resolveai-hyd
#   Azure SQL:      sql-paytm-resolveai-hyd / sqldb-paytm-resolveai-core
#   Azure Search:   srch-paytm-resolveai-hyd
#   Storage:        stpaytmresolveaihyd
#   Key Vault:      kv-paytm-resolveai-hyd
#   Log Analytics:  log-paytm-resolveai-hyd
#   App Insights:   appi-paytm-resolveai-hyd
# ==============================================================================

param (
    [string]$Location = "eastus2",
    [string]$ResourceGroupName = "rg-paytm-resolveai-hyd",
    [string]$SqlAdminUser = "paytmadmin",
    [string]$SqlAdminPassword = "PaytmSecure#2026!"
)

$ErrorActionPreference = "Stop"

Write-Host ">>> Verifying Azure Authentication..."
$account = az account show --query "name" -o tsv 2>$null
if (-not $account) {
    Write-Error "Not logged into Azure CLI. Run 'az login' before executing this script."
    exit 1
}
Write-Host "Authenticated as subscription: $account"

# Project-specific custom resource names
$AOAI_NAME = "aoai-paytm-resolveai-hyd"
$SQL_SERVER_NAME = "sql-paytm-resolveai-hyd"
$SQL_DB_NAME = "sqldb-paytm-resolveai-core"
$SEARCH_NAME = "srch-paytm-resolveai-hyd"
$STORAGE_NAME = "stpaytmresolveaihyd"
$KEYVAULT_NAME = "kv-paytm-resolveai-hyd"
$WORKSPACE_NAME = "log-paytm-resolveai-hyd"
$APPINS_NAME = "appi-paytm-resolveai-hyd"

Write-Host ">>> [1/7] Creating Resource Group: $ResourceGroupName ($Location)..."
az group create --name $ResourceGroupName --location $Location

Write-Host ">>> [2/7] Creating Storage Account: $STORAGE_NAME..."
az storage account create `
    --name $STORAGE_NAME `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku Standard_LRS `
    --kind StorageV2 `
    --allow-blob-public-access false

$STORAGE_KEY = (az storage account keys list --account-name $STORAGE_NAME --resource-group $ResourceGroupName --query "[0].value" -o tsv)
az storage container create --name "knowledge-documents" --account-name $STORAGE_NAME --account-key $STORAGE_KEY
az storage container create --name "audit-evidences" --account-name $STORAGE_NAME --account-key $STORAGE_KEY

Write-Host ">>> [3/7] Creating Key Vault: $KEYVAULT_NAME..."
az keyvault create `
    --name $KEYVAULT_NAME `
    --resource-group $ResourceGroupName `
    --location $Location `
    --enable-rbac-authorization false

Write-Host ">>> [4/7] Creating Azure SQL Server: $SQL_SERVER_NAME..."
az sql server create `
    --name $SQL_SERVER_NAME `
    --resource-group $ResourceGroupName `
    --location $Location `
    --admin-user $SqlAdminUser `
    --admin-password $SqlAdminPassword `
    --enable-public-network true

Write-Host ">>> Configuring SQL Firewall Rules..."
az sql server firewall-rule create `
    --resource-group $ResourceGroupName `
    --server $SQL_SERVER_NAME `
    --name "AllowAzureServices" `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

try {
    $CLIENT_IP = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 5)
    az sql server firewall-rule create `
        --resource-group $ResourceGroupName `
        --server $SQL_SERVER_NAME `
        --name "AllowClientIP" `
        --start-ip-address $CLIENT_IP `
        --end-ip-address $CLIENT_IP
    Write-Host "Added public IP ($CLIENT_IP) to SQL firewall."
} catch {
    Write-Warning "Could not detect IP automatically; add IP rule manually in Azure Portal."
}

Write-Host ">>> Creating Azure SQL Database: $SQL_DB_NAME (Basic tier)..."
az sql db create `
    --resource-group $ResourceGroupName `
    --server $SQL_SERVER_NAME `
    --name $SQL_DB_NAME `
    --edition Basic `
    --capacity 5

Write-Host ">>> [5/7] Creating Azure OpenAI Service: $AOAI_NAME..."
az cognitiveservices account create `
    --name $AOAI_NAME `
    --resource-group $ResourceGroupName `
    --location $Location `
    --kind OpenAI `
    --sku S0

Write-Host ">>> Deploying gpt-4o model..."
az cognitiveservices account deployment create `
    --resource-group $ResourceGroupName `
    --name $AOAI_NAME `
    --deployment-name "gpt-4o" `
    --model-name "gpt-4o" `
    --model-version "2024-08-06" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard"

Write-Host ">>> Deploying text-embedding-3-large model..."
az cognitiveservices account deployment create `
    --resource-group $ResourceGroupName `
    --name $AOAI_NAME `
    --deployment-name "text-embedding-3-large" `
    --model-name "text-embedding-3-large" `
    --model-version "1" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard"

Write-Host ">>> [6/7] Creating Azure AI Search: $SEARCH_NAME..."
az search service create `
    --name $SEARCH_NAME `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku basic `
    --partition-count 1 `
    --replica-count 1

Write-Host ">>> [7/7] Creating Application Insights: $APPINS_NAME..."
az monitor log-analytics workspace create `
    --resource-group $ResourceGroupName `
    --workspace-name $WORKSPACE_NAME `
    --location $Location

$WORKSPACE_ID = (az monitor log-analytics workspace show --resource-group $ResourceGroupName --workspace-name $WORKSPACE_NAME --query id -o tsv)

az monitor app-insights component create `
    --app $APPINS_NAME `
    --location $Location `
    --resource-group $ResourceGroupName `
    --workspace $WORKSPACE_ID

# Retrieve Keys
$AOAI_KEY = (az cognitiveservices account keys list --name $AOAI_NAME --resource-group $ResourceGroupName --query key1 -o tsv)
$AOAI_ENDPOINT = (az cognitiveservices account show --name $AOAI_NAME --resource-group $ResourceGroupName --query "properties.endpoint" -o tsv)
$APPINS_CONN_STR = (az monitor app-insights component show --app $APPINS_NAME --resource-group $ResourceGroupName --query connectionString -o tsv)
$SEARCH_KEY = (az search admin-key show --service-name $SEARCH_NAME --resource-group $ResourceGroupName --query primaryKey -o tsv)

# Save to backend/.env
$ENV_CONTENT = @"
APP_NAME=Paytm ResolveAI
APP_ENV=development
DEBUG=true
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173","http://localhost:3000"]

AZURE_OPENAI_ENDPOINT=$AOAI_ENDPOINT
AZURE_OPENAI_API_KEY=$AOAI_KEY
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-large
AZURE_OPENAI_API_VERSION=2024-06-01

AZURE_SQL_SERVER=$SQL_SERVER_NAME.database.windows.net
AZURE_SQL_DATABASE=$SQL_DB_NAME
AZURE_SQL_USER=$SqlAdminUser
AZURE_SQL_PASSWORD=$SqlAdminPassword
AZURE_SQL_DRIVER=ODBC Driver 18 for SQL Server
AZURE_SQL_PORT=1433

AZURE_SEARCH_ENDPOINT=https://$SEARCH_NAME.search.windows.net
AZURE_SEARCH_API_KEY=$SEARCH_KEY
AZURE_SEARCH_INDEX_NAME=paytm-knowledge-index

AZURE_STORAGE_ACCOUNT=$STORAGE_NAME
AZURE_STORAGE_KEY=$STORAGE_KEY
AZURE_STORAGE_CONTAINER=knowledge-documents

APPLICATIONINSIGHTS_CONNECTION_STRING=$APPINS_CONN_STR
"@

$ENV_PATH = Join-Path (Get-Location) "backend\.env"
Set-Content -Path $ENV_PATH -Value $ENV_CONTENT

Write-Host "================================================================="
Write-Host " PAYTM RESOLVEAI AZURE SERVICES PROVISIONED SUCCESSFULLY!"
Write-Host " Configuration written to: $ENV_PATH"
Write-Host "================================================================="
