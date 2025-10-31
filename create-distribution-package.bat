@echo off
echo ========================================
echo FamBudget Distribution Package Creator
echo ========================================
echo.

REM Create distribution directory
set DIST_DIR=FamBudget-Distribution
if exist "%DIST_DIR%" rmdir /s /q "%DIST_DIR%"
mkdir "%DIST_DIR%"

echo Creating distribution package...

REM Copy installer files
copy "FamBudget-Portable-Installer.bat" "%DIST_DIR%\"
copy "FamBudget-Launcher.bat" "%DIST_DIR%\"

REM Copy application files
xcopy "backend" "%DIST_DIR%\backend\" /E /I /H /Y /Q
xcopy "mobile" "%DIST_DIR%\mobile\" /E /I /H /Y /Q
copy "README.md" "%DIST_DIR%\"
copy "LICENSE" "%DIST_DIR%\"
copy "package.json" "%DIST_DIR%\"

REM Create distribution README
(
echo # 🏠 FamBudget - Family Budgeting App
echo.
echo ## 📦 Distribution Package
echo.
echo This package contains everything needed to install and run FamBudget on Windows.
echo.
echo ## 🚀 Installation
echo.
echo 1. **Run as Administrator**: Right-click `FamBudget-Portable-Installer.bat` and select "Run as administrator"
echo 2. **Follow the wizard**: Choose Quick Install for easiest setup
echo 3. **Wait for completion**: Installation takes 5-10 minutes
echo 4. **Start the app**: Use desktop shortcuts or run `FamBudget-Launcher.bat`
echo.
echo ## 📋 System Requirements
echo.
echo - Windows 10/11 (64-bit)
echo - 4GB RAM (8GB recommended)
echo - 2GB free disk space
echo - Internet connection for initial setup
echo - Administrator privileges
echo.
echo ## 🎯 What Gets Installed
echo.
echo - ✅ Node.js 20.10.0 LTS
echo - ✅ PostgreSQL 15.5
echo - ✅ Expo CLI
echo - ✅ All application dependencies
echo - ✅ Demo database with sample data
echo - ✅ Desktop shortcuts
echo - ✅ Startup scripts
echo.
echo ## 📱 Mobile App Setup
echo.
echo 1. Install **Expo Go** from your phone's app store
echo 2. Start FamBudget using the launcher
echo 3. Scan the QR code from the mobile server
echo 4. The app will load on your device
echo.
echo ## 🔐 Demo Account
echo.
echo - **Email**: alex@demofamily.com
echo - **Password**: demo123456
echo.
echo ## 🌐 Access Points
echo.
echo - **Backend API**: http://localhost:3000
echo - **Mobile App**: Expo DevTools (opens automatically)
echo - **Database**: PostgreSQL on localhost:5432
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
echo ### Installation fails:
echo - Ensure you're running as administrator
echo - Check internet connection
echo - Disable antivirus temporarily
echo - Ensure sufficient disk space
echo.
echo ### App won't start:
echo - Check if PostgreSQL is running: `net start postgresql`
echo - Verify Node.js is installed: `node --version`
echo - Check port 3000 is not in use
echo.
echo ### Mobile app issues:
echo - Install Expo Go on your phone
echo - Ensure phone and computer are on same network
echo - Check Expo CLI is installed: `expo --version`
echo.
echo ## 📞 Support
echo.
echo - Check the main README.md for detailed documentation
echo - Review installation logs if setup fails
echo - Ensure Windows Firewall allows Node.js and PostgreSQL
echo.
echo ## 🎉 Success!
echo.
echo Once installed, you'll have a complete family budgeting system that helps you:
echo.
echo - Split income automatically across budget categories
echo - Track expenses with beautiful visualizations
echo - Set and achieve savings goals together
echo - Capture receipts with your phone's camera
echo - View detailed reports and analytics
echo - Manage multiple accounts and family members
echo.
echo ---
echo.
echo **Made with ❤️ for families managing money together**
echo.
echo *FamBudget v1.0.0 - Windows Distribution Package*
) > "%DIST_DIR%\README-DISTRIBUTION.md"

REM Create a simple setup guide
(
echo # Quick Setup Guide
echo.
echo ## 1. Install
echo - Right-click "FamBudget-Portable-Installer.bat"
echo - Select "Run as administrator"
echo - Choose "Quick Install"
echo - Wait for completion
echo.
echo ## 2. Start
echo - Double-click "FamBudget-Launcher.bat"
echo - Or use desktop shortcuts
echo.
echo ## 3. Mobile
echo - Install Expo Go on your phone
echo - Scan QR code from mobile server
echo.
echo ## 4. Login
echo - Email: alex@demofamily.com
echo - Password: demo123456
echo.
echo That's it! Your family budgeting app is ready! 🎉
) > "%DIST_DIR%\QUICK-SETUP.txt"

echo.
echo ========================================
echo  CREATING ZIP ARCHIVE
echo ========================================

powershell -Command "& {Compress-Archive -Path '%DIST_DIR%' -DestinationPath 'FamBudget-Windows-Distribution.zip' -Force}"

echo.
echo ========================================
echo  ✅ DISTRIBUTION PACKAGE CREATED!
echo ========================================
echo.
echo 📁 Package: FamBudget-Windows-Distribution.zip
echo 📁 Size: ~50MB (compressed)
echo.
echo 🚀 Ready for distribution:
echo - Share the ZIP file with users
echo - Users extract and run installer
echo - Complete setup in 5-10 minutes
echo.
echo 📋 Package includes:
echo - ✅ One-click installer
echo - ✅ Quick launcher
echo - ✅ Complete application
echo - ✅ Setup documentation
echo - ✅ Demo data
echo - ✅ Windows optimizations
echo.
echo 🎯 Perfect for:
echo - Family members
echo - Beta testers
echo - Demo purposes
echo - Local distribution
echo.
pause
