@echo off
title FamBudget Database Setup
echo ========================================
echo FamBudget Database Setup
echo ========================================
echo.
echo This will set up your database with demo data...
echo.
pause

echo Starting PostgreSQL...
net start postgresql

echo Setting up database...
cd backend
call npm install
call npm run seed

echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo Your FamBudget database is ready!
echo Run "FamBudget-Launcher.bat" to start the app.
echo.
pause
