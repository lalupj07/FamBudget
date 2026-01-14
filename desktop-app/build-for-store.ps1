# Build MSIX Package for Microsoft Store Submission

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FamBudget - Microsoft Store Build" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if publisher name is set
Write-Host "⚠️  IMPORTANT: Update publisher name in package.json!" -ForegroundColor Yellow
Write-Host "   The publisher MUST match your Partner Center publisher name`n" -ForegroundColor Yellow

Write-Host "Step 1: Verify publisher name in Partner Center" -ForegroundColor Green
Write-Host "   https://partner.microsoft.com/dashboard → Account Settings → Publisher`n" -ForegroundColor White

Write-Host "Step 2: Update package.json → build.appx.publisher" -ForegroundColor Green
Write-Host "   Must match exactly (including spaces and capitalization)`n" -ForegroundColor White

$continue = Read-Host "Have you updated the publisher name? (y/n)"

if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "`nPlease update the publisher name first.`n" -ForegroundColor Red
    Write-Host "See: get-publisher-name.md for instructions`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nBuilding MSIX package...`n" -ForegroundColor Green

# Build MSIX package
cd "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\desktop-app"
npm run build-msix

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!`n" -ForegroundColor Green
    Write-Host "Package location:" -ForegroundColor Cyan
    Write-Host "  desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.appx`n" -ForegroundColor White
    
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Partner Center: https://partner.microsoft.com/dashboard" -ForegroundColor White
    Write-Host "2. Navigate to your app submission" -ForegroundColor White
    Write-Host "3. Upload the .appx file in the Packages section`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Build failed. Check errors above.`n" -ForegroundColor Red
}

