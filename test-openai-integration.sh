#!/bin/bash

# AI Fluency for Teams - OpenAI Integration Test Script
# This script tests the OpenAI integration and helps troubleshoot issues

echo "🧪 AI Fluency for Teams - OpenAI Integration Tests"
echo "=================================================="

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

test_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

test_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Check if .env file exists and has API key
echo -e "\n${BLUE}Test 1: Environment Configuration${NC}"
if [ -f "backend/.env" ]; then
    test_passed ".env file exists"
    
    if grep -q "OPENAI_API_KEY=sk-" backend/.env; then
        test_passed "OpenAI API key is configured"
        API_KEY=$(grep "OPENAI_API_KEY=" backend/.env | cut -d'=' -f2)
        echo "API Key: ${API_KEY:0:10}..."
    else
        test_failed "OpenAI API key not configured or invalid format"
        echo "Please add your OpenAI API key to backend/.env"
        echo "Format: OPENAI_API_KEY=sk-your-actual-key-here"
    fi
else
    test_failed ".env file not found"
    echo "Please run: cp backend/env.example backend/.env"
fi

# Test 2: Check if backend is running
echo -e "\n${BLUE}Test 2: Backend Service${NC}"
if curl -s http://localhost:5001/health >/dev/null 2>&1; then
    test_passed "Backend is running on port 5001"
else
    test_failed "Backend is not running"
    echo "Please start the backend with: ./start-app.sh"
    exit 1
fi

# Test 3: Test basic API endpoints
echo -e "\n${BLUE}Test 3: Basic API Endpoints${NC}"

# Test roles endpoint
if curl -s http://localhost:5001/api/roles >/dev/null 2>&1; then
    test_passed "Roles API endpoint working"
    ROLES_COUNT=$(curl -s http://localhost:5001/api/roles | jq '. | length' 2>/dev/null || echo "unknown")
    echo "  Found $ROLES_COUNT roles"
else
    test_failed "Roles API endpoint failed"
fi

# Test industries endpoint
if curl -s http://localhost:5001/api/industries >/dev/null 2>&1; then
    test_passed "Industries API endpoint working"
    INDUSTRIES_COUNT=$(curl -s http://localhost:5001/api/industries | jq '. | length' 2>/dev/null || echo "unknown")
    echo "  Found $INDUSTRIES_COUNT industries"
else
    test_failed "Industries API endpoint failed"
fi

# Test resources endpoint
if curl -s http://localhost:5001/api/resources >/dev/null 2>&1; then
    test_passed "Resources API endpoint working"
    RESOURCES_COUNT=$(curl -s http://localhost:5001/api/resources | jq '. | length' 2>/dev/null || echo "unknown")
    echo "  Found $RESOURCES_COUNT resources"
else
    test_failed "Resources API endpoint failed"
fi

# Test 4: Test fluency table generation (fallback)
echo -e "\n${BLUE}Test 4: Fluency Table Generation (Fallback)${NC}"
FALLBACK_RESPONSE=$(curl -s http://localhost:5001/api/fluency-table/1/Technology)
if echo "$FALLBACK_RESPONSE" | grep -q "levels"; then
    test_passed "Fallback fluency table generation working"
    LEVELS_COUNT=$(echo "$FALLBACK_RESPONSE" | jq '.levels | length' 2>/dev/null || echo "unknown")
    echo "  Generated $LEVELS_COUNT fluency levels"
else
    test_failed "Fallback fluency table generation failed"
    echo "Response: $FALLBACK_RESPONSE"
fi

# Test 5: Test AI-powered fluency table generation
echo -e "\n${BLUE}Test 5: AI-Powered Fluency Table Generation${NC}"
AI_RESPONSE=$(curl -s -X POST http://localhost:5001/api/fluency-table \
  -H "Content-Type: application/json" \
  -d '{"roleTitle": "Software Engineer", "industry": "Technology"}')

if echo "$AI_RESPONSE" | grep -q "levels"; then
    test_passed "AI-powered fluency table generation working"
    LEVELS_COUNT=$(echo "$AI_RESPONSE" | jq '.levels | length' 2>/dev/null || echo "unknown")
    echo "  Generated $LEVELS_COUNT fluency levels"
    
    # Check if it's cached or fresh
    if echo "$AI_RESPONSE" | grep -q "cached.*true"; then
        test_info "Response was served from cache"
    else
        test_info "Response was generated fresh"
    fi
else
    test_failed "AI-powered fluency table generation failed"
    echo "Response: $AI_RESPONSE"
    
    # Check for specific error messages
    if echo "$AI_RESPONSE" | grep -q "Failed to generate fluency table"; then
        test_warning "OpenAI API might not be configured or accessible"
    fi
fi

# Test 6: Test resource recommendations
echo -e "\n${BLUE}Test 6: Resource Recommendations${NC}"
RECOMMENDATIONS_RESPONSE=$(curl -s -X POST http://localhost:5001/api/resources/recommendations \
  -H "Content-Type: application/json" \
  -d '{"roleTitle": "Software Engineer", "industry": "Technology", "currentLevel": "Capable"}')

if echo "$RECOMMENDATIONS_RESPONSE" | grep -q "title"; then
    test_passed "Resource recommendations working"
    RECOMMENDATIONS_COUNT=$(echo "$RECOMMENDATIONS_RESPONSE" | jq '. | length' 2>/dev/null || echo "unknown")
    echo "  Generated $RECOMMENDATIONS_COUNT recommendations"
else
    test_failed "Resource recommendations failed"
    echo "Response: $RECOMMENDATIONS_RESPONSE"
fi

# Test 7: Test learning path generation
echo -e "\n${BLUE}Test 7: Learning Path Generation${NC}"
LEARNING_PATH_RESPONSE=$(curl -s -X POST http://localhost:5001/api/learning-path \
  -H "Content-Type: application/json" \
  -d '{"roleTitle": "Software Engineer", "industry": "Technology", "currentLevel": "Capable", "targetLevel": "Adoptive"}')

if echo "$LEARNING_PATH_RESPONSE" | grep -q "path"; then
    test_passed "Learning path generation working"
    PATH_STEPS=$(echo "$LEARNING_PATH_RESPONSE" | jq '.path | length' 2>/dev/null || echo "unknown")
    echo "  Generated learning path with $PATH_STEPS steps"
else
    test_failed "Learning path generation failed"
    echo "Response: $LEARNING_PATH_RESPONSE"
fi

# Test 8: Test frontend connectivity
echo -e "\n${BLUE}Test 8: Frontend Connectivity${NC}"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    test_passed "Frontend is accessible"
else
    test_failed "Frontend is not accessible"
fi

# Test 9: Test API proxy through frontend
echo -e "\n${BLUE}Test 9: Frontend API Proxy${NC}"
PROXY_RESPONSE=$(curl -s http://localhost:3000/api/roles)
if echo "$PROXY_RESPONSE" | grep -q "title"; then
    test_passed "Frontend API proxy working"
else
    test_failed "Frontend API proxy not working"
    echo "Response: $PROXY_RESPONSE"
fi

# Summary
echo -e "\n${BLUE}Test Summary${NC}"
echo "============="
echo "If all tests pass, your OpenAI integration is working correctly."
echo "If tests fail, check the error messages above for specific issues."
echo ""
echo "Common issues and solutions:"
echo "1. OpenAI API key not set: Add your key to backend/.env"
echo "2. Backend not running: Run ./start-app.sh"
echo "3. Network issues: Check your internet connection"
echo "4. API rate limits: Wait and try again"
echo "5. Invalid API key: Verify your OpenAI API key is correct"
