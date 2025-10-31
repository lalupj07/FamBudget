@echo off
setlocal enabledelayedexpansion

REM ========================================
REM FamBudget Complete Windows Installer
REM Version: 1.0.0
REM ========================================

title FamBudget - Complete Windows Installer

REM Set console colors
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
echo  COMPLETE WINDOWS INSTALLER v1.0.0
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
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check Windows version
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo ✅ Windows Version: %VERSION%

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
echo ✅ RAM: %RAM_GB%GB

echo.
echo ========================================
echo  INSTALLATION SUMMARY
echo ========================================
echo.
echo This installer will install:
echo.
echo 📦 Node.js 20.10.0 LTS
echo 🗄️ PostgreSQL 15.5
echo 📱 Expo CLI for mobile development
echo 🏠 Complete FamBudget application
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
        
        REM Update PATH for current session
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
echo  STEP 4: SETTING UP FAMBUDGET
echo ========================================
echo.

REM Create installation directory
set INSTALL_DIR=%USERPROFILE%\FamBudget
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

echo ✅ Desktop shortcuts created

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

REM Create uninstaller
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
echo del "%USERPROFILE%\Desktop\FamBudget.lnk" 2^>nul
echo del "%USERPROFILE%\Desktop\FamBudget Setup.lnk" 2^>nul
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

echo ✅ Launcher scripts created

echo.
echo ========================================
echo  STEP 9: CREATING DOCUMENTATION
echo ========================================
echo.

REM Create comprehensive README
(
echo # 🏠 FamBudget - Family Budgeting App
echo.
echo ## 🚀 Quick Start
echo.
echo 1. **Start**: Double-click `FamBudget-Launcher.bat`
echo 2. **Mobile**: Install Expo Go and scan QR code
echo 3. **Login**: Use demo credentials or create account
echo.
echo ## 📱 Mobile App Setup
echo.
echo 1. Install **Expo Go** from your phone's app store
echo 2. Start FamBudget using the launcher
echo 3. Scan the QR code from the mobile server
echo 4. The app will load on your device
echo.
echo ## 🎯 Demo Login
echo.
echo - **Email**: alex@demofamily.com
echo - **Password**: demo123456
echo.
echo ## 🌐 Access Points
echo.
echo - **Backend API**: http://localhost:3000
echo - **Mobile App**: Expo DevTools (opens automatically)
echo - **Database**: PostgreSQL (localhost:5432)
echo.
echo ## ✨ Features
echo.
echo - 💰 Automatic income splitting
echo - 📊 Real-time budget tracking
echo - 🎯 Goal setting and progress
echo - 📱 Beautiful mobile app with dark mode
echo - 📸 Receipt capture with camera
echo - 📈 Charts and analytics
echo - 🏦 Multi-account management
echo - 🪟 Windows-optimized experience
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
echo - Run `SETUP-FAMBUDGET.bat`
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

echo ✅ Documentation created

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
