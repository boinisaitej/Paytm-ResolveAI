# ==============================================================================
# PAYTM RESOLVEAI - AZURE CLOUD SERVICES PROVISIONING & KEY GENERATOR
# ==============================================================================
# Provisions all required Azure Cloud Services using Azure CLI:
# 1. Resource Group: rg-paytm-resolveai-hyd
# 2. Azure OpenAI Service: aoai-paytm-resolveai-hyd (gpt-4o & text-embedding-3-large)
# 3. Azure AI Search Service: srch-paytm-resolveai-hyd
# 4. Azure Storage Account: stpaytmresolveaihyd (container: knowledge-documents)
# 5. Automatically writes retrieved API keys into backend/.env
# ==============================================================================

param(
    [string]$Location = "eastus2",
    [string]$ResourceGroup = "rg-paytm-resolveai-hyd",
    [string]$OpenAIName = "aoai-paytm-resolveai-hyd",
    [string]$SearchName = "srch-paytm-resolveai-hyd",
    [string]$StorageName = "stpaytmresolveaihyd"
)

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " PAYTM RESOLVEAI - AZURE INFRASTRUCTURE PROVISIONER" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Step 0: Ensure Azure CLI is installed
if (-not (Get-Command "az" -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI (az) is not installed. Install it from https://aka.ms/installazurecliwindows"
    exit 1
}

# Step 1: Check Authentication
Write-Host "[1/6] Checking Azure CLI Authentication..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "[!] Not logged in. Launching Azure interactive login..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "[+] Authenticated as: $($account.user.name)" -ForegroundColor Green
Write-Host "[+] Subscription: $($account.name) ($($account.id))`n" -ForegroundColor Green

# Step 2: Create Resource Group
Write-Host "[2/6] Creating Resource Group '$ResourceGroup' in '$Location'..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location --output none
Write-Host "[+] Resource group active.`n" -ForegroundColor Green

# Step 3: Create Azure OpenAI Service
Write-Host "[3/6] Provisioning Azure OpenAI Account '$OpenAIName'..." -ForegroundColor Yellow
az cognitiveservices account create `
    --name $OpenAIName `
    --resource-group $ResourceGroup `
    --location $Location `
    --kind OpenAI `
    --sku s0 `
    --custom-domain $OpenAIName `
    --output none

$openaiEndpoint = "https://$OpenAIName.openai.azure.com/"
$openaiKey = (az cognitiveservices account keys list --name $OpenAIName --resource-group $ResourceGroup | ConvertFrom-Json).key1
Write-Host "[+] Azure OpenAI Endpoint: $openaiEndpoint" -ForegroundColor Green
Write-Host "[+] Azure OpenAI API Key successfully generated!`n" -ForegroundColor Green

# Deploy gpt-4o model
Write-Host "    Deploying 'gpt-4o' chat deployment..." -ForegroundColor Gray
az cognitiveservices account deployment create `
    --name $OpenAIName `
    --resource-group $ResourceGroup `
    --deployment-name "gpt-4o" `
    --model-name "gpt-4o" `
    --model-version "2024-05-13" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard" `
    --output none 2>$null

# Deploy embedding model
Write-Host "    Deploying 'text-embedding-3-large' deployment..." -ForegroundColor Gray
az cognitiveservices account deployment create `
    --name $OpenAIName `
    --resource-group $ResourceGroup `
    --deployment-name "text-embedding-3-large" `
    --model-name "text-embedding-3-large" `
    --model-version "1" `
    --model-format OpenAI `
    --sku-capacity 30 `
    --sku-name "Standard" `
    --output none 2>$null

# Step 4: Create Azure AI Search Service
Write-Host "[4/6] Provisioning Azure AI Search Service '$SearchName'..." -ForegroundColor Yellow
az search service create `
    --name $SearchName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku basic `
    --output none

$searchEndpoint = "https://$SearchName.search.windows.net"
$searchKey = (az search admin-key show --service-name $SearchName --resource-group $ResourceGroup | ConvertFrom-Json).primaryKey
Write-Host "[+] Azure AI Search Endpoint: $searchEndpoint" -ForegroundColor Green
Write-Host "[+] Azure AI Search Admin Key successfully generated!`n" -ForegroundColor Green

# Step 5: Create Azure Blob Storage
Write-Host "[5/6] Provisioning Azure Storage Account '$StorageName'..." -ForegroundColor Yellow
az storage account create `
    --name $StorageName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Standard_LRS `
    --output none

$storageKey = (az storage account keys list --account-name $StorageName --resource-group $ResourceGroup | ConvertFrom-Json)[0].value
az storage container create --account-name $StorageName --account-key $storageKey --name "knowledge-documents" --output none
Write-Host "[+] Azure Storage Account & Container 'knowledge-documents' ready!`n" -ForegroundColor Green

# Step 6: Write API Keys into backend/.env
Write-Host "[6/6] Writing production keys to backend/.env..." -ForegroundColor Yellow
$envFile = Join-Path $PSScriptRoot "..\.env"

$envContent = @"
# ==============================================================================
# PAYTM RESOLVEAI - ENVIRONMENT CONFIGURATION (PROVISIONED VIA AZURE CLI)
# ==============================================================================
APP_NAME="Paytm ResolveAI"
APP_ENV="development"
DEBUG=true
PORT=8000

# Active Employee Profile
EMPLOYEE_ID="EMP201"
EMPLOYEE_NAME="Ananya Deshmukh"
EMPLOYEE_ROLE="Lead Payment Operations Officer"

# PostgreSQL Database (Zero SQLite!)
DATABASE_TYPE="postgresql"
DATABASE_URL="postgresql+psycopg2://postgres:postgres_password@localhost:5432/paytm_resolveai"

# Azure OpenAI (Exclusive LLM Provider)
AZURE_OPENAI_ENDPOINT="$openaiEndpoint"
AZURE_OPENAI_API_KEY="$openaiKey"
AZURE_OPENAI_CHAT_DEPLOYMENT="gpt-4o"
AZURE_OPENAI_EMBEDDING_DEPLOYMENT="text-embedding-3-large"
AZURE_OPENAI_API_VERSION="2024-06-01"

# Azure AI Search (RAG Knowledge Base)
AZURE_SEARCH_ENDPOINT="$searchEndpoint"
AZURE_SEARCH_API_KEY="$searchKey"
AZURE_SEARCH_INDEX_NAME="paytm-knowledge-index"

# Azure Blob Storage (Policy SOPs & Guidelines)
AZURE_STORAGE_ACCOUNT="$StorageName"
AZURE_STORAGE_KEY="$storageKey"
AZURE_STORAGE_CONTAINER="knowledge-documents"
"@

Set-Content -Path $envFile -Value $envContent -Encoding UTF8
Write-Host "[+] backend/.env successfully populated with Azure API Keys!" -ForegroundColor Green
Write-Host "`nAll Azure Cloud Services are fully provisioned and linked.`n" -ForegroundColor Cyan
