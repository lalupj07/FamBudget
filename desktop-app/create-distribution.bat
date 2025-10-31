@echo off
echo ========================================
echo    FamBudget v2.0.0 Distribution
echo ========================================
echo.

echo Creating distribution package...
echo.

REM Create distribution folder
if not exist "FamBudget-v2.0.0-Distribution" mkdir "FamBudget-v2.0.0-Distribution"

REM Copy build files when ready
echo Waiting for build to complete...
timeout /t 30 /nobreak >nul

REM Check if dist folder exists
if exist "dist-v2.0.0" (
    echo Copying build files...
    xcopy "dist-v2.0.0\*" "FamBudget-v2.0.0-Distribution\" /E /I /Y
    
    echo Copying documentation...
    copy "README-v2.0.0.md" "FamBudget-v2.0.0-Distribution\"
    copy "package.json" "FamBudget-v2.0.0-Distribution\"
    
    echo Creating distribution info...
    echo FamBudget v2.0.0 Distribution Package > "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo Created: %date% %time% >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo. >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo Installation Options: >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - FamBudget-2.0.0-x64.exe (NSIS Installer) >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - FamBudget-2.0.0-x64.msi (MSI Package) >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - FamBudget-2.0.0-x64.exe (Portable Version) >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo. >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo New Features in v2.0.0: >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Income Tracker with Multiple Sources >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Multi-Currency Support (10+ currencies) >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Recurring vs One-Time Income >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Enhanced Analytics & Reporting >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Premium Dark Mode >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    echo - Improved User Experience >> "FamBudget-v2.0.0-Distribution\DISTRIBUTION-INFO.txt"
    
    echo.
    echo ========================================
    echo    Distribution Package Created!
    echo ========================================
    echo.
    echo Location: FamBudget-v2.0.0-Distribution\
    echo.
    echo Ready for distribution!
    echo.
) else (
    echo Build not yet complete. Please wait and run again.
    echo.
)

pause
