# FamBudget Backend Deployment Script
# This script helps prepare and deploy the backend to Railway

Write-Host "`n=== FamBudget Backend Deployment ===" -ForegroundColor Cyan
Write-Host "`nPreparing backend for Railway deployment...`n" -ForegroundColor Yellow

# Step 1: Verify build
Write-Host "1. Checking backend build..." -ForegroundColor White
$backendPath = "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "   Building backend..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Build failed! Fix errors before deploying." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "   ❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Step 2: Generate JWT_SECRET
Write-Host "`n2. Generating JWT_SECRET..." -ForegroundColor White
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
Write-Host "   ✅ JWT_SECRET generated!" -ForegroundColor Green
Write-Host "   Your JWT_SECRET: $jwtSecret" -ForegroundColor Cyan
Write-Host "   (Save this for Railway environment variables)" -ForegroundColor Gray

# Step 3: Check if git is initialized and has remote
Write-Host "`n3. Checking Git repository..." -ForegroundColor White
if (Test-Path ".git") {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "   ✅ Git repository found!" -ForegroundColor Green
        Write-Host "   Remote: $remoteUrl" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No remote repository found." -ForegroundColor Yellow
        Write-Host "   Make sure to push to GitHub first!" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Not a Git repository." -ForegroundColor Yellow
    Write-Host "   Initialize Git and push to GitHub first!" -ForegroundColor Yellow
}

# Step 4: Prepare environment variables
Write-Host "`n4. Environment Variables for Railway:" -ForegroundColor White
Write-Host "`n   Copy these into Railway Variables:" -ForegroundColor Yellow
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "   DB_HOST=`${{Postgres.PGHOST}}" -ForegroundColor Cyan
Write-Host "   DB_PORT=`${{Postgres.PGPORT}}" -ForegroundColor Cyan
Write-Host "   DB_USERNAME=`${{Postgres.PGUSER}}" -ForegroundColor Cyan
Write-Host "   DB_PASSWORD=`${{Postgres.PGPASSWORD}}" -ForegroundColor Cyan
Write-Host "   DB_DATABASE=`${{Postgres.PGDATABASE}}" -ForegroundColor Cyan
Write-Host "   JWT_SECRET=$jwtSecret" -ForegroundColor Cyan
Write-Host "   JWT_EXPIRATION=7d" -ForegroundColor Cyan
Write-Host "   NODE_ENV=production" -ForegroundColor Cyan
Write-Host "   PORT=3000" -ForegroundColor Cyan
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Step 5: Open Railway
Write-Host "`n5. Opening Railway dashboard..." -ForegroundColor White
Write-Host "   Opening https://railway.app in your browser..." -ForegroundColor Gray
Start-Process "https://railway.app"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Backend is ready for deployment!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Sign up/Login to Railway (GitHub auth)" -ForegroundColor White
Write-Host "   2. New Project → Deploy from GitHub repo" -ForegroundColor White
Write-Host "   3. Select FamBudget repository" -ForegroundColor White
Write-Host "   4. Set Root Directory to: backend" -ForegroundColor White
Write-Host "   5. Add PostgreSQL database (New → Database → PostgreSQL)" -ForegroundColor White
Write-Host "   6. Set Variables (copy from above)" -ForegroundColor White
Write-Host "   7. Wait for deployment (2-5 minutes)" -ForegroundColor White
Write-Host "   8. Get your backend URL from Settings → Domains" -ForegroundColor White
Write-Host "`n📖 Full guide: DEPLOY-BACKEND-NOW.md" -ForegroundColor Cyan
Write-Host "`n"

