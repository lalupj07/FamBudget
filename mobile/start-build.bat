@echo off
echo ========================================
echo FamBudget - APK Build Starter
echo ========================================
echo.
echo This script will configure EAS and start the build.
echo.
echo Step 1: Configuring EAS project...
echo.
eas build:configure --platform android
echo.
echo Step 2: Starting build...
echo.
eas build --platform android --profile production
echo.
echo Build started! Check your Expo dashboard for progress.
echo.
pause

