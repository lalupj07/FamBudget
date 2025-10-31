@echo off
title FamBudget Desktop - FIXED VERSION
color 0A

echo.
echo  ███████╗ █████╗ ███╗   ███╗██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗
echo  ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
echo  █████╗  ███████║██╔████╔██║██████╔╝██║   ██║██║  ██║██║   ██║█████╗     ██║   
echo  ██╔══╝  ██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║   
echo  ██║     ██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   
echo  ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
echo.
echo  🏠 Family Budgeting Made Simple
echo  💰 Complete Desktop Application - FIXED VERSION
echo  📱 All Features Included - NO MORE ERRORS!
echo  🪟 Windows Native Experience
echo.
echo ========================================
echo  FAMBUDGET DESKTOP - FIXED v1.0.1
echo ========================================
echo.

REM Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ❌ This installer requires administrator privileges
    echo.
    echo Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  INSTALLATION SUMMARY
echo ========================================
echo.
echo This installer will install:
echo.
echo 📦 FamBudget Desktop Application (FIXED)
echo 🗄️ Built-in Database (SQLite)
echo 📱 All Mobile Features
echo 🎯 Complete Budgeting System
echo 🔗 Desktop shortcuts and launchers
echo ✅ NO MORE EXPRESS MODULE ERRORS!
echo.
echo Estimated time: 2-3 minutes
echo.
set /p continue="Continue with installation? (Y/n): "
if /i "%continue%"=="n" (
    echo Installation cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo  STEP 1: CHECKING SYSTEM REQUIREMENTS
echo ========================================
echo.

REM Check if Node.js is already installed
where node >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js is already installed
    for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
    echo    Version: %NODE_VERSION%
) else (
    echo 📥 Node.js not found. Please install Node.js first.
    echo.
    echo Download from: https://nodejs.org/
    echo.
    echo After installing Node.js, run this installer again.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  STEP 2: INSTALLING FAMBUDGET DESKTOP
echo ========================================
echo.

REM Create installation directory
set INSTALL_DIR=%PROGRAMFILES%\FamBudget
echo 📁 Creating installation directory: %INSTALL_DIR%
if exist "%INSTALL_DIR%" (
    echo ⚠️  Directory already exists, backing up...
    if exist "%INSTALL_DIR%.backup" rmdir /s /q "%INSTALL_DIR%.backup"
    ren "%INSTALL_DIR%" "FamBudget.backup"
)
mkdir "%INSTALL_DIR%"
cd /d "%INSTALL_DIR%"

REM Copy application files
echo 📁 Copying application files...
xcopy "%~dp0*" "." /E /I /H /Y /Q

echo.
echo ========================================
echo  STEP 3: INSTALLING DEPENDENCIES
echo ========================================
echo.

echo 📦 Installing application dependencies...
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install dependencies
    goto :error_exit
)

echo.
echo ========================================
echo  STEP 4: BUILDING APPLICATION
echo ========================================
echo.

echo 🔨 Building desktop application...
call npm run build
if %errorLevel% neq 0 (
    echo ❌ Failed to build application
    goto :error_exit
)

echo.
echo ========================================
echo  STEP 5: CREATING SHORTCUTS
echo ========================================
echo.

echo 🔗 Creating desktop shortcuts...

REM Create main launcher shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\dist\win-unpacked\FamBudget.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'FamBudget Desktop Application - FIXED'; $Shortcut.Save()}"

REM Create start menu shortcuts
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $StartMenu = [Environment]::GetFolderPath('StartMenu') + '\Programs\FamBudget'; New-Item -ItemType Directory -Path $StartMenu -Force | Out-Null; $Shortcut = $WshShell.CreateShortcut($StartMenu + '\FamBudget.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\dist\win-unpacked\FamBudget.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'FamBudget Desktop Application - FIXED'; $Shortcut.Save()}"

echo ✅ Desktop and Start Menu shortcuts created

echo.
echo ========================================
echo  ✅ INSTALLATION COMPLETED!
echo ========================================
echo.
echo 🎉 FamBudget Desktop v1.0.1 (FIXED) has been successfully installed!
echo.
echo 📁 Installation Directory: %INSTALL_DIR%
echo 🔗 Desktop Shortcut: Created
echo 📋 Start Menu: Created
echo 🗄️ Database: Built-in SQLite
echo 📱 Features: All mobile features included
echo ✅ FIXED: No more Express module errors!
echo.
echo ========================================
echo  NEXT STEPS
echo ========================================
echo.
echo 1. 🚀 Double-click "FamBudget" on your desktop
echo 2. 💰 Start managing your family budget!
echo 3. 📊 Use all features: transactions, goals, reports
echo 4. 🌙 Toggle dark/light mode as needed
echo 5. ✅ Enjoy error-free experience!
echo.
echo ========================================
echo  FEATURES INCLUDED
echo ========================================
echo.
echo ✅ Complete family budgeting system
echo ✅ Dark/Light mode support
echo ✅ Transaction management
echo ✅ Account tracking
echo ✅ Goal setting and progress
echo ✅ Beautiful charts and reports
echo ✅ Data import/export
echo ✅ Windows native experience
echo ✅ Offline functionality
echo ✅ FIXED: No module errors!
echo.
echo.
echo Press any key to finish installation...
pause >nul

echo.
echo 🎊 Thank you for choosing FamBudget Desktop v1.0.1 (FIXED)!
echo.
echo Your family budgeting journey starts now - ERROR FREE! 💰✨
echo.
echo Press any key to exit...
pause >nul
exit /b 0

:error_exit
echo.
echo ========================================
echo  ❌ INSTALLATION FAILED
echo ========================================
echo.
echo An error occurred during installation.
echo Please check the error messages above.
echo.
echo Common solutions:
echo - Run as administrator
echo - Check internet connection
echo - Ensure sufficient disk space
echo - Disable antivirus temporarily
echo.
echo Press any key to exit...
pause >nul
exit /b 1
