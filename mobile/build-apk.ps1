# FamBudget - Build APK Script
# This script helps build an Android APK

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FamBudget - Android APK Builder" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Choose build method:`n" -ForegroundColor Yellow
Write-Host "1. EAS Build (Cloud - Recommended)" -ForegroundColor White
Write-Host "   - Requires Expo account" -ForegroundColor Gray
Write-Host "   - Builds in the cloud" -ForegroundColor Gray
Write-Host "   - Best for production`n" -ForegroundColor Gray

Write-Host "2. Local Build (Requires Android Studio)" -ForegroundColor White
Write-Host "   - Requires Android Studio & SDK" -ForegroundColor Gray
Write-Host "   - Builds on your machine" -ForegroundColor Gray
Write-Host "   - Good for testing`n" -ForegroundColor Gray

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host "`nSetting up EAS Build...`n" -ForegroundColor Green
    
    # Check if EAS CLI is installed
    $easInstalled = Get-Command eas -ErrorAction SilentlyContinue
    if (-not $easInstalled) {
        Write-Host "Installing EAS CLI..." -ForegroundColor Yellow
        npm install -g eas-cli
    }
    
    Write-Host "Step 1: Login to Expo (if not already)" -ForegroundColor Cyan
    Write-Host "Run: eas login`n" -ForegroundColor White
    
    Write-Host "Step 2: Configure EAS" -ForegroundColor Cyan
    Write-Host "Run: eas build:configure`n" -ForegroundColor White
    
    Write-Host "Step 3: Build APK" -ForegroundColor Cyan
    Write-Host "For development APK:" -ForegroundColor White
    Write-Host "  eas build --platform android --profile development`n" -ForegroundColor Green
    
    Write-Host "For production APK:" -ForegroundColor White
    Write-Host "  eas build --platform android --profile production`n" -ForegroundColor Green
    
    Write-Host "The APK will be available for download from your Expo dashboard.`n" -ForegroundColor Cyan
    
} elseif ($choice -eq "2") {
    Write-Host "`nSetting up Local Build...`n" -ForegroundColor Green
    
    # Check prerequisites
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    $androidHome = $env:ANDROID_HOME
    if (-not $androidHome) {
        Write-Host "⚠️  ANDROID_HOME not set!" -ForegroundColor Yellow
        Write-Host "   Set it to your Android SDK location:" -ForegroundColor White
        Write-Host "   Example: C:\Users\YourUser\AppData\Local\Android\Sdk`n" -ForegroundColor Gray
        Write-Host "   Set environment variable:" -ForegroundColor White
        Write-Host "   `$env:ANDROID_HOME = 'C:\Users\YourUser\AppData\Local\Android\Sdk'`n" -ForegroundColor Gray
    } else {
        Write-Host "✓ ANDROID_HOME: $androidHome" -ForegroundColor Green
    }
    
    Write-Host "`nLocal Build Steps:" -ForegroundColor Cyan
    Write-Host "1. Install dependencies:" -ForegroundColor White
    Write-Host "   npm install`n" -ForegroundColor Green
    
    Write-Host "2. Generate Android project:" -ForegroundColor White
    Write-Host "   npx expo prebuild --platform android`n" -ForegroundColor Green
    
    Write-Host "3. Build debug APK:" -ForegroundColor White
    Write-Host "   cd android" -ForegroundColor Green
    Write-Host "   .\gradlew assembleDebug`n" -ForegroundColor Green
    
    Write-Host "4. APK location:" -ForegroundColor White
    Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk`n" -ForegroundColor Cyan
    
    Write-Host "⚠️  Note: You need Android Studio and Android SDK installed.`n" -ForegroundColor Yellow
    
} else {
    Write-Host "`nInvalid choice. Exiting.`n" -ForegroundColor Red
    exit 1
}

Write-Host "For detailed instructions, see: build-apk.md`n" -ForegroundColor Cyan

