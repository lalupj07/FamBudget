# Build APK Locally - PowerShell Script
Write-Host "`n🔨 Building FamBudget APK Locally...`n" -ForegroundColor Cyan

# Check if Android folder exists
if (-not (Test-Path "android")) {
    Write-Host "Generating Android project..." -ForegroundColor Yellow
    npx expo prebuild --platform android
}

Write-Host "Building APK..." -ForegroundColor Yellow
Write-Host "This may take several minutes...`n" -ForegroundColor Gray

cd android
.\gradlew.bat assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build Successful!`n" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
        Write-Host "APK Location:" -ForegroundColor Cyan
        Write-Host "  $((Get-Item $apkPath).FullName)" -ForegroundColor White
        Write-Host "  Size: $apkSize MB`n" -ForegroundColor White
        Write-Host "You can now install this APK on Android devices!`n" -ForegroundColor Green
    }
} else {
    Write-Host "`n❌ Build Failed!`n" -ForegroundColor Red
    Write-Host "Check the errors above. Common issues:" -ForegroundColor Yellow
    Write-Host "  - Android SDK not properly configured" -ForegroundColor White
    Write-Host "  - Missing dependencies" -ForegroundColor White
    Write-Host "  - Gradle configuration errors`n" -ForegroundColor White
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "  1. cd android && .\gradlew.bat clean" -ForegroundColor White
    Write-Host "  2. cd .. && npm install" -ForegroundColor White
    Write-Host "  3. Try building again`n" -ForegroundColor White
}

cd ..

