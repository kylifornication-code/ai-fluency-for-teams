#!/bin/bash

# Docker Local Deployment Script
# This script helps you deploy the application locally using Docker

set -e

echo "🐳 AI Fluency for Teams - Docker Local Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Check if backend .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env file not found${NC}"
    echo "Creating backend/.env from env.example..."
    cp backend/env.example backend/.env
    echo -e "${YELLOW}⚠️  Please update backend/.env with your OpenAI API key${NC}"
    echo ""
fi

# Check if OPENAI_API_KEY is set
if grep -q "your_openai_api_key_here" backend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: OPENAI_API_KEY appears to be a placeholder${NC}"
    echo "Please update backend/.env with your actual OpenAI API key"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Starting Docker deployment..."
echo ""

# Navigate to docker directory
cd docker

# Use docker compose (newer) or docker-compose (older)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Build and start services
echo "Building and starting services..."
$COMPOSE_CMD -f docker-compose.prod.yml up --build -d

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📝 Services are running:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5001"
echo "  - Health Check: http://localhost:5001/health"
echo ""
echo "📊 Useful commands:"
echo "  - View logs: cd docker && $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "  - Stop services: cd docker && $COMPOSE_CMD -f docker-compose.prod.yml down"
echo "  - Restart services: cd docker && $COMPOSE_CMD -f docker-compose.prod.yml restart"
echo ""
echo "🔍 Checking service health..."
sleep 3

# Check if services are running
if curl -s http://localhost:5001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed (may still be starting)${NC}"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend check failed (may still be starting)${NC}"
fi

echo ""
echo "🎉 Done! Open http://localhost:3000 in your browser"

