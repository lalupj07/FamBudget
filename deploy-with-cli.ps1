# Automated Railway Deployment Script
# This script deploys the backend to Railway using the CLI

Write-Host "`n=== Railway CLI Deployment ===" -ForegroundColor Cyan
Write-Host "`nStep 1: Login to Railway..." -ForegroundColor Yellow
Write-Host "   This will open your browser for authentication." -ForegroundColor Gray
Write-Host "   Complete the login, then press Enter here to continue..." -ForegroundColor Gray
Read-Host "   Press Enter after completing Railway login"

Write-Host "`nStep 2: Initialize Railway project..." -ForegroundColor Yellow
Set-Location "backend"
railway init

Write-Host "`nStep 3: Creating PostgreSQL database..." -ForegroundColor Yellow
railway add --database postgresql

Write-Host "`nStep 4: Setting environment variables..." -ForegroundColor Yellow
$jwtSecret = Get-Content "../JWT_SECRET.txt" -TotalCount 1

# Database variables will be auto-linked when we add the database
railway variables set "DB_HOST" '${{Postgres.PGHOST}}' 2>&1 | Out-Null
railway variables set "DB_PORT" '${{Postgres.PGPORT}}' 2>&1 | Out-Null
railway variables set "DB_USERNAME" '${{Postgres.PGUSER}}' 2>&1 | Out-Null
railway variables set "DB_PASSWORD" '${{Postgres.PGPASSWORD}}' 2>&1 | Out-Null
railway variables set "DB_DATABASE" '${{Postgres.PGDATABASE}}' 2>&1 | Out-Null
railway variables set "JWT_SECRET" "$jwtSecret"
railway variables set "JWT_EXPIRATION" "7d"
railway variables set "NODE_ENV" "production"
railway variables set "PORT" "3000"

Write-Host "   ✅ Environment variables set!" -ForegroundColor Green

Write-Host "`nStep 5: Linking to GitHub..." -ForegroundColor Yellow
railway link

Write-Host "`nStep 6: Deploying backend..." -ForegroundColor Yellow
railway up

Write-Host "`nStep 7: Getting deployment URL..." -ForegroundColor Yellow
$url = railway domain
Write-Host "   ✅ Backend deployed at: $url" -ForegroundColor Green

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "   Test your backend: $url/health" -ForegroundColor Cyan
Set-Location ..

