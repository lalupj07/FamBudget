# 🚀 Railway Backend Deployment Helper
# This script prepares and guides you through Railway deployment

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 FamBudget Backend - Railway Deployment" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Step 1: Verify build
Write-Host "📦 Step 1: Verifying backend build..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath
Write-Host "   Running build..." -ForegroundColor Gray
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Step 2: Generate JWT_SECRET
Write-Host "`n🔑 Step 2: Generating JWT_SECRET..." -ForegroundColor Yellow
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
Write-Host "   ✅ JWT_SECRET generated!" -ForegroundColor Green
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "   $jwtSecret" -ForegroundColor Cyan
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Step 3: Check Git status
Write-Host "📝 Step 3: Checking Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "   ✅ Git repository found!" -ForegroundColor Green
        Write-Host "   Remote: $remoteUrl" -ForegroundColor Gray
        
        # Check for uncommitted changes
        $status = git status --short backend/ 2>$null
        if ($status) {
            Write-Host "   ⚠️  You have uncommitted backend changes!" -ForegroundColor Yellow
            Write-Host "   Consider committing and pushing before deploying.`n" -ForegroundColor Yellow
        } else {
            Write-Host "   ✅ Backend code is clean!" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️  No remote repository found." -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Not a Git repository." -ForegroundColor Yellow
}

# Step 4: Display environment variables
Write-Host "`n📋 Step 4: Environment Variables for Railway" -ForegroundColor Yellow
Write-Host "   Copy these into Railway's Variables tab:`n" -ForegroundColor White
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
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Save JWT_SECRET to file
$jwtFile = Join-Path $PSScriptRoot "JWT_SECRET.txt"
$jwtSecret | Out-File -FilePath $jwtFile -Encoding utf8
Write-Host "   ✅ JWT_SECRET saved to: JWT_SECRET.txt" -ForegroundColor Green
Write-Host "   (Keep this file private and delete after deployment!)`n" -ForegroundColor Gray

# Step 5: Open Railway
Write-Host "🌐 Step 5: Opening Railway dashboard..." -ForegroundColor Yellow
Start-Process "https://railway.app"
Write-Host "   ✅ Railway dashboard opened in browser!`n" -ForegroundColor Green

# Display instructions
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Backend is ready for deployment!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📖 Quick Deployment Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. In Railway:" -ForegroundColor White
Write-Host "      • New Project • Deploy from GitHub repo" -ForegroundColor Gray
Write-Host "      • Select FamBudget repository" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Configure Service:" -ForegroundColor White
Write-Host "      • Click on service • Settings • Root Directory" -ForegroundColor Gray
Write-Host "      • Set to: backend" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Add Database:" -ForegroundColor White
Write-Host "      • New • Database • PostgreSQL" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Set Variables:" -ForegroundColor White
Write-Host "      • Backend service • Variables tab • Raw Editor" -ForegroundColor Gray
Write-Host "      • Paste variables from above" -ForegroundColor Gray
Write-Host "      • Replace Postgres with your DB service name if different" -ForegroundColor Gray
Write-Host ""
Write-Host "   5. Wait for Deployment:" -ForegroundColor White
Write-Host "      • Watch Deployments tab - takes 2-5 minutes" -ForegroundColor Gray
Write-Host "      • Green checkmark means Success!" -ForegroundColor Gray
Write-Host ""
Write-Host "   6. Get Backend URL:" -ForegroundColor White
Write-Host "      • Settings • Domains • Copy URL" -ForegroundColor Gray
Write-Host ""
Write-Host "   7. Test:" -ForegroundColor White
Write-Host "      • Visit: https://your-url.railway.app/health" -ForegroundColor Gray
Write-Host "      • Should return JSON with status 'ok'" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full guide: DEPLOY-BACKEND-RAILWAY.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

