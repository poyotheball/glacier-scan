#!/bin/bash

echo "🏔️  Starting Glacier Scan Platform Locally"
echo "=========================================="

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set. Please configure your environment variables first."
    echo "Run: npm run setup"
    exit 1
fi

echo "✅ Environment variables configured"

# Check if database is set up
echo "🔍 Checking database setup..."
npm run verify-db > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Database not set up. Setting up now..."
    npm run setup-db
fi

echo "✅ Database ready"

# Install dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/nestjs-api/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend/nestjs-api && npm install && cd ..
fi

echo "✅ Dependencies installed"

# Start all services
echo "🚀 Starting all services..."
echo ""
echo "Services will be available at:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo "  AI Service: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev
