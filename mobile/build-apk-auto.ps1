# Auto-build APK script
# This script attempts to build the APK automatically

Write-Host "`n🚀 Starting APK Build Process...`n" -ForegroundColor Cyan

# Step 1: Configure EAS
Write-Host "Step 1: Configuring EAS project..." -ForegroundColor Yellow
$configureResult = Start-Process -FilePath "eas" -ArgumentList "build:configure", "--platform", "android" -Wait -PassThru -NoNewWindow
if ($configureResult.ExitCode -eq 0) {
    Write-Host "✓ EAS configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Configuration may require manual input" -ForegroundColor Yellow
}

# Step 2: Build
Write-Host "`nStep 2: Starting build..." -ForegroundColor Yellow
Start-Process -FilePath "eas" -ArgumentList "build", "--platform", "android", "--profile", "preview" -NoNewWindow

Write-Host "`n✅ Build process started!`n" -ForegroundColor Green
Write-Host "Note: You may need to answer prompts in the terminal window that opens." -ForegroundColor Yellow
Write-Host "The build will run in the cloud and take 15-20 minutes.`n" -ForegroundColor Cyan


