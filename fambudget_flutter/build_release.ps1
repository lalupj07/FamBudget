# FamBudget - Build portable ZIP, MSIX, Setup.exe (Inno), and .msi (WiX)
# Run from repo root: .\fambudget_flutter\build_release.ps1
# Or from fambudget_flutter: .\build_release.ps1
#
# Optional: Install Inno Setup 6 for Setup.exe, WiX Toolset v3 for .msi.
# If not installed, portable ZIP and MSIX are still produced.

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Version = "5.0.0"
$DistDir = Join-Path $ProjectRoot "dist"
$ReleaseDir = Join-Path $ProjectRoot "build\windows\x64\runner\Release"
$PortableZipName = "FamBudget-Portable-$Version.zip"
$InstallerDir = Join-Path $ProjectRoot "installer"

Write-Host "FamBudget Windows release build" -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

# 1. Dependencies
Write-Host "[1/6] flutter pub get..." -ForegroundColor Yellow
Set-Location $ProjectRoot
flutter pub get
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# 2. Build Windows release
Write-Host "[2/6] flutter build windows..." -ForegroundColor Yellow
flutter build windows --release
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# 3. Portable ZIP
Write-Host "[3/6] Creating portable ZIP..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $DistDir | Out-Null
$PortableZipPath = Join-Path $DistDir $PortableZipName
if (Test-Path $PortableZipPath) { Remove-Item $PortableZipPath -Force }
Compress-Archive -Path "$ReleaseDir\*" -DestinationPath $PortableZipPath -CompressionLevel Optimal
Write-Host "  -> $PortableZipPath" -ForegroundColor Green

# 4. MSIX installer
Write-Host "[4/6] Creating MSIX installer..." -ForegroundColor Yellow
dart run msix:create
if ($LASTEXITCODE -ne 0) {
    Write-Host "  MSIX create failed. Portable ZIP was created successfully." -ForegroundColor Yellow
} else {
    Write-Host "  -> $DistDir\FamBudget-Setup.msix" -ForegroundColor Green
}

# 5. Inno Setup (Setup.exe) - optional
Write-Host "[5/6] Creating Setup.exe (Inno Setup)..." -ForegroundColor Yellow
$IsccExe = $null
if (Get-Command iscc -ErrorAction SilentlyContinue) {
    $IsccExe = (Get-Command iscc).Source
} elseif (Test-Path "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe") {
    $IsccExe = "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe"
}
if ($IsccExe) {
    Set-Location $ProjectRoot
    & $IsccExe /Qp "$InstallerDir\FamBudget.iss"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  -> $DistDir\FamBudget-Setup-$Version.exe" -ForegroundColor Green
    } else {
        Write-Host "  Inno Setup failed (exit $LASTEXITCODE)." -ForegroundColor Yellow
    }
} else {
    Write-Host "  Inno Setup not found. Install from https://jrsoftware.org/isinfo.php for Setup.exe" -ForegroundColor DarkGray
}

# 6. WiX MSI - optional
Write-Host "[6/6] Creating .msi (WiX)..." -ForegroundColor Yellow
$Heat = Get-Command heat -ErrorAction SilentlyContinue
$Candle = Get-Command candle -ErrorAction SilentlyContinue
$Light = Get-Command light -ErrorAction SilentlyContinue
if ($Heat -and $Candle -and $Light) {
    Set-Location $InstallerDir
    $ReleaseDirAbs = (Resolve-Path (Join-Path $ProjectRoot "build\windows\x64\runner\Release")).Path
    $HarvestWxs = Join-Path $InstallerDir "harvest.wxs"
    & heat dir $ReleaseDirAbs -cg FamBudgetFiles -gg -sf -srd -dr INSTALLFOLDER -var var.ReleaseDir -out harvest.wxs
    if ($LASTEXITCODE -eq 0) {
        & candle -dReleaseDir=$ReleaseDirAbs -arch x64 -ext WixUIExtension FamBudget.wxs harvest.wxs
        if ($LASTEXITCODE -eq 0) {
            $MsiOut = Join-Path $DistDir "FamBudget-Setup-$Version.msi"
            & light -out $MsiOut -ext WixUIExtension -sice:ICE61 FamBudget.wixobj harvest.wixobj
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  -> $MsiOut" -ForegroundColor Green
                Remove-Item harvest.wxs, FamBudget.wixobj, harvest.wixobj -ErrorAction SilentlyContinue
            } else {
                Write-Host "  WiX light failed." -ForegroundColor Yellow
            }
        } else {
            Write-Host "  WiX candle failed." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  WiX heat failed." -ForegroundColor Yellow
    }
    Set-Location $ProjectRoot
} else {
    Write-Host "  WiX Toolset not found. Add WiX bin to PATH for .msi (e.g. WiX v3.11)." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Done. Outputs in: $DistDir" -ForegroundColor Cyan
Write-Host "  - Portable: $PortableZipName"
Write-Host "  - MSIX installer: FamBudget-Setup.msix"
Write-Host "  - Setup.exe (if Inno installed): FamBudget-Setup-$Version.exe"
Write-Host "  - .msi (if WiX installed): FamBudget-Setup-$Version.msi"
