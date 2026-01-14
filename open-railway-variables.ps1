# Open Railway Variables page in browser
# Note: You'll still need to manually add the variables, but this opens the page for you

$railwayUrl = "https://railway.app"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Opening Railway Dashboard..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Login to Railway if needed" -ForegroundColor White
Write-Host "2. Navigate to: FamBudget project → Backend service → Variables tab" -ForegroundColor White
Write-Host "3. Add all 10 variables from COPY-PASTE-VARIABLES.txt" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Green
Write-Host ""

Start-Process $railwayUrl

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Browser opened!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Login to Railway" -ForegroundColor White
Write-Host "2. Go to FamBudget project" -ForegroundColor White
Write-Host "3. Click on backend service" -ForegroundColor White
Write-Host "4. Click 'Variables' tab" -ForegroundColor White
Write-Host "5. Add all 10 variables (see COPY-PASTE-VARIABLES.txt)" -ForegroundColor White
Write-Host ""
Write-Host "Remember: Replace 'Postgres' with your actual PostgreSQL service name!" -ForegroundColor Yellow
Write-Host ""

