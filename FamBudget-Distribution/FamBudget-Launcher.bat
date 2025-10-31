@echo off
title FamBudget - Family Budgeting App

REM ========================================
REM FamBudget Quick Launcher
REM ========================================

echo.
echo  ███████╗ █████╗ ███╗   ███╗██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗
echo  ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
echo  █████╗  ███████║██╔████╔██║██████╔╝██║   ██║██║  ██║██║   ██║█████╗     ██║   
echo  ██╔══╝  ██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║   
echo  ██║     ██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   
echo  ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
echo.
echo  🏠 Family Budgeting Made Simple
echo.

REM Check if FamBudget is installed
if not exist "%USERPROFILE%\FamBudget" (
    echo ❌ FamBudget is not installed.
    echo.
    echo Please run the installer first:
    echo 1. Download FamBudget-Portable-Installer.bat
    echo 2. Right-click and "Run as administrator"
    echo 3. Follow the installation wizard
    echo.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Or run the FamBudget installer.
    echo.
    pause
    exit /b 1
)

REM Check if PostgreSQL is running
sc query postgresql | find "RUNNING" >nul
if %errorLevel% neq 0 (
    echo ⚠️  PostgreSQL is not running. Starting it now...
    net start postgresql
    if %errorLevel% neq 0 (
        echo ❌ Failed to start PostgreSQL.
        echo Please check your PostgreSQL installation.
        pause
        exit /b 1
    )
)

echo ✅ System checks passed!
echo.
echo ========================================
echo  STARTING FAMBUDGET
echo ========================================
echo.

cd /d "%USERPROFILE%\FamBudget"

echo 🚀 Starting backend server...
start "FamBudget Backend" cmd /k "cd backend && npm run start:dev"

echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

echo 📱 Starting mobile development server...
start "FamBudget Mobile" cmd /k "cd mobile && npm start"

echo.
echo ========================================
echo  ✅ FAMBUDGET IS STARTING!
echo ========================================
echo.
echo 🌐 Backend API: http://localhost:3000
echo 📱 Mobile App: Expo DevTools will open
echo.
echo 📋 Demo Login:
echo    📧 Email: alex@demofamily.com
echo    🔑 Password: demo123456
echo.
echo 💡 To stop the app, close both command windows.
echo.
echo Press any key to continue...
pause >nul
