#!/bin/bash

# AI Fluency for Teams - Quick Diagnostic Script
# Run this to quickly identify what's wrong

echo "🔍 Quick Diagnostic - AI Fluency for Teams"
echo "=========================================="

# Check current directory
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la | head -10

# Check if we're in the right place
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Not in project root directory"
    echo "Please run: cd /Users/kylejames/Desktop/code/AI-Fluency-for-Teams"
    exit 1
fi

echo "✅ In correct project directory"

# Check ports
echo -e "\n🔌 Port Status:"
echo "Port 3000:"
if lsof -i :3000 >/dev/null 2>&1; then
    echo "  ❌ In use by:"
    lsof -i :3000
else
    echo "  ✅ Available"
fi

echo "Port 5001:"
if lsof -i :5001 >/dev/null 2>&1; then
    echo "  ❌ In use by:"
    lsof -i :5001
else
    echo "  ✅ Available"
fi

# Check frontend setup
echo -e "\n🎨 Frontend Setup:"
cd frontend
echo "Frontend directory: $(pwd)"
echo "Frontend files:"
ls -la | head -5

if [ -f "vite.config.ts" ]; then
    echo "✅ vite.config.ts exists"
    echo "Vite config content:"
    cat vite.config.ts
else
    echo "❌ vite.config.ts missing"
fi

if [ -f "index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html missing"
fi

if [ -f "src/main.tsx" ]; then
    echo "✅ main.tsx exists"
else
    echo "❌ main.tsx missing"
fi

# Check backend setup
echo -e "\n⚙️  Backend Setup:"
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend files:"
ls -la | head -5

if [ -f "src/index.ts" ]; then
    echo "✅ index.ts exists"
else
    echo "❌ index.ts missing"
fi

if [ -d "dist" ]; then
    echo "✅ dist directory exists"
    echo "Dist files:"
    ls -la dist/
else
    echo "❌ dist directory missing"
fi

# Check dependencies
echo -e "\n📦 Dependencies:"
echo "Frontend node_modules:"
if [ -d "../frontend/node_modules" ]; then
    echo "  ✅ Installed"
else
    echo "  ❌ Not installed"
fi

echo "Backend node_modules:"
if [ -d "node_modules" ]; then
    echo "  ✅ Installed"
else
    echo "  ❌ Not installed"
fi

# Test compilation
echo -e "\n🔨 Compilation Test:"
echo "Testing backend compilation..."
if npm run build >/dev/null 2>&1; then
    echo "  ✅ Backend compiles successfully"
else
    echo "  ❌ Backend compilation failed"
    echo "  Errors:"
    npm run build
fi

cd ../frontend
echo "Testing frontend compilation..."
if npm run build >/dev/null 2>&1; then
    echo "  ✅ Frontend compiles successfully"
else
    echo "  ❌ Frontend compilation failed"
    echo "  Errors:"
    npm run build
fi

echo -e "\n📋 Summary:"
echo "If you see ❌ errors above, fix them before starting the app."
echo "If everything shows ✅, run: ./start-app.sh"
