#!/bin/bash

# AI Fluency for Teams - Startup Script
# This script handles common startup issues and starts both services

set -e

echo "🚀 Starting AI Fluency for Teams Application"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}Killing processes on port $port: $pids${NC}"
        echo $pids | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to check if port is free
check_port_free() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${RED}Port $port is still in use after cleanup${NC}"
        return 1
    fi
    return 0
}

# Clean up any existing processes
echo -e "\n${BLUE}Cleaning up existing processes...${NC}"
kill_port 3000
kill_port 5001
kill_port 3001
kill_port 3002
kill_port 3003

# Wait a moment for processes to fully terminate
sleep 3

# Verify ports are free
if ! check_port_free 3000; then
    echo -e "${RED}Failed to free port 3000. Please manually kill processes and try again.${NC}"
    exit 1
fi

if ! check_port_free 5001; then
    echo -e "${RED}Failed to free port 5001. Please manually kill processes and try again.${NC}"
    exit 1
fi

# Start backend
echo -e "\n${BLUE}Starting backend on port 5001...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..10}; do
    if curl -s http://localhost:5001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started successfully on port 5001${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Start frontend
echo -e "\n${BLUE}Starting frontend on port 3000...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npx vite --port 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to start..."
for i in {1..15}; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend started successfully on port 3000${NC}"
        break
    fi
    if [ $i -eq 15 ]; then
        echo -e "${RED}❌ Frontend failed to start${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Success message
echo -e "\n${GREEN}🎉 Application started successfully!${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend API: http://localhost:5001${NC}"
echo -e "${BLUE}Health Check: http://localhost:5001/health${NC}"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Services stopped.${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait
