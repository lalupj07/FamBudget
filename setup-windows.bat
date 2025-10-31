@echo off
REM FamBudget Windows Setup Script
echo ========================================
echo FamBudget Windows Setup
echo ========================================
echo.

REM Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js is installed

REM Check PostgreSQL
echo [2/6] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL not found in PATH
    echo If installed, you may need to add it to PATH
)
echo.

REM Install dependencies
echo [3/6] Installing dependencies...
echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo Installing mobile dependencies...
cd mobile
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install mobile dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [4/6] Setting up backend configuration...
if not exist backend\.env (
    echo Creating backend/.env file...
    (
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_USERNAME=postgres
        echo DB_PASSWORD=postgres
        echo DB_DATABASE=fambudget
        echo.
        echo JWT_SECRET=FamBudget-Super-Secret-Key-Change-This
        echo JWT_EXPIRATION=7d
        echo.
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo ENCRYPTION_KEY=32-Character-Encryption-Key-12345
    ) > backend\.env
    echo Created backend/.env - PLEASE EDIT WITH YOUR POSTGRES PASSWORD!
) else (
    echo backend/.env already exists
)

echo.
echo [5/6] Creating database...
echo Please enter your PostgreSQL password when prompted:
psql -U postgres -c "CREATE DATABASE fambudget;" 2>nul
if %errorlevel% neq 0 (
    echo Database might already exist or PostgreSQL not accessible
    echo You can create it manually: CREATE DATABASE fambudget;
)

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit backend\.env with your PostgreSQL password
echo 2. Open TWO command prompts:
echo.
echo    Terminal 1 - Backend:
echo    cd backend
echo    npm run start:dev
echo.
echo    Terminal 2 - Mobile:
echo    cd mobile
echo    npm start
echo.
echo 3. Optional - Seed demo data:
echo    cd backend
echo    npm run seed
echo.
echo See SETUP_WINDOWS.md for detailed instructions
echo ========================================
echo.
pause

