#!/bin/bash

# Setup Environment Variables Script
echo "Setting up Glacier Scan environment variables..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "⚠️  .env.local already exists"
fi

# Check if frontend/.env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local from template..."
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
else
    echo "⚠️  frontend/.env.local already exists"
fi

# Check if backend/.env exists
if [ ! -f "backend/nestjs-api/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/nestjs-api/.env.example backend/nestjs-api/.env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

# Check if fastapi/.env exists
if [ ! -f "backend/fastapi-ai/.env" ]; then
    echo "Creating fastapi/.env from template..."
    cp backend/fastapi-ai/.env.example backend/fastapi-ai/.env
    echo "✅ Created fastapi/.env"
else
    echo "⚠️  fastapi/.env already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Edit .env.local with your actual database credentials"
echo "2. Add your OpenAI API key"
echo "3. Configure Supabase or Vercel Blob storage"
echo "4. Run 'npm run dev' to start development"
echo ""
echo "📝 Required environment variables:"
echo "   - DATABASE_URL (your Neon database URL)"
echo "   - OPENAI_API_KEY (for AI analysis)"
echo "   - BLOB_READ_WRITE_TOKEN (for image uploads)"
echo ""
