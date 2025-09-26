#!/bin/bash

# AI Fluency for Teams - Application Test Script
# This script tests if the application is working correctly

echo "🧪 Testing AI Fluency for Teams Application"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

test_passed() {
    echo -e "${GREEN}✅ $1${NC}"
}

test_failed() {
    echo -e "${RED}❌ $1${NC}"
}

test_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Backend Health Check
echo -e "\n${BLUE}Test 1: Backend Health Check${NC}"
if curl -s http://localhost:5001/health >/dev/null 2>&1; then
    test_passed "Backend health check passed"
    echo "Response:"
    curl -s http://localhost:5001/health | jq . 2>/dev/null || curl -s http://localhost:5001/health
else
    test_failed "Backend health check failed"
    echo "Make sure backend is running on port 5001"
fi

# Test 2: Backend API Endpoints
echo -e "\n${BLUE}Test 2: Backend API Endpoints${NC}"

# Test roles endpoint
if curl -s http://localhost:5001/api/roles >/dev/null 2>&1; then
    test_passed "Roles API endpoint working"
    echo "Roles response:"
    curl -s http://localhost:5001/api/roles | jq . 2>/dev/null || curl -s http://localhost:5001/api/roles
else
    test_failed "Roles API endpoint failed"
fi

# Test industries endpoint
if curl -s http://localhost:5001/api/industries >/dev/null 2>&1; then
    test_passed "Industries API endpoint working"
    echo "Industries response:"
    curl -s http://localhost:5001/api/industries | jq . 2>/dev/null || curl -s http://localhost:5001/api/industries
else
    test_failed "Industries API endpoint failed"
fi

# Test fluency table endpoint
if curl -s http://localhost:5001/api/fluency-table/1/Technology >/dev/null 2>&1; then
    test_passed "Fluency table API endpoint working"
    echo "Fluency table response:"
    curl -s http://localhost:5001/api/fluency-table/1/Technology | jq . 2>/dev/null || curl -s http://localhost:5001/api/fluency-table/1/Technology
else
    test_failed "Fluency table API endpoint failed"
fi

# Test 3: Frontend Accessibility
echo -e "\n${BLUE}Test 3: Frontend Accessibility${NC}"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    test_passed "Frontend is accessible"
    echo "Frontend response headers:"
    curl -I http://localhost:3000 2>/dev/null || echo "Could not get headers"
else
    test_failed "Frontend is not accessible"
    echo "Make sure frontend is running on port 3000"
fi

# Test 4: Frontend Content
echo -e "\n${BLUE}Test 4: Frontend Content${NC}"
FRONTEND_CONTENT=$(curl -s http://localhost:3000 2>/dev/null || echo "")
if echo "$FRONTEND_CONTENT" | grep -q "AI Fluency"; then
    test_passed "Frontend contains expected content"
elif echo "$FRONTEND_CONTENT" | grep -q "React"; then
    test_passed "Frontend is serving React app"
else
    test_failed "Frontend content not as expected"
    echo "Frontend content preview:"
    echo "$FRONTEND_CONTENT" | head -10
fi

# Test 5: API Integration
echo -e "\n${BLUE}Test 5: API Integration${NC}"
# Test if frontend can reach backend through proxy
if curl -s http://localhost:3000/api/roles >/dev/null 2>&1; then
    test_passed "Frontend proxy to backend working"
    echo "Proxy response:"
    curl -s http://localhost:3000/api/roles | jq . 2>/dev/null || curl -s http://localhost:3000/api/roles
else
    test_failed "Frontend proxy to backend not working"
    echo "Check vite.config.ts proxy configuration"
fi

echo -e "\n${BLUE}Test Summary${NC}"
echo "============="
echo "If all tests pass, your application is working correctly!"
echo "You can access it at: http://localhost:3000"
echo "Backend API at: http://localhost:5001"
