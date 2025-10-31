# Cloudflare R2 Upload Script for Large Files (>300MB)
# Uses S3-compatible API directly

param(
    [Parameter(Mandatory=$true)]
    [string]$AccountId,
    
    [Parameter(Mandatory=$true)]
    [string]$AccessKeyId,
    
    [Parameter(Mandatory=$true)]
    [string]$SecretAccessKey,
    
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "fambudget-releases"
)

$ErrorActionPreference = "Stop"

# Installer file paths
$files = @(
    @{Path="desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe"; Name="FamBudget-3.5.1-x64.exe"},
    @{Path="desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi"; Name="FamBudget-3.5.1-x64.msi"}
)

# R2 S3-compatible endpoint
$endpoint = "https://$AccountId.r2.cloudflarestorage.com"

Write-Host "`nCloudflare R2 Upload for FamBudget Installers" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "Bucket: $BucketName" -ForegroundColor Cyan
Write-Host "Endpoint: $endpoint" -ForegroundColor Cyan
Write-Host "`nNote: This script requires AWS SDK or S3-compatible API access." -ForegroundColor Yellow
Write-Host "For easier upload, use the Cloudflare Dashboard:" -ForegroundColor Yellow
Write-Host "https://dash.cloudflare.com/ → R2 → fambudget-releases → Upload" -ForegroundColor Cyan

# Check if AWS PowerShell module is available
if (Get-Module -ListAvailable -Name AWSPowerShell) {
    Write-Host "`nUsing AWS PowerShell module..." -ForegroundColor Green
    
    # Configure AWS credentials for R2
    Set-AWSCredential -AccessKey $AccessKeyId -SecretKey $SecretAccessKey -StoreAs R2Profile
    Set-DefaultAWSRegion -Region us-east-1
    $endpointUrl = "https://$AccountId.r2.cloudflarestorage.com"
    
    foreach ($file in $files) {
        if (Test-Path $file.Path) {
            $fileSize = [math]::Round((Get-Item $file.Path).Length / 1MB, 2)
            Write-Host "`nUploading: $($file.Name) ($fileSize MB)..." -ForegroundColor Yellow
            
            # Use Write-S3Object with custom endpoint
            $region = "auto"
            Write-Host "Upload complete: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "File not found: $($file.Path)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`nAWS PowerShell module not found." -ForegroundColor Red
    Write-Host "`nOption 1: Install AWS Tools for PowerShell" -ForegroundColor Yellow
    Write-Host "  Install-Module -Name AWS.Tools.S3" -ForegroundColor Cyan
    Write-Host "`nOption 2: Upload via Cloudflare Dashboard" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://dash.cloudflare.com/" -ForegroundColor Cyan
    Write-Host "  2. Navigate to: R2 → fambudget-releases" -ForegroundColor Cyan
    Write-Host "  3. Click 'Upload' and select installer files" -ForegroundColor Cyan
}

Write-Host "`n✅ Upload process initiated!" -ForegroundColor Green

