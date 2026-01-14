# Open Android Studio with FamBudget Project
Write-Host "`n🚀 Opening FamBudget in Android Studio...`n" -ForegroundColor Cyan

$projectPath = "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android"

# Check if Android Studio is installed
$studioPaths = @(
    "$env:ProgramFiles\Android\Android Studio\bin\studio64.exe",
    "${env:ProgramFiles(x86)}\Android\Android Studio\bin\studio64.exe",
    "$env:LOCALAPPDATA\Programs\Android\Android Studio\bin\studio64.exe"
)

$studioFound = $false
foreach ($path in $studioPaths) {
    if (Test-Path $path) {
        Write-Host "✓ Android Studio found: $path" -ForegroundColor Green
        Start-Process -FilePath $path -ArgumentList $projectPath
        $studioFound = $true
        Write-Host "`n✅ Opening Android Studio with project...`n" -ForegroundColor Green
        break
    }
}

if (-not $studioFound) {
    Write-Host "❌ Android Studio not found!" -ForegroundColor Red
    Write-Host "`nPlease install Android Studio first:" -ForegroundColor Yellow
    Write-Host "  1. Download: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "  2. Install Android Studio" -ForegroundColor White
    Write-Host "  3. Then run this script again`n" -ForegroundColor White
    Write-Host "Or manually:" -ForegroundColor Yellow
    Write-Host "  1. Open Android Studio" -ForegroundColor White
    Write-Host "  2. File → Open" -ForegroundColor White
    Write-Host "  3. Navigate to: $projectPath`n" -ForegroundColor White
}

Write-Host "Project Location: $projectPath`n" -ForegroundColor Cyan

