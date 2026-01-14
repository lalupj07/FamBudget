# Script to clean Gradle cache and fix JDK image transformation errors

Write-Host "Cleaning Gradle cache and build files..." -ForegroundColor Yellow

# Navigate to Android directory
Push-Location "mobile/android"

try {
    # Stop Gradle daemon
    Write-Host "Stopping Gradle daemon..." -ForegroundColor Cyan
    .\gradlew.bat --stop
    
    # Clean Gradle cache for JDK images
    Write-Host "Cleaning JDK image transform cache..." -ForegroundColor Cyan
    $gradleCache = "$env:USERPROFILE\.gradle\caches\transforms-3"
    if (Test-Path $gradleCache) {
        Remove-Item -Path "$gradleCache\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Cleaned transforms-3 cache" -ForegroundColor Green
    }
    
    # Clean build directories
    Write-Host "Cleaning build directories..." -ForegroundColor Cyan
    .\gradlew.bat clean
    
    # Clean Android Studio cache
    Write-Host "Cleaning Android Studio cache..." -ForegroundColor Cyan
    $asCache = "$env:USERPROFILE\.android\build-cache"
    if (Test-Path $asCache) {
        Remove-Item -Path "$asCache\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Cleaned Android Studio build cache" -ForegroundColor Green
    }
    
    Write-Host "`nCleaning complete! Try building again." -ForegroundColor Green
    Write-Host "Run: cd mobile/android && .\gradlew.bat assembleDebug" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error during cleanup: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

