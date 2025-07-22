#!/bin/bash

echo "🤖 Starting Glacier Scan AI Service (Python 3.11)"
echo "================================================="

# Navigate to AI service directory
cd backend/fastapi-ai

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Running setup..."
    ../../scripts/setup-python.sh
fi

# Activate virtual environment
echo "🔧 Activating Python 3.11 virtual environment..."
source venv/bin/activate

# Verify Python version
echo "🐍 Python version: $(python --version)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure your environment variables."
fi

# Install/update dependencies
echo "📦 Installing/updating dependencies..."
pip install -r requirements.txt

# Start the service
echo "🚀 Starting AI service on http://localhost:8000"
echo ""
echo "Available endpoints:"
echo "  GET  /          - Health check"
echo "  GET  /health    - Detailed health check"
echo "  POST /analyze-glacier - Analyze single glacier image"
echo "  POST /batch-analyze   - Analyze multiple images"
echo "  GET  /models/status   - AI model status"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
