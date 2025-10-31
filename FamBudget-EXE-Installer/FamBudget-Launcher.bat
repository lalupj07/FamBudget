@echo off
title FamBudget - Family Budgeting App
echo ========================================
echo Starting FamBudget Application
echo ========================================
echo.
echo 🚀 Starting backend server...
start "FamBudget Backend" cmd /k "cd backend ^&^& npm run start:dev"

echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

echo 📱 Starting mobile development server...
start "FamBudget Mobile" cmd /k "cd mobile ^&^& npm start"

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
