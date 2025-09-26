#!/bin/bash

# AI Fluency for Teams - OpenAI Setup Script
# This script helps you set up OpenAI integration

echo "🤖 AI Fluency for Teams - OpenAI Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}Setting up OpenAI integration...${NC}"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo -e "\n${BLUE}Setting up Redis (for caching)...${NC}"
if command -v docker &> /dev/null; then
    echo "Starting Redis with Docker..."
    docker run -d --name ai-fluency-redis -p 6379:6379 redis:7-alpine
    echo -e "${GREEN}✅ Redis started on port 6379${NC}"
else
    echo -e "${YELLOW}Docker not found. Please install Redis manually or use Docker.${NC}"
    echo "You can install Redis with:"
    echo "  macOS: brew install redis"
    echo "  Ubuntu: sudo apt-get install redis-server"
    echo "  Or use Docker: docker run -d --name ai-fluency-redis -p 6379:6379 redis:7-alpine"
fi

echo -e "\n${BLUE}Configuration Instructions:${NC}"
echo "=================================="
echo ""
echo "1. Get your OpenAI API key:"
echo "   - Go to https://platform.openai.com/api-keys"
echo "   - Create a new API key"
echo "   - Copy the key"
echo ""
echo "2. Update your .env file:"
echo "   - Open backend/.env"
echo "   - Replace 'your_openai_api_key_here' with your actual API key"
echo "   - Optionally adjust other settings"
echo ""
echo "3. Start the application:"
echo "   - Run: ./start-app.sh"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Run: ./start-app.sh"
echo "3. Visit: http://localhost:3000"
echo ""
echo "Features you'll get with OpenAI:"
echo "✅ Personalized fluency tables based on role and industry"
echo "✅ AI-generated resource recommendations"
echo "✅ Custom learning paths"
echo "✅ Intelligent caching to reduce API costs"
echo ""
echo "Need help? Check TROUBLESHOOTING.md"
