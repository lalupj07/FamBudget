@echo off
echo Starting FamBudget Backend and Mobile...
echo.
start "FamBudget Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start "FamBudget Mobile" cmd /k "cd mobile && npm start"
echo.
echo Both services are starting in separate windows...
echo Close those windows to stop the services.

