#!/bin/bash

# AI Fluency for Teams - Troubleshooting Test Suite
# This script helps diagnose and fix common issues

set -e

echo "🔍 AI Fluency for Teams - Troubleshooting Test Suite"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
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

# Test 1: Check if we're in the right directory
echo -e "\n${BLUE}Test 1: Directory Structure${NC}"
if [ -f "package.json" ] && [ -d "frontend" ] && [ -d "backend" ]; then
    test_passed "Project structure is correct"
else
    test_failed "Missing project structure. Are you in the project root?"
    exit 1
fi

# Test 2: Check if ports are available
echo -e "\n${BLUE}Test 2: Port Availability${NC}"
check_port() {
    if lsof -i :$1 >/dev/null 2>&1; then
        test_warning "Port $1 is in use"
        echo "Process using port $1:"
        lsof -i :$1
        return 1
    else
        test_passed "Port $1 is available"
        return 0
    fi
}

check_port 3000
check_port 5001

# Test 3: Check backend dependencies
echo -e "\n${BLUE}Test 3: Backend Dependencies${NC}"
cd backend
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    test_passed "Backend dependencies installed"
else
    test_warning "Backend dependencies not installed"
    echo "Installing backend dependencies..."
    npm install
fi

# Test 4: Check frontend dependencies
echo -e "\n${BLUE}Test 4: Frontend Dependencies${NC}"
cd ../frontend
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    test_passed "Frontend dependencies installed"
else
    test_warning "Frontend dependencies not installed"
    echo "Installing frontend dependencies..."
    npm install
fi

# Test 5: Check TypeScript compilation
echo -e "\n${BLUE}Test 5: TypeScript Compilation${NC}"
cd ../backend
if npm run build >/dev/null 2>&1; then
    test_passed "Backend TypeScript compiles successfully"
else
    test_failed "Backend TypeScript compilation failed"
    echo "Backend compilation errors:"
    npm run build
fi

cd ../frontend
if npm run build >/dev/null 2>&1; then
    test_passed "Frontend TypeScript compiles successfully"
else
    test_failed "Frontend TypeScript compilation failed"
    echo "Frontend compilation errors:"
    npm run build
fi

# Test 6: Check if Vite config is correct
echo -e "\n${BLUE}Test 6: Vite Configuration${NC}"
if [ -f "vite.config.ts" ]; then
    test_passed "Vite config file exists"
    if grep -q "port: 3000" vite.config.ts; then
        test_passed "Vite configured for port 3000"
    else
        test_warning "Vite not configured for port 3000"
    fi
else
    test_failed "Vite config file missing"
fi

# Test 7: Check if index.html exists
echo -e "\n${BLUE}Test 7: Frontend Entry Point${NC}"
if [ -f "index.html" ]; then
    test_passed "index.html exists"
    if grep -q "src/main.tsx" index.html; then
        test_passed "index.html references main.tsx"
    else
        test_warning "index.html doesn't reference main.tsx"
    fi
else
    test_failed "index.html missing"
fi

# Test 8: Check if main.tsx exists
if [ -f "src/main.tsx" ]; then
    test_passed "main.tsx exists"
else
    test_failed "main.tsx missing"
fi

# Test 9: Check if App.tsx exists
if [ -f "src/App.tsx" ]; then
    test_passed "App.tsx exists"
else
    test_failed "App.tsx missing"
fi

# Test 10: Check backend source files
echo -e "\n${BLUE}Test 10: Backend Source Files${NC}"
cd ../backend
if [ -f "src/index.ts" ]; then
    test_passed "Backend index.ts exists"
else
    test_failed "Backend index.ts missing"
fi

# Test 11: Check if processes are running
echo -e "\n${BLUE}Test 11: Running Processes${NC}"
if lsof -i :5001 >/dev/null 2>&1; then
    test_warning "Backend is already running on port 5001"
else
    test_info "Backend not running on port 5001"
fi

if lsof -i :3000 >/dev/null 2>&1; then
    test_warning "Frontend is already running on port 3000"
else
    test_info "Frontend not running on port 3000"
fi

# Test 12: Test backend startup
echo -e "\n${BLUE}Test 12: Backend Startup Test${NC}"
if ! lsof -i :5001 >/dev/null 2>&1; then
    echo "Starting backend for testing..."
    timeout 10s npm run dev &
    BACKEND_PID=$!
    sleep 3
    
    if curl -s http://localhost:5001/health >/dev/null 2>&1; then
        test_passed "Backend starts and responds to health check"
        kill $BACKEND_PID 2>/dev/null || true
    else
        test_failed "Backend fails to start or respond"
        kill $BACKEND_PID 2>/dev/null || true
    fi
else
    test_info "Backend already running, skipping startup test"
fi

# Test 13: Test frontend startup
echo -e "\n${BLUE}Test 13: Frontend Startup Test${NC}"
if ! lsof -i :3000 >/dev/null 2>&1; then
    echo "Starting frontend for testing..."
    timeout 10s npx vite --port 3000 &
    FRONTEND_PID=$!
    sleep 5
    
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        test_passed "Frontend starts and responds"
        kill $FRONTEND_PID 2>/dev/null || true
    else
        test_failed "Frontend fails to start or respond"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
else
    test_info "Frontend already running, skipping startup test"
fi

echo -e "\n${BLUE}Test Summary${NC}"
echo "============="
echo "Run this script to diagnose issues before starting the application."
echo "If all tests pass, you can start the application with:"
echo "  Backend: cd backend && npm run dev"
echo "  Frontend: cd frontend && npx vite --port 3000"
echo ""
echo "If tests fail, fix the issues before proceeding."
