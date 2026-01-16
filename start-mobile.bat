@echo off
title FamBudget Mobile
cd mobile
echo Starting FamBudget Mobile App...
echo.
echo IMPORTANT: Make sure you're running from the mobile directory!
echo Current directory: %CD%
echo.
echo Starting Expo with cache cleared...
npx expo start --clear
pause

