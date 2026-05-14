@echo off
REM Startup script for Echoes of the Forgotten Kingdom (Windows)
REM Run this script to start the website

echo.
echo 🏰 Starting Echoes of the Forgotten Kingdom...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH.
    echo Please install Python 3.7 or higher from https://python.org
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ✨ Dependencies installed successfully!
echo.

REM Create uploads directory if it doesn't exist
if not exist "uploads" mkdir uploads

REM Start the Flask server
echo 🚀 Starting Flask server...
echo 📍 Backend will be available at http://localhost:5000
echo 📍 Open index.html in your browser to view the website
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
pause
