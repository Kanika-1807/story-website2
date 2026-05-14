#!/bin/bash
# Startup script for Echoes of the Forgotten Kingdom
# Run this script to start the website (macOS/Linux)

echo "🏰 Starting Echoes of the Forgotten Kingdom..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo ""
echo "✨ Dependencies installed successfully!"
echo ""

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start the Flask server
echo "🚀 Starting Flask server..."
echo "📍 Backend will be available at http://localhost:5000"
echo "📍 Open index.html in your browser to view the website"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
