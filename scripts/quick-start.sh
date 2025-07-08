#!/bin/bash

echo "🚀 Glacier Scan - Quick Start Setup"
echo "=================================="

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION found. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Install root dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
echo "🔧 Setting up environment..."
if [ ! -f ".env.local" ]; then
    npm run setup
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local with your database credentials"
    echo "   Minimum required: DATABASE_URL"
    echo ""
    read -p "Press Enter after configuring .env.local..."
fi

# Setup database
echo "🗄️  Setting up database..."
npm run setup-db

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "🎉 Setup complete! Starting the application..."
echo ""
echo "The application will be available at:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  📊 Dashboard: http://localhost:3000/dashboard"
echo "  🗺️  Map: http://localhost:3000/map"
echo ""

# Start the application
npm run dev:frontend
