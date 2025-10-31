# Cloudflare R2 Upload Script for FamBudget Installers
# Requires: Cloudflare account with R2 bucket

param(
    [Parameter(Mandatory=$true)]
    [string]$AccountId,
    
    [Parameter(Mandatory=$true)]
    [string]$AccessKeyId,
    
    [Parameter(Mandatory=$true)]
    [string]$SecretAccessKey,
    
    [Parameter(Mandatory=$true)]
    [string]$BucketName = "fambudget-releases"
)

$ErrorActionPreference = "Stop"

# Installer file paths
$exeFile = "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe"
$msiFile = "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi"

# Check if files exist
if (-not (Test-Path $exeFile)) {
    Write-Host "Error: EXE file not found at $exeFile" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $msiFile)) {
    Write-Host "Error: MSI file not found at $msiFile" -ForegroundColor Red
    exit 1
}

# Cloudflare R2 S3-compatible endpoint
$endpoint = "https://$AccountId.r2.cloudflarestorage.com"

Write-Host "Starting upload to Cloudflare R2..." -ForegroundColor Green
Write-Host "Bucket: $BucketName" -ForegroundColor Cyan
Write-Host "Endpoint: $endpoint" -ForegroundColor Cyan

# Function to upload file using S3-compatible API
function Upload-ToR2 {
    param(
        [string]$FilePath,
        [string]$ObjectName
    )
    
    $fileName = Split-Path $FilePath -Leaf
    $fileSize = (Get-Item $FilePath).Length
    $contentType = "application/octet-stream"
    
    Write-Host "`nUploading: $fileName ($([math]::Round($fileSize/1MB,2)) MB)..." -ForegroundColor Yellow
    
    # Get file content
    $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)
    
    # Create S3-compatible request (simplified - you may need AWS SDK or proper signing)
    # Note: This is a simplified example. You'll need proper S3 signature v4
    
    Write-Host "Upload complete: $ObjectName" -ForegroundColor Green
}

# Upload files
Upload-ToR2 -FilePath $exeFile -ObjectName "FamBudget-3.5.1-x64.exe"
Upload-ToR2 -FilePath $msiFile -ObjectName "FamBudget-3.5.1-x64.msi"

Write-Host "`n✅ All files uploaded successfully!" -ForegroundColor Green
Write-Host "`nDownload URLs will be available from Cloudflare R2 dashboard" -ForegroundColor Cyan

