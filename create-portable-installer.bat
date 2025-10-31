@echo off
echo ========================================
echo FamBudget Portable Installer Creator
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges...
) else (
    echo This script requires administrator privileges.
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

echo Creating portable installer directory...
if exist "FamBudget-Portable" rmdir /s /q "FamBudget-Portable"
mkdir "FamBudget-Portable"
cd "FamBudget-Portable"

echo.
echo ========================================
echo Step 1: Installing Node.js
echo ========================================

REM Download and install Node.js LTS
echo Downloading Node.js LTS...
powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'}"
if exist "nodejs-installer.msi" (
    echo Installing Node.js...
    msiexec /i nodejs-installer.msi /quiet /norestart
    echo Node.js installation completed.
    del nodejs-installer.msi
) else (
    echo Failed to download Node.js installer.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Installing PostgreSQL
echo ========================================

REM Download and install PostgreSQL
echo Downloading PostgreSQL...
powershell -Command "& {Invoke-WebRequest -Uri 'https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64.exe' -OutFile 'postgresql-installer.exe'}"
if exist "postgresql-installer.exe" (
    echo Installing PostgreSQL...
    echo Please note: PostgreSQL installation will require manual setup.
    echo Default password will be set to: fambudget123
    postgresql-installer.exe --mode unattended --superpassword fambudget123 --servicename postgresql --serviceaccount postgres --servicepassword fambudget123
    echo PostgreSQL installation completed.
    del postgresql-installer.exe
) else (
    echo Failed to download PostgreSQL installer.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 3: Installing Expo CLI
echo ========================================

echo Installing Expo CLI globally...
npm install -g @expo/cli
echo Expo CLI installation completed.

echo.
echo ========================================
echo Step 4: Copying FamBudget Application
echo ========================================

echo Copying application files...
xcopy "..\backend" "backend\" /E /I /H /Y
xcopy "..\mobile" "mobile\" /E /I /H /Y
copy "..\README.md" "README.md"
copy "..\LICENSE" "LICENSE"
copy "..\package.json" "package.json"

echo.
echo ========================================
echo Step 5: Creating Setup Scripts
echo ========================================

REM Create the main setup script
echo Creating setup script...
(
echo @echo off
echo echo ========================================
echo echo FamBudget - Family Budgeting App
echo echo ========================================
echo echo.
echo echo Setting up your family budgeting application...
echo echo.
echo.
echo REM Check if Node.js is installed
echo node --version ^>nul 2^>^&1
echo if %%errorLevel%% neq 0 ^(
echo     echo Node.js is not installed. Please install Node.js first.
echo     echo Download from: https://nodejs.org/
echo     pause
echo     exit /b 1
echo ^)
echo.
echo REM Check if PostgreSQL is running
echo sc query postgresql ^| find "RUNNING" ^>nul
echo if %%errorLevel%% neq 0 ^(
echo     echo Starting PostgreSQL service...
echo     net start postgresql
echo     if %%errorLevel%% neq 0 ^(
echo         echo Failed to start PostgreSQL. Please check your installation.
echo         pause
echo         exit /b 1
echo     ^)
echo ^)
echo.
echo echo Installing backend dependencies...
echo cd backend
echo call npm install
echo if %%errorLevel%% neq 0 ^(
echo     echo Failed to install backend dependencies.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo Installing mobile dependencies...
echo cd ..\mobile
echo call npm install
echo if %%errorLevel%% neq 0 ^(
echo     echo Failed to install mobile dependencies.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo Setting up database...
echo cd ..\backend
echo call npm run seed
echo.
echo echo ========================================
echo echo Setup completed successfully!
echo echo ========================================
echo echo.
echo echo Your FamBudget app is ready to use!
echo echo.
echo echo To start the application:
echo echo 1. Double-click "START-FAMBUDGET.bat"
echo echo 2. Or run "start-backend.bat" and "start-mobile.bat" separately
echo echo.
echo echo Default login credentials:
echo echo Email: alex@demofamily.com
echo echo Password: demo123456
echo echo.
echo pause
) > "SETUP-FAMBUDGET.bat"

REM Create the start script
echo Creating start script...
(
echo @echo off
echo echo ========================================
echo echo Starting FamBudget Application
echo echo ========================================
echo echo.
echo echo Starting backend server...
echo start "FamBudget Backend" cmd /k "cd backend ^&^& npm run start:dev"
echo.
echo echo Waiting for backend to start...
echo timeout /t 5 /nobreak ^>nul
echo.
echo echo Starting mobile development server...
echo start "FamBudget Mobile" cmd /k "cd mobile ^&^& npm start"
echo.
echo echo ========================================
echo echo FamBudget is starting up!
echo echo ========================================
echo echo.
echo echo Backend: http://localhost:3000
echo echo Mobile: Expo DevTools will open in your browser
echo echo.
echo echo To stop the application, close both command windows.
echo echo.
echo pause
) > "START-FAMBUDGET.bat"

REM Create individual start scripts
echo Creating individual start scripts...

REM Backend start script
(
echo @echo off
echo echo Starting FamBudget Backend...
echo cd backend
echo npm run start:dev
echo pause
) > "start-backend.bat"

REM Mobile start script
(
echo @echo off
echo echo Starting FamBudget Mobile...
echo cd mobile
echo npm start
echo pause
) > "start-mobile.bat"

REM Create uninstall script
echo Creating uninstall script...
(
echo @echo off
echo echo ========================================
echo echo FamBudget Uninstaller
echo echo ========================================
echo echo.
echo echo This will remove FamBudget from your system.
echo echo.
echo set /p confirm="Are you sure you want to uninstall FamBudget? (y/N): "
echo if /i "%%confirm%%" neq "y" ^(
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
echo rmdir /s /q "FamBudget-Portable"
echo.
echo echo ========================================
echo echo FamBudget has been uninstalled.
echo echo ========================================
echo echo.
echo echo Note: Node.js and npm packages are still installed.
echo echo To remove them completely, uninstall Node.js from Control Panel.
echo echo.
echo pause
) > "UNINSTALL-FAMBUDGET.bat"

echo.
echo ========================================
echo Step 6: Creating Documentation
echo ========================================

REM Create comprehensive README
echo Creating documentation...
(
echo # FamBudget - Portable Windows Installer
echo.
echo ## 🚀 Quick Start
echo.
echo 1. **Run Setup**: Double-click `SETUP-FAMBUDGET.bat`
echo 2. **Start App**: Double-click `START-FAMBUDGET.bat`
echo 3. **Login**: Use demo credentials or create new account
echo.
echo ## 📋 System Requirements
echo.
echo - Windows 10/11 (64-bit)
echo - 4GB RAM minimum (8GB recommended)
echo - 2GB free disk space
echo - Internet connection for initial setup
echo.
echo ## 🔧 What This Installer Does
echo.
echo ### Automatic Installation:
echo - ✅ Node.js 20.10.0 LTS
echo - ✅ PostgreSQL 15.5
echo - ✅ Expo CLI for mobile development
echo - ✅ All npm dependencies
echo - ✅ Database setup with demo data
echo.
echo ### Files Created:
echo - `SETUP-FAMBUDGET.bat` - One-time setup script
echo - `START-FAMBUDGET.bat` - Start both backend and mobile
echo - `start-backend.bat` - Start backend only
echo - `start-mobile.bat` - Start mobile only
echo - `UNINSTALL-FAMBUDGET.bat` - Complete removal
echo.
echo ## 🎯 Default Login
echo.
echo **Demo Account:**
echo - Email: `alex@demofamily.com`
echo - Password: `demo123456`
echo.
echo ## 🌐 Access Points
echo.
echo - **Backend API**: http://localhost:3000
echo - **Mobile App**: Expo DevTools (opens automatically)
echo - **Database**: PostgreSQL on localhost:5432
echo.
echo ## 📱 Mobile App Setup
echo.
echo 1. Install **Expo Go** app on your phone
echo 2. Scan the QR code from the mobile development server
echo 3. The app will load on your device
echo.
echo ## 🛠️ Troubleshooting
echo.
echo ### Backend won't start:
echo - Check if PostgreSQL is running: `net start postgresql`
echo - Verify port 3000 is not in use
echo - Check backend logs in the command window
echo.
echo ### Mobile won't start:
echo - Ensure Node.js is installed: `node --version`
echo - Check if Expo CLI is installed: `expo --version`
echo - Try clearing npm cache: `npm cache clean --force`
echo.
echo ### Database issues:
echo - Restart PostgreSQL: `net stop postgresql` then `net start postgresql`
echo - Reset database: Run `npm run seed` in backend folder
echo.
echo ## 🔒 Security Notes
echo.
echo - Default PostgreSQL password: `fambudget123`
echo - Change this password in production
echo - Database is only accessible locally
echo.
echo ## 📞 Support
echo.
echo - Check the main README.md for detailed documentation
echo - Review setup logs if installation fails
echo - Ensure Windows Firewall allows Node.js and PostgreSQL
echo.
echo ## 🎉 Features Included
echo.
echo - ✅ Complete family budgeting system
echo - ✅ Dark/Light mode support
echo - ✅ Receipt capture with camera
echo - ✅ Real-time budget tracking
echo - ✅ Goal setting and progress
echo - ✅ Beautiful charts and reports
echo - ✅ Multi-account management
echo - ✅ Windows-optimized experience
echo.
echo ---
echo.
echo **Made with ❤️ for families managing money together**
echo.
echo *FamBudget v1.0.0 - Portable Windows Edition*
) > "README-PORTABLE.md"

echo.
echo ========================================
echo Step 7: Creating Desktop Shortcuts
echo ========================================

REM Create desktop shortcuts
echo Creating desktop shortcuts...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget Setup.lnk'); $Shortcut.TargetPath = (Get-Location).Path + '\SETUP-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = (Get-Location).Path; $Shortcut.Description = 'Setup FamBudget Family Budgeting App'; $Shortcut.Save()}"

powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\FamBudget Start.lnk'); $Shortcut.TargetPath = (Get-Location).Path + '\START-FAMBUDGET.bat'; $Shortcut.WorkingDirectory = (Get-Location).Path; $Shortcut.Description = 'Start FamBudget Application'; $Shortcut.Save()}"

echo.
echo ========================================
echo Step 8: Creating ZIP Archive
echo ========================================

echo Creating portable ZIP archive...
cd ..
powershell -Command "& {Compress-Archive -Path 'FamBudget-Portable' -DestinationPath 'FamBudget-Portable-Windows.zip' -Force}"

echo.
echo ========================================
echo ✅ PORTABLE INSTALLER CREATED!
echo ========================================
echo.
echo 📁 Location: FamBudget-Portable-Windows.zip
echo 📁 Unpacked: FamBudget-Portable\
echo.
echo 🚀 To distribute:
echo 1. Share the ZIP file with users
echo 2. Users extract and run SETUP-FAMBUDGET.bat
echo 3. After setup, run START-FAMBUDGET.bat
echo.
echo 🎯 Features included:
echo - One-click setup and start
echo - All dependencies included
echo - Desktop shortcuts created
echo - Comprehensive documentation
echo - Demo data pre-loaded
echo - Windows-optimized experience
echo.
echo 📱 Mobile app works with Expo Go
echo 🌐 Backend runs on localhost:3000
echo 💾 Database: PostgreSQL with demo data
echo.
pause
