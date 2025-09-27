#!/bin/bash

# AI Fluency for Teams - Docker Deployment Test Script
# This script tests the Docker deployment to ensure everything works correctly

set -e

echo "🐳 Testing AI Fluency for Teams Docker Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "URL: $url"
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - Status: $response"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $response"
        return 1
    fi
}

# Function to test API response
test_api_response() {
    local url=$1
    local description=$2
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "URL: $url"
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "error\|Error\|ERROR"; then
        echo -e "${RED}❌ FAIL${NC} - Response contains error: $response"
        return 1
    else
        echo -e "${GREEN}✅ PASS${NC} - Valid response received"
        return 0
    fi
}

# Function to test AI fluency generation
test_fluency_generation() {
    echo -e "\n${BLUE}Testing: AI Fluency Table Generation${NC}"
    
    response=$(curl -s -X POST http://localhost:5001/api/fluency-table \
        -H "Content-Type: application/json" \
        -d '{"roleTitle": "Docker Test Engineer", "industry": "Technology"}')
    
    if echo "$response" | grep -q '"roleId":"docker-test-engineer"'; then
        echo -e "${GREEN}✅ PASS${NC} - AI fluency table generated successfully"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} - AI fluency table generation failed"
        echo "Response: $response"
        return 1
    fi
}

# Start testing
echo -e "\n${YELLOW}Starting Docker deployment tests...${NC}"

# Test 1: Backend Health Check
test_endpoint "http://localhost:5001/health" "200" "Backend Health Check"

# Test 2: Frontend Accessibility
test_endpoint "http://localhost:3000" "200" "Frontend Accessibility"

# Test 3: Backend API - Industries
test_api_response "http://localhost:5001/api/industries" "Industries API"

# Test 4: Backend API - Resources
test_api_response "http://localhost:5001/api/resources" "Resources API"

# Test 5: AI Fluency Generation
test_fluency_generation

# Test 6: Check Docker containers are running
echo -e "\n${BLUE}Testing: Docker Container Status${NC}"
containers=$(docker ps --filter "name=docker-" --format "table {{.Names}}\t{{.Status}}")
echo "$containers"

if echo "$containers" | grep -q "Up"; then
    echo -e "${GREEN}✅ PASS${NC} - Docker containers are running"
else
    echo -e "${RED}❌ FAIL${NC} - Docker containers are not running properly"
    exit 1
fi

# Test 7: Check database file exists
echo -e "\n${BLUE}Testing: Database File${NC}"
if [ -f "docker/data/ai_fluency.db" ]; then
    echo -e "${GREEN}✅ PASS${NC} - SQLite database file exists"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Database file not found (will be created on first AI generation)"
fi

# Summary
echo -e "\n${GREEN}🎉 Docker Deployment Test Complete!${NC}"
echo -e "${BLUE}Access Points:${NC}"
echo -e "  Frontend: http://localhost:3000"
echo -e "  Backend API: http://localhost:5001"
echo -e "  Health Check: http://localhost:5001/health"
echo ""
echo -e "${BLUE}To stop the Docker containers:${NC}"
echo -e "  docker-compose -f docker/docker-compose.dev.yml down"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo -e "  docker logs docker-frontend-1"
echo -e "  docker logs docker-backend-1"
