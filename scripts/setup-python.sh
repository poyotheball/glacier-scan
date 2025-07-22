#!/bin/bash

echo "🐍 Setting up Python 3.11 for Glacier Scan AI Service"
echo "===================================================="

# Check if Python 3.11 is installed
if command -v python3.11 &> /dev/null; then
    echo "✅ Python 3.11 found: $(python3.11 --version)"
else
    echo "❌ Python 3.11 not found. Please install Python 3.11 first."
    echo ""
    echo "Installation instructions:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install python3.11 python3.11-venv python3.11-dev"
    echo "  macOS: brew install python@3.11"
    echo "  Windows: Download from https://www.python.org/downloads/"
    exit 1
fi

# Navigate to AI service directory
cd backend/fastapi-ai

# Create virtual environment with Python 3.11
echo "🔧 Creating virtual environment with Python 3.11..."
python3.11 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Verify installation
echo "✅ Verifying installation..."
python --version
pip list | grep -E "(fastapi|uvicorn|tensorflow|opencv-python)"

echo ""
echo "🎉 Python 3.11 setup complete!"
echo ""
echo "To activate the virtual environment:"
echo "  cd backend/fastapi-ai"
echo "  source venv/bin/activate"
echo ""
echo "To start the AI service:"
echo "  python main.py"
echo "  or"
echo "  uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
