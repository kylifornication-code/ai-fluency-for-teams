#!/bin/bash

# Development Docker Script
# Quick script to start/stop/restart development containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Use docker compose (newer) or docker-compose (older)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Navigate to docker directory
cd "$(dirname "$0")/docker"

# Function to show usage
show_usage() {
    echo -e "${BLUE}Development Docker Helper${NC}"
    echo ""
    echo "Usage: ./dev-docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start development containers (with logs)"
    echo "  start-bg  - Start development containers in background"
    echo "  stop      - Stop development containers"
    echo "  restart   - Restart development containers"
    echo "  logs      - Show logs (follow mode)"
    echo "  logs-backend  - Show backend logs only"
    echo "  logs-frontend - Show frontend logs only"
    echo "  rebuild   - Rebuild containers (after dependency changes)"
    echo "  clean     - Stop and remove containers, volumes"
    echo "  status    - Show container status"
    echo ""
}

# Function to start containers
start_containers() {
    echo -e "${GREEN}🚀 Starting development containers...${NC}"
    echo ""
    $COMPOSE_CMD -f docker-compose.dev.yml up --build
}

# Function to start containers in background
start_containers_bg() {
    echo -e "${GREEN}🚀 Starting development containers in background...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml up --build -d
    echo ""
    echo -e "${GREEN}✅ Containers started!${NC}"
    echo ""
    echo "📝 Services:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend: http://localhost:5001"
    echo ""
    echo "View logs: ./dev-docker.sh logs"
}

# Function to stop containers
stop_containers() {
    echo -e "${YELLOW}🛑 Stopping development containers...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Containers stopped${NC}"
}

# Function to restart containers
restart_containers() {
    echo -e "${YELLOW}🔄 Restarting development containers...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml restart
    echo -e "${GREEN}✅ Containers restarted${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Showing logs (Ctrl+C to exit)...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml logs -f
}

# Function to show backend logs
show_backend_logs() {
    echo -e "${BLUE}📋 Showing backend logs (Ctrl+C to exit)...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml logs -f backend
}

# Function to show frontend logs
show_frontend_logs() {
    echo -e "${BLUE}📋 Showing frontend logs (Ctrl+C to exit)...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml logs -f frontend
}

# Function to rebuild containers
rebuild_containers() {
    echo -e "${YELLOW}🔨 Rebuilding containers...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml down
    $COMPOSE_CMD -f docker-compose.dev.yml build --no-cache
    $COMPOSE_CMD -f docker-compose.dev.yml up -d
    echo -e "${GREEN}✅ Containers rebuilt and started${NC}"
}

# Function to clean everything
clean_containers() {
    echo -e "${YELLOW}🧹 Cleaning containers and volumes...${NC}"
    read -p "This will remove containers and volumes. Continue? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $COMPOSE_CMD -f docker-compose.dev.yml down -v
        echo -e "${GREEN}✅ Cleaned${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    echo ""
    $COMPOSE_CMD -f docker-compose.dev.yml ps
    echo ""
    echo -e "${BLUE}📋 Recent Logs:${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml logs --tail=20
}

# Main command handler
case "${1:-}" in
    start)
        start_containers
        ;;
    start-bg)
        start_containers_bg
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    logs-backend)
        show_backend_logs
        ;;
    logs-frontend)
        show_frontend_logs
        ;;
    rebuild)
        rebuild_containers
        ;;
    clean)
        clean_containers
        ;;
    status)
        show_status
        ;;
    *)
        show_usage
        exit 1
        ;;
esac

