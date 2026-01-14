# Direct Cloudflare R2 Upload Script for Large Files
# Uses S3-compatible API

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessKeyId,
    
    [Parameter(Mandatory=$true)]
    [string]$SecretAccessKey,
    
    [Parameter(Mandatory=$false)]
    [string]$AccountId = "647f9fc61c9ebc9d3727647373806a51",
    
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "fambudget-releases"
)

$ErrorActionPreference = "Stop"

# R2 S3-compatible endpoint
$endpoint = "https://$AccountId.r2.cloudflarestorage.com"
$region = "auto"

# Files to upload
$files = @(
    @{
        Path = "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe"
        Key = "FamBudget-3.5.1-x64.exe"
        ContentType = "application/octet-stream"
    },
    @{
        Path = "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi"
        Key = "FamBudget-3.5.1-x64.msi"
        ContentType = "application/octet-stream"
    }
)

Write-Host "`nCloudflare R2 Direct Upload" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "Bucket: $BucketName" -ForegroundColor Cyan
Write-Host "Endpoint: $endpoint" -ForegroundColor Cyan

# Check if boto3 (Python) is available for S3 upload
$pythonAvailable = $false
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pythonAvailable = $true
        Write-Host "`nPython found. Attempting upload with boto3..." -ForegroundColor Yellow
        
        # Create Python script for upload
        $pythonScript = @"
import boto3
import os
from botocore.config import Config

access_key = '$AccessKeyId'
secret_key = '$SecretAccessKey'
account_id = '$AccountId'
bucket_name = '$BucketName'

# R2 S3-compatible endpoint
endpoint_url = f'https://{account_id}.r2.cloudflarestorage.com'

# Create S3 client for R2
s3 = boto3.client(
    's3',
    endpoint_url=endpoint_url,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
    region_name='auto',
    config=Config(signature_version='s3v4')
)

files_to_upload = [
    ('desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe', 'FamBudget-3.5.1-x64.exe'),
    ('desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi', 'FamBudget-3.5.1-x64.msi')
]

for local_path, s3_key in files_to_upload:
    if os.path.exists(local_path):
        file_size_mb = os.path.getsize(local_path) / (1024 * 1024)
        print(f'Uploading {s3_key} ({file_size_mb:.2f} MB)...')
        s3.upload_file(local_path, bucket_name, s3_key)
        print(f'✅ Uploaded: {s3_key}')
    else:
        print(f'❌ File not found: {local_path}')

print('\\n✅ All files uploaded successfully!')
"@
        
        $pythonScript | Out-File -FilePath "temp_upload.py" -Encoding UTF8
        
        # Install boto3 if needed
        python -m pip install boto3 --quiet
        
        # Run upload
        python temp_upload.py
        
        # Cleanup
        Remove-Item "temp_upload.py" -ErrorAction SilentlyContinue
        
    }
} catch {
    Write-Host "Python not found. Please install Python or use Cloudflare Dashboard." -ForegroundColor Red
    Write-Host "`nAlternative: Upload via Dashboard:" -ForegroundColor Yellow
    Write-Host "https://dash.cloudflare.com/ → R2 → fambudget-releases → Upload" -ForegroundColor Cyan
}

if (-not $pythonAvailable) {
    Write-Host "`nTo upload via script, you need:" -ForegroundColor Yellow
    Write-Host "1. Python installed (python.org)" -ForegroundColor White
    Write-Host "2. Run: pip install boto3" -ForegroundColor White
    Write-Host "3. Run this script with your R2 credentials" -ForegroundColor White
}

