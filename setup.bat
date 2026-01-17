@echo off
REM Setup and run flashcard app locally on Windows

echo.
echo 🚀 Flashcard App - Local Setup (Windows)
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo 📝 Creating backend\.env from template...
    copy backend\.env.example backend\.env
    echo ⚠️  Please edit backend\.env and add your GROQ_API_KEY
    echo.
)

REM Install dependencies
echo 📦 Installing root dependencies...
call npm install

echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the app:
echo   npm start
echo.
echo Then open http://localhost:5000 in your browser
echo.
echo To start with auto-reload:
echo   npm run dev
echo.
pause
