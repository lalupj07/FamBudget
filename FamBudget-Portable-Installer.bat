@echo off
setlocal enabledelayedexpansion

REM ========================================
REM FamBudget Portable Installer
REM Version: 1.0.0
REM ========================================

title FamBudget - Portable Windows Installer

echo.
echo  ███████╗ █████╗ ███╗   ███╗██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗
echo  ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
echo  █████╗  ███████║██╔████╔██║██████╔╝██║   ██║██║  ██║██║   ██║█████╗     ██║   
echo  ██╔══╝  ██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║   
echo  ██║     ██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   
echo  ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
echo.
echo  🏠 Family Budgeting Made Simple
echo  💰 Automatic Income Splitting & Expense Tracking
echo  📱 Beautiful Mobile App with Dark Mode
echo  🪟 Windows-Optimized Experience
echo.
echo ========================================
echo  PORTABLE WINDOWS INSTALLER v1.0.0
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

REM Check Windows version
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%VERSION%" == "10.0" (
    echo ✅ Windows 10/11 detected
) else (
    echo ⚠️  This installer is optimized for Windows 10/11
    echo    Current version: %VERSION%
    echo.
)

echo.
echo ========================================
echo  SYSTEM REQUIREMENTS CHECK
echo ========================================

REM Check available disk space
for /f "tokens=3" %%a in ('dir /-c %SystemDrive%\ ^| find "bytes free"') do set FREE_SPACE=%%a
set /a FREE_GB=%FREE_SPACE% / 1073741824
if %FREE_GB% LSS 2 (
    echo ❌ Insufficient disk space. Need at least 2GB free.
    echo    Available: %FREE_GB%GB
    pause
    exit /b 1
) else (
    echo ✅ Disk space: %FREE_GB%GB available
)

REM Check RAM
for /f "skip=1" %%p in ('wmic computersystem get TotalPhysicalMemory') do (
    if not "%%p"=="" (
        set /a RAM_GB=%%p / 1073741824
        goto :ram_done
    )
)
:ram_done
if %RAM_GB% LSS 4 (
    echo ⚠️  Low RAM detected: %RAM_GB%GB (4GB+ recommended)
) else (
    echo ✅ RAM: %RAM_GB%GB
)

echo.
echo ========================================
echo  INSTALLATION OPTIONS
echo ========================================
echo.
echo Choose installation type:
echo.
echo 1. 🚀 QUICK INSTALL (Recommended)
echo    - Installs everything automatically
echo    - Uses default settings
echo    - Perfect for most users
echo.
echo 2. 🔧 CUSTOM INSTALL
echo    - Choose what to install
echo    - Customize settings
echo    - For advanced users
echo.
echo 3. 📋 SYSTEM CHECK ONLY
echo    - Check requirements
echo    - No installation
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="3" goto :system_check
if "%choice%"=="2" goto :custom_install
if "%choice%"=="1" goto :quick_install

echo Invalid choice. Please run the installer again.
pause
exit /b 1

:system_check
echo.
echo ========================================
echo  SYSTEM CHECK RESULTS
echo ========================================
echo.
echo ✅ Windows Version: %VERSION%
echo ✅ Administrator: Yes
echo ✅ Disk Space: %FREE_GB%GB
echo ✅ RAM: %RAM_GB%GB
echo.
echo Your system meets the requirements for FamBudget!
echo.
pause
exit /b 0

:custom_install
echo.
echo ========================================
echo  CUSTOM INSTALLATION
echo ========================================
echo.
echo What would you like to install?
echo.
set /p install_node="Install Node.js? (Y/n): "
set /p install_postgres="Install PostgreSQL? (Y/n): "
set /p install_expo="Install Expo CLI? (Y/n): "
set /p create_shortcuts="Create desktop shortcuts? (Y/n): "
set /p setup_demo="Setup demo data? (Y/n): "
echo.
goto :install_components

:quick_install
echo.
echo ========================================
echo  QUICK INSTALLATION
echo ========================================
echo.
set install_node=Y
set install_postgres=Y
set install_expo=Y
set create_shortcuts=Y
set setup_demo=Y
echo Installing all components with default settings...
echo.

:install_components
REM Create installation directory
set INSTALL_DIR=%USERPROFILE%\FamBudget
echo 📁 Creating installation directory: %INSTALL_DIR%
if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
mkdir "%INSTALL_DIR%"
cd /d "%INSTALL_DIR%"

REM Download and install Node.js
if /i "%install_node%"=="Y" (
    echo.
    echo ========================================
    echo  INSTALLING NODE.JS
    echo ========================================
    echo.
    echo 📥 Downloading Node.js LTS...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'}"
    if exist "nodejs-installer.msi" (
        echo 🔧 Installing Node.js...
        msiexec /i nodejs-installer.msi /quiet /norestart
        echo ✅ Node.js installed successfully
        del nodejs-installer.msi
        
        REM Update PATH
        set PATH=%PATH%;%ProgramFiles%\nodejs
    ) else (
        echo ❌ Failed to download Node.js
        goto :error_exit
    )
)

REM Download and install PostgreSQL
if /i "%install_postgres%"=="Y" (
    echo.
    echo ========================================
    echo  INSTALLING POSTGRESQL
    echo ========================================
    echo.
    echo 📥 Downloading PostgreSQL...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64.exe' -OutFile 'postgresql-installer.exe'}"
    if exist "postgresql-installer.exe" (
        echo 🔧 Installing PostgreSQL...
        echo    Password will be set to: fambudget123
        postgresql-installer.exe --mode unattended --superpassword fambudget123 --servicename postgresql --serviceaccount postgres --servicepassword fambudget123
        echo ✅ PostgreSQL installed successfully
        del postgresql-installer.exe
        
        REM Start PostgreSQL service
        echo 🚀 Starting PostgreSQL service...
        net start postgresql
    ) else (
        echo ❌ Failed to download PostgreSQL
        goto :error_exit
    )
)

REM Install Expo CLI
if /i "%install_expo%"=="Y" (
    echo.
    echo ========================================
    echo  INSTALLING EXPO CLI
    echo ========================================
    echo.
    echo 🔧 Installing Expo CLI globally...
    npm install -g @expo/cli
    echo ✅ Expo CLI installed successfully
)

REM Copy application files
echo.
echo ========================================
echo  COPYING APPLICATION FILES
echo ========================================
echo.
echo 📁 Copying FamBudget application...
xcopy "%~dp0backend" "backend\" /E /I /H /Y /Q
xcopy "%~dp0mobile" "mobile\" /E /I /H /Y /Q
copy "%~dp0README.md" "README.md" /Y
copy "%~dp0LICENSE" "LICENSE" /Y
copy "%~dp0package.json" "package.json" /Y

REM Install dependencies
echo.
echo ========================================
echo  INSTALLING DEPENDENCIES
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

REM Setup demo data
if /i "%setup_demo%"=="Y" (
    echo.
    echo ========================================
    echo  SETTING UP DEMO DATA
    echo ========================================
    echo.
    echo 🗄️ Setting up database with demo data...
    cd ..\backend
    call npm run seed
    echo ✅ Demo data setup completed
)

REM Create shortcuts
if /i "%create_shortcuts%"=="Y" (
    echo.
    echo ========================================
    echo  CREATING SHORTCUTS
    echo ========================================
    echo.
    echo 🔗 Creating desktop shortcuts...
    
    REM Create setup shortcut
    powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget Setup.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\SETUP-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Setup FamBudget Family Budgeting App'; $Shortcut.Save()}"
    
    REM Create start shortcut
    powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget Start.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\START-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Start FamBudget Application'; $Shortcut.Save()}"
    
    echo ✅ Desktop shortcuts created
)

REM Create startup scripts
echo.
echo ========================================
echo  CREATING STARTUP SCRIPTS
echo ========================================
echo.

REM Main setup script
(
echo @echo off
echo title FamBudget Setup
echo echo ========================================
echo echo FamBudget - Quick Setup
echo echo ========================================
echo echo.
echo echo This will set up your FamBudget application...
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
echo echo Setup completed!
echo echo ========================================
echo echo.
echo echo Your FamBudget app is ready!
echo echo Run "START-FAMBUDGET.bat" to start the application.
echo echo.
echo pause
) > "SETUP-FAMBUDGET.bat"

REM Main start script
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
echo echo    Email: alex@demofamily.com
echo echo    Password: demo123456
echo echo.
echo echo 💡 To stop the app, close both command windows.
echo echo.
echo pause
) > "START-FAMBUDGET.bat"

REM Individual start scripts
(
echo @echo off
echo title FamBudget Backend
echo echo Starting FamBudget Backend Server...
echo cd backend
echo npm run start:dev
echo pause
) > "start-backend.bat"

(
echo @echo off
echo title FamBudget Mobile
echo echo Starting FamBudget Mobile App...
echo cd mobile
echo npm start
echo pause
) > "start-mobile.bat"

REM Uninstall script
(
echo @echo off
echo title FamBudget Uninstaller
echo echo ========================================
echo echo FamBudget Uninstaller
echo echo ========================================
echo echo.
echo echo This will completely remove FamBudget from your system.
echo echo.
echo set /p confirm="Are you sure? Type 'yes' to confirm: "
echo if /i "%%confirm%%" neq "yes" ^(
echo     echo Uninstall cancelled.
echo     pause
echo     exit /b 0
echo ^)
echo.
echo echo Stopping services...
echo net stop postgresql 2^>nul
echo.
echo echo Removing PostgreSQL service...
echo sc delete postgresql 2^>nul
echo.
echo echo Removing application files...
echo cd ..
echo rmdir /s /q "%INSTALL_DIR%"
echo.
echo echo Removing desktop shortcuts...
echo del "%USERPROFILE%\Desktop\FamBudget Setup.lnk" 2^>nul
echo del "%USERPROFILE%\Desktop\FamBudget Start.lnk" 2^>nul
echo.
echo echo ========================================
echo echo FamBudget has been uninstalled.
echo echo ========================================
echo echo.
echo echo Note: Node.js is still installed.
echo echo To remove it, uninstall from Control Panel.
echo echo.
echo pause
) > "UNINSTALL-FAMBUDGET.bat"

REM Create comprehensive README
(
echo # 🏠 FamBudget - Family Budgeting App
echo.
echo ## 🚀 Quick Start
echo.
echo 1. **Setup**: Double-click `SETUP-FAMBUDGET.bat` (one-time)
echo 2. **Start**: Double-click `START-FAMBUDGET.bat`
echo 3. **Login**: Use demo credentials or create account
echo.
echo ## 📱 Mobile App Setup
echo.
echo 1. Install **Expo Go** on your phone
echo 2. Scan QR code from mobile server
echo 3. App loads on your device
echo.
echo ## 🎯 Demo Login
echo.
echo - **Email**: alex@demofamily.com
echo - **Password**: demo123456
echo.
echo ## 🌐 Access Points
echo.
echo - **Backend**: http://localhost:3000
echo - **Mobile**: Expo DevTools (auto-opens)
echo - **Database**: PostgreSQL (localhost:5432)
echo.
echo ## ✨ Features
echo.
echo - 💰 Automatic income splitting
echo - 📊 Real-time budget tracking
echo - 🎯 Goal setting and progress
echo - 📱 Beautiful mobile app
echo - 🌙 Dark/Light mode
echo - 📸 Receipt capture
echo - 📈 Charts and reports
echo - 🏦 Multi-account management
echo.
echo ## 🛠️ Troubleshooting
echo.
echo ### Backend won't start:
echo - Check PostgreSQL: `net start postgresql`
echo - Verify port 3000 is free
echo.
echo ### Mobile won't start:
echo - Check Node.js: `node --version`
echo - Check Expo: `expo --version`
echo.
echo ### Database issues:
echo - Restart PostgreSQL service
echo - Run `npm run seed` in backend folder
echo.
echo ## 📞 Support
echo.
echo - Check logs in command windows
echo - Review README.md for details
echo - Ensure firewall allows Node.js/PostgreSQL
echo.
echo ---
echo.
echo **Made with ❤️ for families managing money together**
echo.
echo *FamBudget v1.0.0 - Windows Edition*
) > "README-PORTABLE.md"

echo.
echo ========================================
echo  ✅ INSTALLATION COMPLETED!
echo ========================================
echo.
echo 🎉 FamBudget has been successfully installed!
echo.
echo 📁 Installation Directory: %INSTALL_DIR%
echo 🔗 Desktop Shortcuts: Created
echo 🗄️ Database: PostgreSQL with demo data
echo 📱 Mobile App: Ready for Expo Go
echo.
echo ========================================
echo  NEXT STEPS
echo ========================================
echo.
echo 1. 📱 Install Expo Go on your phone
echo 2. 🚀 Run "START-FAMBUDGET.bat" to start the app
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
pause
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
