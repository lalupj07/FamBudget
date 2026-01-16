@echo off
title FamBudget v4.0.1 - Building All Formats
color 0A
cls
echo.
echo ================================================================
echo    FAMBUDGET v4.0.1 - BUILDING ALL WINDOWS FORMATS
echo ================================================================
echo.
echo Building:
echo - NSIS Installer (.exe)
echo - MSI Installer (.msi)
echo - MSIX Package (.appx) - Microsoft Store
echo - Portable EXE (.exe)
echo.
echo This will take 5-10 minutes...
echo.
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Cleaning old build...
if exist "dist-v4.0.1" (
    echo Removing old dist-v4.0.1 folder...
    rmdir /s /q "dist-v4.0.1" 2>nul
)
echo.

echo [2/3] Building all formats...
call npm run build-all-formats
echo.

echo [3/3] Build complete!
echo.
echo Output location: dist-v4.0.1\
echo.
echo Files created:
echo - FamBudget-4.0.1-x64.exe (NSIS installer)
echo - FamBudget-4.0.1-x64.msi (MSI installer)
echo - FamBudget-4.0.1-x64.appx (MSIX package)
echo - FamBudget-4.0.1-x64.exe (Portable)
echo.

pause
