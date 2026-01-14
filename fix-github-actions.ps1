# PowerShell script to help fix GitHub Actions deployment conflict
# This script opens the necessary GitHub pages in your browser

Write-Host "`n=== Fix GitHub Actions Deployment Conflict ===" -ForegroundColor Cyan
Write-Host "`nThis script will open the necessary GitHub pages in your browser." -ForegroundColor Yellow
Write-Host "`nFollow these steps:" -ForegroundColor Green

Write-Host "`nStep 1: Cancel stuck deployment" -ForegroundColor Yellow
$actionsUrl = "https://github.com/lalupj07/FamBudget/actions"
Write-Host "Opening: $actionsUrl" -ForegroundColor Cyan
Start-Process $actionsUrl

Write-Host "`nWaiting 5 seconds before opening next page..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`nStep 2: Disable Actions" -ForegroundColor Yellow
$settingsUrl = "https://github.com/lalupj07/FamBudget/settings/actions"
Write-Host "Opening: $settingsUrl" -ForegroundColor Cyan
Start-Process $settingsUrl

Write-Host "`n=== Instructions ===" -ForegroundColor Green
Write-Host "`nIn the Actions tab (first page):" -ForegroundColor White
Write-Host "  1. Find the stuck workflow (orange/yellow status)" -ForegroundColor White
Write-Host "  2. Click on it to open details" -ForegroundColor White
Write-Host "  3. Click 'Cancel workflow' button" -ForegroundColor White
Write-Host "  4. Wait for it to cancel" -ForegroundColor White

Write-Host "`nIn Settings > Actions (second page):" -ForegroundColor White
Write-Host "  1. Scroll down to 'Actions permissions'" -ForegroundColor White
Write-Host "  2. Select 'Disable Actions for this repository'" -ForegroundColor White
Write-Host "  3. Click 'Save' button" -ForegroundColor White

Write-Host "`nAfter completing both steps, run:" -ForegroundColor Green
Write-Host "  cd desktop-app" -ForegroundColor Cyan
Write-Host "  npm run deploy" -ForegroundColor Cyan

Write-Host "`nDone! Your deployment will work without conflicts." -ForegroundColor Green
Write-Host "`n"

