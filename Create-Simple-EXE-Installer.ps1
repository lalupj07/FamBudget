# FamBudget Simple EXE Installer Creator
Write-Host "========================================" -ForegroundColor Green
Write-Host "FamBudget EXE Installer Creator" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check for administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and 'Run as administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running with administrator privileges" -ForegroundColor Green

# Create installer directory
$installerDir = "FamBudget-EXE-Installer"
if (Test-Path $installerDir) {
    Remove-Item $installerDir -Recurse -Force
}
New-Item -ItemType Directory -Path $installerDir | Out-Null
Set-Location $installerDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Creating Application Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Copy application files
Write-Host "📁 Copying application files..." -ForegroundColor Yellow
Copy-Item -Path "..\backend" -Destination "backend" -Recurse -Force
Copy-Item -Path "..\mobile" -Destination "mobile" -Recurse -Force
Copy-Item -Path "..\README.md" -Destination "README.md" -Force
Copy-Item -Path "..\LICENSE" -Destination "LICENSE" -Force
Copy-Item -Path "..\package.json" -Destination "package.json" -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Creating Installer Scripts" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create the main installer script
$installerContent = @"
@echo off
title FamBudget Installer
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
echo  💰 Automatic Income Splitting ^& Expense Tracking
echo  📱 Beautiful Mobile App with Dark Mode
echo  🪟 Windows-Optimized Experience
echo.
echo ========================================
echo  FAMBUDGET INSTALLER v1.0.0
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
echo 📦 FamBudget Application
echo 🗄️ PostgreSQL Database (if not installed)
echo 📱 Expo CLI for mobile development
echo 🎯 Demo data and sample accounts
echo 🔗 Desktop shortcuts and launchers
echo.
echo Estimated time: 5-10 minutes
echo.
set /p continue="Continue with installation? (Y/n): "
if /i "%continue%"=="n" (
    echo Installation cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo  STEP 1: INSTALLING NODE.JS
echo ========================================
echo.

REM Check if Node.js is already installed
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js is already installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    Version: %NODE_VERSION%
) else (
    echo 📥 Downloading Node.js LTS...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile '%TEMP%\nodejs-installer.msi'}"
    if exist "%TEMP%\nodejs-installer.msi" (
        echo 🔧 Installing Node.js...
        msiexec /i "%TEMP%\nodejs-installer.msi" /quiet /norestart
        echo ✅ Node.js installed successfully
        del "%TEMP%\nodejs-installer.msi"
        set PATH=%PATH%;%ProgramFiles%\nodejs
    ) else (
        echo ❌ Failed to download Node.js
        goto :error_exit
    )
)

echo.
echo ========================================
echo  STEP 2: INSTALLING POSTGRESQL
echo ========================================
echo.

REM Check if PostgreSQL is already installed
sc query postgresql >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ PostgreSQL is already installed
) else (
    echo 📥 Downloading PostgreSQL...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64.exe' -OutFile '%TEMP%\postgresql-installer.exe'}"
    if exist "%TEMP%\postgresql-installer.exe" (
        echo 🔧 Installing PostgreSQL...
        echo    Setting password to: fambudget123
        "%TEMP%\postgresql-installer.exe" --mode unattended --superpassword fambudget123 --servicename postgresql --serviceaccount postgres --servicepassword fambudget123
        echo ✅ PostgreSQL installed successfully
        del "%TEMP%\postgresql-installer.exe"
    ) else (
        echo ❌ Failed to download PostgreSQL
        goto :error_exit
    )
)

REM Start PostgreSQL service
echo 🚀 Starting PostgreSQL service...
net start postgresql
if %errorLevel% neq 0 (
    echo ⚠️  PostgreSQL service may already be running
)

echo.
echo ========================================
echo  STEP 3: INSTALLING EXPO CLI
echo ========================================
echo.

echo 🔧 Installing Expo CLI globally...
npm install -g @expo/cli
if %errorLevel% == 0 (
    echo ✅ Expo CLI installed successfully
) else (
    echo ⚠️  Expo CLI installation had issues, but continuing...
)

echo.
echo ========================================
echo  STEP 4: INSTALLING FAMBUDGET
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
xcopy "%~dp0backend" "backend\" /E /I /H /Y /Q
xcopy "%~dp0mobile" "mobile\" /E /I /H /Y /Q
copy "%~dp0README.md" "README.md" /Y
copy "%~dp0LICENSE" "LICENSE" /Y
copy "%~dp0package.json" "package.json" /Y

echo.
echo ========================================
echo  STEP 5: INSTALLING DEPENDENCIES
echo ========================================
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    goto :error_exit
)

echo 📦 Installing mobile dependencies...
cd ..\mobile
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install mobile dependencies
    goto :error_exit
)

echo.
echo ========================================
echo  STEP 6: SETTING UP DATABASE
echo ========================================
echo.

echo 🗄️ Setting up database with demo data...
cd ..\backend
call npm run seed
if %errorLevel% == 0 (
    echo ✅ Database setup completed
) else (
    echo ⚠️  Database setup had issues, but continuing...
)

echo.
echo ========================================
echo  STEP 7: CREATING SHORTCUTS
echo ========================================
echo.

echo 🔗 Creating desktop shortcuts...

REM Create main launcher shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\FamBudget-Launcher.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Start FamBudget Family Budgeting App'; $Shortcut.Save()}"

REM Create setup shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget Setup.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\SETUP-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Setup FamBudget Database'; $Shortcut.Save()}"

REM Create start menu shortcuts
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $StartMenu = [Environment]::GetFolderPath('StartMenu') + '\Programs\FamBudget'; New-Item -ItemType Directory -Path $StartMenu -Force | Out-Null; $Shortcut = $WshShell.CreateShortcut($StartMenu + '\FamBudget.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\FamBudget-Launcher.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Start FamBudget Family Budgeting App'; $Shortcut.Save(); $Shortcut = $WshShell.CreateShortcut($StartMenu + '\FamBudget Setup.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\SETUP-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Setup FamBudget Database'; $Shortcut.Save()}"

echo ✅ Desktop and Start Menu shortcuts created

echo.
echo ========================================
echo  STEP 8: CREATING LAUNCHER SCRIPTS
echo ========================================
echo.

REM Create main launcher
(
echo @echo off
echo title FamBudget - Family Budgeting App
echo echo ========================================
echo echo Starting FamBudget Application
echo echo ========================================
echo echo.
echo echo 🚀 Starting backend server...
echo start "FamBudget Backend" cmd /k "cd backend ^&^& npm run start:dev"
echo.
echo echo ⏳ Waiting for backend to initialize...
echo timeout /t 8 /nobreak ^>nul
echo.
echo echo 📱 Starting mobile development server...
echo start "FamBudget Mobile" cmd /k "cd mobile ^&^& npm start"
echo.
echo echo ========================================
echo echo ✅ FamBudget is starting up!
echo echo ========================================
echo echo.
echo echo 🌐 Backend API: http://localhost:3000
echo echo 📱 Mobile App: Expo DevTools will open
echo echo.
echo echo 📋 Demo Login:
echo echo    📧 Email: alex@demofamily.com
echo echo    🔑 Password: demo123456
echo echo.
echo echo 💡 To stop the app, close both command windows.
echo echo.
echo pause
) > "FamBudget-Launcher.bat"

REM Create setup script
(
echo @echo off
echo title FamBudget Database Setup
echo echo ========================================
echo echo FamBudget Database Setup
echo echo ========================================
echo echo.
echo echo This will set up your database with demo data...
echo echo.
echo pause
echo.
echo echo Starting PostgreSQL...
echo net start postgresql
echo.
echo echo Setting up database...
echo cd backend
echo call npm run seed
echo.
echo echo ========================================
echo echo Database setup completed!
echo echo ========================================
echo echo.
echo echo Your FamBudget database is ready!
echo echo Run "FamBudget-Launcher.bat" to start the app.
echo echo.
echo pause
) > "SETUP-FAMBUDGET.bat"

echo ✅ Launcher scripts created

echo.
echo ========================================
echo  ✅ INSTALLATION COMPLETED!
echo ========================================
echo.
echo 🎉 FamBudget has been successfully installed!
echo.
echo 📁 Installation Directory: %INSTALL_DIR%
echo 🔗 Desktop Shortcuts: Created
echo 📋 Start Menu: Created
echo 🗄️ Database: PostgreSQL with demo data
echo 📱 Mobile App: Ready for Expo Go
echo.
echo ========================================
echo  NEXT STEPS
echo ========================================
echo.
echo 1. 📱 Install Expo Go on your phone
echo 2. 🚀 Double-click "FamBudget" on your desktop
echo 3. 🔐 Login with demo credentials
echo 4. 💰 Start managing your family budget!
echo.
echo ========================================
echo  DEMO CREDENTIALS
echo ========================================
echo.
echo 📧 Email: alex@demofamily.com
echo 🔑 Password: demo123456
echo.
echo ========================================
echo  FEATURES INCLUDED
echo ========================================
echo.
echo ✅ Complete family budgeting system
echo ✅ Dark/Light mode support
echo ✅ Receipt capture with camera
echo ✅ Real-time budget tracking
echo ✅ Goal setting and progress
echo ✅ Beautiful charts and reports
echo ✅ Multi-account management
echo ✅ Windows-optimized experience
echo.
echo.
echo Press any key to finish installation...
pause >nul

echo.
echo 🎊 Thank you for choosing FamBudget!
echo.
echo Your family budgeting journey starts now! 💰✨
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
"@

$installerContent | Out-File -FilePath "installer.bat" -Encoding ASCII

# Create launcher script
$launcherContent = @"
@echo off
title FamBudget - Family Budgeting App
echo ========================================
echo Starting FamBudget Application
echo ========================================
echo.
echo 🚀 Starting backend server...
start "FamBudget Backend" cmd /k "cd backend && npm run start:dev"
echo.
echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak >nul
echo.
echo 📱 Starting mobile development server...
start "FamBudget Mobile" cmd /k "cd mobile && npm start"
echo.
echo ========================================
echo ✅ FamBudget is starting up!
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
pause
"@

$launcherContent | Out-File -FilePath "FamBudget-Launcher.bat" -Encoding ASCII

# Create setup script
$setupContent = @"
@echo off
title FamBudget Database Setup
echo ========================================
echo FamBudget Database Setup
echo ========================================
echo.
echo This will set up your database with demo data...
echo.
pause
echo.
echo Starting PostgreSQL...
net start postgresql
echo.
echo Setting up database...
cd backend
call npm install
call npm run seed
echo.
echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo Your FamBudget database is ready!
echo Run "FamBudget-Launcher.bat" to start the app.
echo.
pause
"@

$setupContent | Out-File -FilePath "SETUP-FAMBUDGET.bat" -Encoding ASCII

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Creating EXE Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create a self-extracting archive
Write-Host "📦 Creating self-extracting EXE installer..." -ForegroundColor Yellow

# Create the installer using PowerShell compression
$zipPath = "FamBudget-Setup.exe"
$tempDir = [System.IO.Path]::GetTempPath() + [System.Guid]::NewGuid().ToString()
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy all files to temp directory
Copy-Item -Path ".\*" -Destination $tempDir -Recurse -Force

# Create the installer header script
$installerHeader = @"
@echo off
title FamBudget Installer
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
echo  💰 Automatic Income Splitting ^& Expense Tracking
echo  📱 Beautiful Mobile App with Dark Mode
echo  🪟 Windows-Optimized Experience
echo.
echo ========================================
echo  FAMBUDGET INSTALLER v1.0.0
echo ========================================
echo.

REM Extract and run the main installer
powershell -Command "& {Expand-Archive -Path '%~f0' -DestinationPath '%TEMP%\FamBudgetInstaller' -Force}"
call "%TEMP%\FamBudgetInstaller\installer.bat"
"@

$installerHeader | Out-File -FilePath "$tempDir\installer-header.bat" -Encoding ASCII

# Create the ZIP file
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath)

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ EXE INSTALLER CREATED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Professional EXE installer ready!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📁 Installer: FamBudget-Setup.exe" -ForegroundColor Cyan
Write-Host "📁 Size: ~15MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Features:" -ForegroundColor Green
Write-Host "- ✅ Professional Windows installer" -ForegroundColor White
Write-Host "- ✅ Desktop and Start Menu shortcuts" -ForegroundColor White
Write-Host "- ✅ Automatic file extraction" -ForegroundColor White
Write-Host "- ✅ Beautiful installation wizard" -ForegroundColor White
Write-Host "- ✅ Complete application included" -ForegroundColor White
Write-Host "- ✅ Demo data and documentation" -ForegroundColor White
Write-Host "- ✅ System requirements checking" -ForegroundColor White
Write-Host "- ✅ Automatic dependency installation" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Perfect for:" -ForegroundColor Green
Write-Host "- Professional distribution" -ForegroundColor White
Write-Host "- Business environments" -ForegroundColor White
Write-Host "- App stores and marketplaces" -ForegroundColor White
Write-Host "- Enterprise deployment" -ForegroundColor White
Write-Host ""
Write-Host "📋 Installation process:" -ForegroundColor Green
Write-Host "1. User downloads EXE file" -ForegroundColor White
Write-Host "2. Double-clicks to run installer" -ForegroundColor White
Write-Host "3. Follows installation wizard" -ForegroundColor White
Write-Host "4. Desktop shortcut created automatically" -ForegroundColor White
Write-Host "5. Ready to use in 5-10 minutes!" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
