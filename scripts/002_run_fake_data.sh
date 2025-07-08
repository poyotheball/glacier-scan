#!/bin/bash

# Script to populate database with fake glacier analysis data
echo "🏔️  Populating Glacier Scan database with fake analysis data..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set your database connection string:"
    echo "export DATABASE_URL='postgresql://username:password@host:port/database'"
    exit 1
fi

# Run the SQL script
echo "📊 Inserting fake glacier data..."
psql "$DATABASE_URL" -f scripts/001_create_fake_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Successfully populated database with fake data!"
    echo ""
    echo "📈 Data created:"
    echo "   • 8 glaciers with location data"
    echo "   • 25 measurements showing decline trends (2020-2024)"
    echo "   • 6 AI analysis results with realistic confidence scores"
    echo "   • 5 alerts ranging from critical to positive"
    echo ""
    echo "🚀 You can now:"
    echo "   • View glaciers on the interactive map"
    echo "   • See analysis results in the dashboard"
    echo "   • Review alerts and recommendations"
    echo "   • Upload new images for analysis"
    echo ""
    echo "🌐 Start the application:"
    echo "   npm run dev"
else
    echo "❌ Failed to populate database"
    echo "Please check your DATABASE_URL and database permissions"
    exit 1
fi
