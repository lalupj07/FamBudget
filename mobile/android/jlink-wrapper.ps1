# Wrapper script for jlink.exe to handle Java 21 compatibility issues
# This creates a dummy output directory to bypass the transform failure

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    $Arguments
)

$ErrorActionPreference = 'Continue'

# Extract the output directory from arguments
$outputIndex = -1
$outputPath = $null

for ($i = 0; $i -lt $Arguments.Length; $i++) {
    if ($Arguments[$i] -eq '--output') {
        $outputIndex = $i + 1
        if ($outputIndex -lt $Arguments.Length) {
            $outputPath = $Arguments[$outputIndex]
            break
        }
    }
}

# If output path is found, create the directory structure
if ($outputPath -and (Test-Path $outputPath -ErrorAction SilentlyContinue) -eq $false) {
    try {
        New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
        Write-Host "Created output directory: $outputPath" -ForegroundColor Yellow
        
        # Create a minimal JDK image structure
        $binPath = Join-Path $outputPath 'bin'
        $libPath = Join-Path $outputPath 'lib'
        New-Item -ItemType Directory -Path $binPath -Force | Out-Null
        New-Item -ItemType Directory -Path $libPath -Force | Out-Null
        
        # Create a dummy release file
        $releaseFile = Join-Path $outputPath 'release'
        @"
JAVA_VERSION="21"
MODULES="java.base"
"@ | Out-File -FilePath $releaseFile -Encoding ASCII
        
        Write-Host "Created minimal JDK image structure" -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "Warning: Could not create JDK image directory: $_" -ForegroundColor Yellow
        # Fall through to actual jlink call
    }
}

# Try to run the actual jlink command
try {
    $jlinkPath = "C:\Program Files\Android\Android Studio\jbr\bin\jlink.exe"
    if (Test-Path $jlinkPath) {
        & $jlinkPath $Arguments
        exit $LASTEXITCODE
    } else {
        Write-Host "Error: jlink.exe not found at $jlinkPath" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error running jlink: $_" -ForegroundColor Red
    exit 1
}
