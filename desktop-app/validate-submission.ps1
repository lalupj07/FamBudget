# FamBudget - Submission Validation Script
# This script validates your submission readiness before going to Partner Center

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FamBudget - Submission Validation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# Check 1: Package exists
Write-Host "Checking package file..." -ForegroundColor Yellow
$packagePath = "dist-v3.5.1\FamBudget-3.5.1-x64.appx"
if (Test-Path $packagePath) {
    $packageSize = [math]::Round((Get-Item $packagePath).Length / 1MB, 2)
    Write-Host "  ✓ Package found: $packageSize MB" -ForegroundColor Green
} else {
    Write-Host "  ✗ Package NOT found!" -ForegroundColor Red
    $errors += "Package file missing: $packagePath"
}

# Check 2: Package.json publisher
Write-Host "`nChecking publisher configuration..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$publisher = $packageJson.build.appx.publisher
Write-Host "  Current publisher: $publisher" -ForegroundColor Cyan
Write-Host "  ⚠️  VERIFY THIS MATCHES PARTNER CENTER EXACTLY!" -ForegroundColor Yellow
Write-Host "  Partner Center → Account Settings → Publisher Identity" -ForegroundColor White
$warnings += "Verify publisher matches Partner Center exactly: $publisher"

# Check 3: Required assets
Write-Host "`nChecking required assets..." -ForegroundColor Yellow
$requiredAssets = @(
    "assets\StoreLogo.png",
    "assets\Square150x150Logo.png",
    "assets\Square44x44Logo.png",
    "assets\Wide310x150Logo.png"
)

$missingAssets = @()
foreach ($asset in $requiredAssets) {
    if (Test-Path $asset) {
        Write-Host "  ✓ Found: $asset" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Missing: $asset" -ForegroundColor Red
        $missingAssets += $asset
    }
}

if ($missingAssets.Count -gt 0) {
    $warnings += "Some assets may be missing. Package may use defaults."
}

# Check 4: Submission requirements checklist
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUBMISSION REQUIREMENTS CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Before submitting to Partner Center, ensure you have:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required Items:" -ForegroundColor White
Write-Host "  [ ] Partner Center account created and verified" -ForegroundColor Cyan
Write-Host "  [ ] App name 'FamBudget' reserved in Partner Center" -ForegroundColor Cyan
Write-Host "  [ ] Publisher name verified matches Partner Center exactly" -ForegroundColor Cyan
Write-Host "  [ ] Privacy Policy URL ready (REQUIRED - must be publicly accessible)" -ForegroundColor Cyan
Write-Host "  [ ] At least 1 screenshot (1366x768px minimum)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Recommended Items:" -ForegroundColor White
Write-Host "  [ ] Support URL (your website or email)" -ForegroundColor Gray
Write-Host "  [ ] Additional screenshots (up to 10)" -ForegroundColor Gray
Write-Host "  [ ] App descriptions written (short + full)" -ForegroundColor Gray
Write-Host "  [ ] Keywords defined" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "✓ Package is ready!" -ForegroundColor Green
} else {
    Write-Host "✗ Errors found:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Verify publisher name in Partner Center" -ForegroundColor White
Write-Host "2. Ensure you have Privacy Policy URL ready" -ForegroundColor White
Write-Host "3. Prepare at least 1 screenshot (1366x768px)" -ForegroundColor White
Write-Host "4. Go to: https://partner.microsoft.com/dashboard" -ForegroundColor White
Write-Host "5. Follow the submission guide: SUBMIT-NOW.md`n" -ForegroundColor White

Write-Host "Package Location:" -ForegroundColor Yellow
if (Test-Path $packagePath) {
    $fullPath = (Get-Item $packagePath).FullName
    Write-Host "  $fullPath" -ForegroundColor White
    Write-Host ""
}

