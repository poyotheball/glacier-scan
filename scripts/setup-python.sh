#!/bin/bash

echo "🐍 Setting up Python 3.11 Environment"
echo "====================================="

# Check if Python 3.11 is installed
if ! command -v python3.11 &> /dev/null; then
    echo "❌ Python 3.11 not found. Please install Python 3.11 first."
    echo ""
    echo "Installation options:"
    echo "  - Ubuntu/Debian: sudo apt update && sudo apt install python3.11 python3.11-venv python3.11-dev"
    echo "  - macOS: brew install python@3.11"
    echo "  - Windows: Download from https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python 3.11 found: $(python3.11 --version)"

# Navigate to FastAPI directory
cd backend/fastapi-ai

# Create virtual environment with Python 3.11
echo "📦 Creating virtual environment with Python 3.11..."
python3.11 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Python 3.11 environment setup complete!"
echo ""
echo "To activate the environment:"
echo "  cd backend/fastapi-ai"
echo "  source venv/bin/activate"
echo ""
echo "To start the FastAPI server:"
echo "  python main.py"
echo ""
echo "To deactivate the environment:"
echo "  deactivate"
