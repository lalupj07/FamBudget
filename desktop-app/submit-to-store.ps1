# Microsoft Store Submission Script for FamBudget
# This script automates the process of preparing and submitting to Microsoft Store

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FamBudget - Microsoft Store Submission" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
$currentDir = Get-Location
if (-not $currentDir.Path.EndsWith("desktop-app")) {
    Write-Host "⚠️  Warning: Not in desktop-app directory" -ForegroundColor Yellow
    Write-Host "   Changing to desktop-app directory...`n" -ForegroundColor Yellow
    Set-Location "desktop-app"
}

# Step 1: Verify Partner Center Access
Write-Host "Step 1: Partner Center Verification" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "Before proceeding, ensure you have:" -ForegroundColor White
Write-Host "  ✓ Microsoft Partner Center account (https://partner.microsoft.com/dashboard)" -ForegroundColor White
Write-Host "  ✓ App name reserved (FamBudget)" -ForegroundColor White
Write-Host "  ✓ Publisher name from Partner Center" -ForegroundColor White
Write-Host ""
$hasAccount = Read-Host "Do you have a Partner Center account and app reserved? (y/n)"

if ($hasAccount -ne "y" -and $hasAccount -ne "Y") {
    Write-Host "`n❌ Please complete Partner Center setup first!" -ForegroundColor Red
    Write-Host "   See: MICROSOFT-STORE-SUBMISSION.md for instructions`n" -ForegroundColor Yellow
    Write-Host "Steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://partner.microsoft.com/dashboard" -ForegroundColor White
    Write-Host "  2. Sign in and complete account verification" -ForegroundColor White
    Write-Host "  3. Navigate to: Apps and games → New product → MSIX" -ForegroundColor White
    Write-Host "  4. Reserve app name: FamBudget`n" -ForegroundColor White
    exit 1
}

# Step 2: Get Publisher Name
Write-Host "`nStep 2: Publisher Name Configuration" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "IMPORTANT: The publisher name must exactly match Partner Center!" -ForegroundColor Yellow
Write-Host ""
Write-Host "To find your publisher name:" -ForegroundColor White
Write-Host "  1. Go to: https://partner.microsoft.com/dashboard" -ForegroundColor White
Write-Host "  2. Click Account Settings (gear icon)" -ForegroundColor White
Write-Host "  3. Navigate to Developer Account or Account Settings" -ForegroundColor White
Write-Host "  4. Find 'Publisher Identity' or 'Publisher Display Name'" -ForegroundColor White
Write-Host ""
$publisherName = Read-Host "Enter your exact Partner Center publisher name (e.g., CN=YourCompany O=YourCompany Inc C=US)"

if ([string]::IsNullOrWhiteSpace($publisherName)) {
    Write-Host "`n❌ Publisher name cannot be empty!" -ForegroundColor Red
    Write-Host "   See: get-publisher-name.md for help`n" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "You entered: $publisherName" -ForegroundColor Cyan
$confirmPublisher = Read-Host "Is this correct? (y/n)"

if ($confirmPublisher -ne "y" -and $confirmPublisher -ne "Y") {
    Write-Host "`nPlease run the script again with the correct publisher name.`n" -ForegroundColor Yellow
    exit 1
}

# Step 3: Update package.json
Write-Host "`nStep 3: Updating package.json" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

$packageJsonPath = "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    exit 1
}

$packageJson = Get-Content $packageJsonPath | ConvertFrom-Json

# Update the publisher in the appx section
if (-not $packageJson.build.appx) {
    Write-Host "❌ appx section not found in package.json!" -ForegroundColor Red
    exit 1
}

$oldPublisher = $packageJson.build.appx.publisher
Write-Host "Current publisher: $oldPublisher" -ForegroundColor White
Write-Host "New publisher: $publisherName" -ForegroundColor White

$packageJson.build.appx.publisher = $publisherName

# Save the updated package.json
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
Write-Host "✓ package.json updated successfully`n" -ForegroundColor Green

# Step 4: Verify Assets
Write-Host "Step 4: Verifying Required Assets" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$requiredAssets = @(
    "assets\StoreLogo.png",
    "assets\Square150x150Logo.png",
    "assets\Square44x44Logo.png",
    "assets\Wide310x150Logo.png"
)

$missingAssets = @()
foreach ($asset in $requiredAssets) {
    if (-not (Test-Path $asset)) {
        $missingAssets += $asset
        Write-Host "  ❌ Missing: $asset" -ForegroundColor Red
    } else {
        Write-Host "  ✓ Found: $asset" -ForegroundColor Green
    }
}

if ($missingAssets.Count -gt 0) {
    Write-Host "`n⚠️  Warning: Some required assets are missing!" -ForegroundColor Yellow
    Write-Host "   The build will continue, but you'll need these for the final submission.`n" -ForegroundColor Yellow
} else {
    Write-Host "`n✓ All required assets found`n" -ForegroundColor Green
}

# Step 5: Build MSIX Package
Write-Host "Step 5: Building MSIX Package" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "This may take a few minutes...`n" -ForegroundColor White

$buildResult = npm run build-msix

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!`n" -ForegroundColor Green
    
    # Find the built .appx file
    $appxFiles = Get-ChildItem -Path "dist-v3.5.1" -Filter "*.appx" -Recurse -ErrorAction SilentlyContinue
    
    if ($appxFiles.Count -eq 0) {
        Write-Host "⚠️  Build completed but .appx file not found!" -ForegroundColor Yellow
        Write-Host "   Check dist-v3.5.1 directory for build artifacts.`n" -ForegroundColor Yellow
    } else {
        $appxFile = $appxFiles[0]
        Write-Host "Package created:" -ForegroundColor Cyan
        Write-Host "  Location: $($appxFile.FullName)" -ForegroundColor White
        Write-Host "  Size: $([math]::Round($appxFile.Length / 1MB, 2)) MB" -ForegroundColor White
        Write-Host ""
        
        # Open the dist folder
        Write-Host "Opening dist folder..." -ForegroundColor Cyan
        Start-Process "explorer.exe" -ArgumentList $appxFile.DirectoryName
    }
} else {
    Write-Host "`n❌ Build failed!" -ForegroundColor Red
    Write-Host "   Check the error messages above.`n" -ForegroundColor Yellow
    exit 1
}

# Step 6: Submission Instructions
Write-Host "`nStep 6: Store Submission Instructions" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps to submit to Microsoft Store:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Partner Center:" -ForegroundColor White
Write-Host "   https://partner.microsoft.com/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Navigate to your app (FamBudget)" -ForegroundColor White
Write-Host ""
Write-Host "3. Create a new submission or update existing:" -ForegroundColor White
Write-Host "   - Click 'Create new submission' or 'Update'" -ForegroundColor White
Write-Host ""
Write-Host "4. Complete each section:" -ForegroundColor White
Write-Host "   a) Pricing and Availability" -ForegroundColor White
Write-Host "   b) Properties (Category, System Requirements)" -ForegroundColor White
Write-Host "   c) Age Ratings (Complete IARC questionnaire)" -ForegroundColor White
Write-Host "   d) Packages (Upload the .appx file from dist-v3.5.1)" -ForegroundColor White
Write-Host "   e) Store Listings (Screenshots, Description, etc.)" -ForegroundColor White
Write-Host ""
Write-Host "5. Review and Submit:" -ForegroundColor White
Write-Host "   - Review all sections" -ForegroundColor White
Write-Host "   - Click Submit for certification" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: MICROSOFT-STORE-SUBMISSION.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Estimated certification time: 1-3 business days`n" -ForegroundColor Cyan

Write-Host "✅ Submission preparation complete!`n" -ForegroundColor Green
