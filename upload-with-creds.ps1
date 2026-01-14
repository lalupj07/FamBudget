# Quick upload script with credentials
# Run this after getting your R2 credentials

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessKey,
    
    [Parameter(Mandatory=$true)]
    [string]$SecretKey
)

$env:R2_ACCESS_KEY_ID = $AccessKey
$env:R2_SECRET_ACCESS_KEY = $SecretKey

Write-Host "`nStarting upload with provided credentials...`n" -ForegroundColor Green

python upload-to-r2.py

