# Fix for Java 21 compatibility issue with Android Gradle Plugin
# The jlink tool in Java 21 may not be compatible with AGP

Write-Host "Checking Java version and fixing JDK image transform issue..." -ForegroundColor Yellow

# Check current Java version
$javaVersion = java -version 2>&1 | Select-String "version" | Select-Object -First 1
Write-Host "Current Java: $javaVersion" -ForegroundColor Cyan

# Check if Java 17 is available
$java17Paths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.x",
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk-17*"
)

$java17Found = $null
foreach ($path in $java17Paths) {
    if (Test-Path $path) {
        $java17Found = (Get-ChildItem $path -Directory -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
        if ($java17Found) {
            Write-Host "Found Java 17 at: $java17Found" -ForegroundColor Green
            break
        }
    }
}

if ($java17Found) {
    Write-Host "`nUpdating gradle.properties to use Java 17..." -ForegroundColor Yellow
    
    $gradleProps = "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android\gradle.properties"
    if (Test-Path $gradleProps) {
        $content = Get-Content $gradleProps -Raw
        # Update Java home to Java 17
        $content = $content -replace 'org\.gradle\.java\.home=.*', "org.gradle.java.home=$java17Found"
        Set-Content $gradleProps $content -NoNewline
        Write-Host "Updated gradle.properties to use Java 17" -ForegroundColor Green
    }
} else {
    Write-Host "`nJava 17 not found. Options:" -ForegroundColor Yellow
    Write-Host "1. Download Java 17 from: https://adoptium.net/temurin/releases/" -ForegroundColor Cyan
    Write-Host "2. Or try the workaround below (may not work with Java 21)" -ForegroundColor Cyan
    
    Write-Host "`nApplying additional workarounds for Java 21..." -ForegroundColor Yellow
    
    # Add more aggressive workarounds
    $gradleProps = "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android\gradle.properties"
    if (Test-Path $gradleProps) {
        $content = Get-Content $gradleProps -Raw
        
        # Add Java 21 specific workarounds
        if ($content -notmatch "android.experimental.enableSourceSetPathsMap") {
            $content += "`n# Java 21 compatibility workarounds`n"
            $content += "android.experimental.enableSourceSetPathsMap=false`n"
            $content += "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED`n"
            
            Set-Content $gradleProps $content -NoNewline
            Write-Host "Added Java 21 compatibility workarounds" -ForegroundColor Green
        }
    }
}

Write-Host "`nCleaning Gradle cache..." -ForegroundColor Yellow
cd "C:\Users\lalup\OneDrive\Desktop\Project Cipher\FamBudget\mobile\android"
.\gradlew.bat --stop
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\transforms-3" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Cache cleaned" -ForegroundColor Green

Write-Host "`nTry building again with: .\gradlew.bat assembleDebug" -ForegroundColor Yellow
Write-Host "If it still fails, consider installing Java 17" -ForegroundColor Yellow

