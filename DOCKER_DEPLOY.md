# Docker Local Deployment Guide

This guide will help you deploy the AI Fluency for Teams application locally using Docker.

## Prerequisites

- **Docker** installed and running ([Get Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** (usually included with Docker Desktop)
- **OpenAI API Key** (required for AI functionality)

## Quick Start

### 1. Set up Environment Variables

First, create the backend environment file:

```bash
cp backend/env.example backend/.env
```

Then edit `backend/.env` and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 2. Deploy with Script

Run the deployment script:

```bash
./docker-deploy.sh
```

This will:
- Check prerequisites
- Create `.env` file if needed
- Build Docker images
- Start all services
- Verify services are running

### 3. Access the Application

Once deployed, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## Manual Deployment

If you prefer to deploy manually:

```bash
# Navigate to docker directory
cd docker

# Build and start services
docker-compose -f docker-compose.prod.yml up --build -d

# Or with newer Docker versions:
docker compose -f docker-compose.prod.yml up --build -d
```

## Useful Commands

### View Logs
```bash
cd docker
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Stop Services
```bash
cd docker
docker-compose -f docker-compose.prod.yml down
```

### Restart Services
```bash
cd docker
docker-compose -f docker-compose.prod.yml restart
```

### Rebuild After Code Changes
```bash
cd docker
docker-compose -f docker-compose.prod.yml up --build -d
```

### Check Running Containers
```bash
docker ps
```

### Access Container Shell
```bash
# Backend container
docker exec -it <backend-container-id> sh

# Frontend container
docker exec -it <frontend-container-id> sh
```

## Architecture

The Docker setup consists of:

1. **Backend Service**
   - Node.js/Express API
   - Runs on port 5001
   - Uses SQLite database (persisted in `docker/data/`)
   - Requires OpenAI API key

2. **Frontend Service**
   - React app built with Vite
   - Served by Nginx
   - Runs on port 3000
   - Proxies `/api` requests to backend

## Troubleshooting

### Services Won't Start

1. **Check Docker is running**:
   ```bash
   docker ps
   ```

2. **Check logs for errors**:
   ```bash
   cd docker
   docker-compose -f docker-compose.prod.yml logs
   ```

3. **Verify environment variables**:
   - Ensure `backend/.env` exists
   - Check `OPENAI_API_KEY` is set correctly

### Port Already in Use

If ports 3000 or 5001 are already in use:

1. **Stop conflicting services**, or
2. **Modify ports in `docker/docker-compose.prod.yml`**:
   ```yaml
   ports:
     - "3001:3000"  # Change host port
     - "5002:5001"  # Change host port
   ```

### Database Issues

The SQLite database is stored in `docker/data/ai_fluency.db`. If you need to reset:

```bash
cd docker
docker-compose -f docker-compose.prod.yml down
rm -rf data/ai_fluency.db
docker-compose -f docker-compose.prod.yml up -d
```

### Build Failures

If builds fail:

1. **Clean Docker cache**:
   ```bash
   docker system prune -a
   ```

2. **Rebuild from scratch**:
   ```bash
   cd docker
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

### Frontend Can't Connect to Backend

1. **Check backend is running**:
   ```bash
   curl http://localhost:5001/health
   ```

2. **Check nginx proxy configuration** in `frontend/nginx.conf`

3. **Verify CORS settings** in backend (should allow `http://localhost:3000`)

## Environment Variables

### Backend (.env file)

Required:
- `OPENAI_API_KEY` - Your OpenAI API key

Optional:
- `OPENAI_MODEL` - Model to use (default: gpt-4)
- `OPENAI_MAX_TOKENS` - Max tokens (default: 2000)
- `OPENAI_TEMPERATURE` - Temperature (default: 0.7)
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (set to production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Production Considerations

For production deployment:

1. **Use environment variables** instead of `.env` file
2. **Set up proper SSL/TLS** (HTTPS)
3. **Use a production database** (PostgreSQL instead of SQLite)
4. **Configure proper CORS** origins
5. **Set up monitoring and logging**
6. **Use Docker secrets** for sensitive data
7. **Configure resource limits** in docker-compose

## Next Steps

- Test the application at http://localhost:3000
- Generate a fluency table to test OpenAI integration
- Check the health endpoint: http://localhost:5001/health

For issues or questions, check the logs and verify all environment variables are set correctly.

