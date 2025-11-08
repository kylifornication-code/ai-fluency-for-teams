# Docker Development Guide - Iterative Testing

This guide explains how to iteratively test your changes within Docker containers with hot reloading.

## Quick Start

### 1. Start Development Containers

```bash
cd docker
docker compose -f docker-compose.dev.yml up --build
```

This will:
- Build the containers with development configurations
- Mount your source code as volumes (changes reflect immediately)
- Enable hot reloading for both frontend and backend
- Show logs in the terminal

### 2. Access the Application

- **Frontend**: http://localhost:3000 (auto-reloads on file changes)
- **Backend API**: http://localhost:5001 (auto-reloads on file changes)
- **Health Check**: http://localhost:5001/health

## How It Works

### Volume Mounts

The `docker-compose.dev.yml` file mounts your source code directories:

```yaml
volumes:
  - ../frontend:/app          # Frontend source code
  - ../backend:/app            # Backend source code
  - /app/node_modules          # Prevents overwriting node_modules
```

This means:
- ✅ Changes to your code are immediately reflected in the container
- ✅ No need to rebuild containers for code changes
- ✅ `node_modules` are preserved (not overwritten by host)

### Hot Reloading

**Frontend (Vite)**:
- Automatically detects file changes
- Hot Module Replacement (HMR) updates the browser instantly
- No page refresh needed for most changes

**Backend (ts-node)**:
- Uses `ts-node` to run TypeScript directly
- Restarts automatically when files change
- Watch mode enabled for instant updates

## Common Workflows

### Making Code Changes

1. **Edit your code** in your IDE (outside Docker)
2. **Save the file**
3. **See changes automatically**:
   - Frontend: Browser updates instantly (or shows "reload" notification)
   - Backend: Server restarts automatically (check logs)

### Viewing Logs

```bash
# All services
cd docker && docker compose -f docker-compose.dev.yml logs -f

# Just backend
cd docker && docker compose -f docker-compose.dev.yml logs -f backend

# Just frontend
cd docker && docker compose -f docker-compose.dev.yml logs -f frontend
```

### Restarting Services

```bash
# Restart all services
cd docker && docker compose -f docker-compose.dev.yml restart

# Restart specific service
cd docker && docker compose -f docker-compose.dev.yml restart backend
cd docker && docker compose -f docker-compose.dev.yml restart frontend
```

### Rebuilding After Dependency Changes

If you add/remove npm packages, rebuild the containers:

```bash
cd docker
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build
```

### Stopping Services

```bash
cd docker && docker compose -f docker-compose.dev.yml down
```

## Testing Your New Features

### Testing the Job Prompts Feature

1. **Start the dev containers**:
   ```bash
   cd docker && docker compose -f docker-compose.dev.yml up
   ```

2. **Make changes** to your code:
   - Edit `frontend/src/pages/AIFluencyDashboard.tsx`
   - Edit `backend/src/services/openai.ts`
   - Edit `backend/src/index.ts`

3. **Save files** - changes appear automatically

4. **Test in browser**:
   - Go to http://localhost:3000
   - Generate a fluency assessment
   - Click "Generate Prompts" button
   - Test the new prompts feature

5. **Check logs** if something doesn't work:
   ```bash
   docker compose -f docker-compose.dev.yml logs -f backend
   ```

### Debugging Tips

**Backend not updating?**
- Check logs: `docker compose -f docker-compose.dev.yml logs backend`
- Verify volume mount: `docker compose -f docker-compose.dev.yml exec backend ls -la /app/src`
- Restart backend: `docker compose -f docker-compose.dev.yml restart backend`

**Frontend not updating?**
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check Vite logs: `docker compose -f docker-compose.dev.yml logs frontend`
- Verify Vite is watching: Look for "VITE ready" in logs

**Database changes?**
- Database is persisted in `docker/data/ai_fluency.db`
- If you change schema, you may need to delete the DB:
  ```bash
  rm docker/data/ai_fluency.db
  docker compose -f docker-compose.dev.yml restart backend
  ```

## Development vs Production

### Development Mode (`docker-compose.dev.yml`)
- ✅ Hot reloading enabled
- ✅ Source code mounted as volumes
- ✅ Development dependencies included
- ✅ Detailed error messages
- ✅ Source maps enabled

### Production Mode (`docker-compose.prod.yml`)
- ✅ Optimized builds
- ✅ No source code volumes
- ✅ Production dependencies only
- ✅ Minified code
- ❌ No hot reloading

**Always use `docker-compose.dev.yml` for iterative testing!**

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000  # Frontend
lsof -i :5001  # Backend

# Kill the process or change ports in docker-compose.dev.yml
```

### Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.dev.yml logs

# Rebuild from scratch
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

### Changes Not Reflecting

1. **Verify volumes are mounted**:
   ```bash
   docker compose -f docker-compose.dev.yml exec backend ls -la /app/src
   ```

2. **Check file permissions**:
   - Ensure files are readable by the container user

3. **Restart the service**:
   ```bash
   docker compose -f docker-compose.dev.yml restart backend
   ```

### Database Locked

If you see "database is locked" errors:

```bash
# Stop containers
docker compose -f docker-compose.dev.yml down

# Remove database (WARNING: deletes data)
rm docker/data/ai_fluency.db

# Restart
docker compose -f docker-compose.dev.yml up
```

## Best Practices

1. **Always use dev mode for testing**: `docker-compose.dev.yml`
2. **Watch the logs** while developing to catch errors early
3. **Test incrementally**: Make small changes and test frequently
4. **Commit working code** before major refactors
5. **Use production mode** only for final testing before deployment

## Quick Reference

```bash
# Start dev environment
cd docker && docker compose -f docker-compose.dev.yml up

# Start in background
cd docker && docker compose -f docker-compose.dev.yml up -d

# View logs
cd docker && docker compose -f docker-compose.dev.yml logs -f

# Restart a service
cd docker && docker compose -f docker-compose.dev.yml restart backend

# Stop everything
cd docker && docker compose -f docker-compose.dev.yml down

# Rebuild after dependency changes
cd docker && docker compose -f docker-compose.dev.yml up --build

# Clean rebuild (removes cache)
cd docker && docker compose -f docker-compose.dev.yml build --no-cache
```

