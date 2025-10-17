#!/bin/bash

# DriversApp Setup Script
# This script helps you set up the development environment

echo "================================================"
echo "  DriversApp Development Environment Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "You can:"
    echo "  1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
else
    echo "✅ MongoDB is installed"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file with your actual configuration!"
    echo "   - Set your MongoDB connection string"
    echo "   - Set a secure JWT_SECRET"
    echo "   - Add your Stripe API keys (for payments)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running"
        echo "Start MongoDB with: sudo systemctl start mongod"
        echo "Or run: mongod"
    fi
    echo ""
fi

echo "================================================"
echo "  Setup Complete!"
echo "================================================"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  http://localhost:5000"
echo ""
echo "To test the API, you can:"
echo "  1. Import postman_collection.json into Postman"
echo "  2. Read API_TESTING.md for cURL examples"
echo "  3. Use the web interface at http://localhost:5000"
echo ""
echo "For more information, see:"
echo "  - README.md - General overview and usage"
echo "  - ARCHITECTURE.md - System architecture details"
echo "  - CONTRIBUTING.md - How to contribute"
echo "  - DEPLOYMENT.md - Production deployment guide"
echo ""
echo "Happy coding! 🚗💨"
