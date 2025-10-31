@echo off
echo ========================================
echo    FamBudget v2.0.0 Build Script
echo ========================================
echo.

echo Building Windows Installers...
echo.

echo [1/3] Building NSIS Installer (EXE)...
npm run build-exe
echo.

echo [2/3] Building MSI Installer...
npm run build-msi
echo.

echo [3/3] Building Portable Version...
npm run build-portable
echo.

echo ========================================
echo    Build Complete!
echo ========================================
echo.
echo Files created in dist-v2.0.0 folder:
echo - FamBudget-2.0.0-x64.exe (NSIS Installer)
echo - FamBudget-2.0.0-x64.msi (MSI Installer)
echo - FamBudget-2.0.0-x64.exe (Portable)
echo.
echo Ready for distribution!
echo.
pause
