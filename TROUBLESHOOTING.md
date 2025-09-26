# AI Fluency for Teams - Troubleshooting Guide

This guide helps you diagnose and fix common issues when running the AI Fluency for Teams application.

## Quick Start

1. **Diagnose the issue**: `./diagnose.sh`
2. **Start the application**: `./start-app.sh`
3. **Test the application**: `./test-app.sh`

## Common Issues and Solutions

### Issue 1: Port Already in Use

**Symptoms:**
- Error: `Port 3000 is in use, trying another one...`
- Error: `Error response from daemon: ports are not available`

**Solution:**
```bash
# Kill processes on specific ports
lsof -i :3000  # Check what's using port 3000
kill <PID>     # Kill the process

# Or use our cleanup script
./start-app.sh  # This automatically cleans up ports
```

### Issue 2: Frontend Not Loading (404 Error)

**Symptoms:**
- Browser shows 404 when visiting `http://localhost:3000`
- Vite starts but doesn't serve content

**Solution:**
1. Check if you're in the correct directory:
   ```bash
   pwd  # Should be in project root
   cd frontend
   npx vite --port 3000
   ```

2. Verify `index.html` exists:
   ```bash
   ls -la frontend/index.html
   ```

3. Check Vite configuration:
   ```bash
   cat frontend/vite.config.ts
   ```

### Issue 3: Backend Not Starting

**Symptoms:**
- Backend process exits immediately
- Error: `Cannot find module '/app/dist/index.js'`

**Solution:**
1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Check if `dist` directory exists:
   ```bash
   ls -la backend/dist/
   ```

3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

### Issue 4: TypeScript Compilation Errors

**Symptoms:**
- Build fails with TypeScript errors
- Import/export errors

**Solution:**
1. Check TypeScript configuration:
   ```bash
   cat frontend/tsconfig.json
   cat backend/tsconfig.json
   ```

2. Fix common issues:
   - Remove unused imports
   - Add missing type declarations
   - Check module resolution settings

### Issue 5: Dependencies Not Installed

**Symptoms:**
- `vite: command not found`
- `Cannot find module` errors

**Solution:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Issue 6: Docker Issues

**Symptoms:**
- Docker containers fail to start
- Port conflicts in Docker

**Solution:**
1. Stop all containers:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml down
   ```

2. Clean up:
   ```bash
   docker system prune -f
   ```

3. Rebuild and start:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up --build
   ```

## Diagnostic Scripts

### `./diagnose.sh`
Runs a comprehensive diagnostic to identify issues:
- Checks directory structure
- Verifies port availability
- Tests TypeScript compilation
- Validates configuration files

### `./start-app.sh`
Intelligent startup script that:
- Cleans up existing processes
- Starts backend on port 5001
- Starts frontend on port 3000
- Handles common startup issues
- Provides real-time status updates

### `./test-app.sh`
Tests application functionality:
- Backend health checks
- API endpoint testing
- Frontend accessibility
- Integration testing

## Manual Troubleshooting Steps

### Step 1: Check System Status
```bash
# Check what's running on ports
lsof -i :3000
lsof -i :5001

# Check running processes
ps aux | grep -E "(vite|ts-node|npm)"
```

### Step 2: Clean Up
```bash
# Kill all related processes
pkill -f "vite"
pkill -f "ts-node"
pkill -f "npm"

# Wait for processes to terminate
sleep 3
```

### Step 3: Verify Setup
```bash
# Check project structure
ls -la
ls -la frontend/
ls -la backend/

# Check dependencies
ls -la frontend/node_modules/
ls -la backend/node_modules/
```

### Step 4: Test Compilation
```bash
# Test backend compilation
cd backend
npm run build

# Test frontend compilation
cd ../frontend
npm run build
```

### Step 5: Start Services
```bash
# Start backend
cd backend
npm run dev &

# Start frontend
cd ../frontend
npx vite --port 3000 &
```

## Environment-Specific Issues

### macOS Issues
- **AirPlay using port 5000**: Change backend to port 5001
- **Permission issues**: Use `sudo` for npm operations if needed

### Linux Issues
- **Port binding**: Check if ports are available with `netstat -tulpn`
- **Firewall**: Ensure ports 3000 and 5001 are open

### Windows Issues
- **Path issues**: Use forward slashes in paths
- **Process management**: Use Task Manager to kill processes

## Getting Help

If you're still having issues:

1. Run `./diagnose.sh` and share the output
2. Check the logs from `./start-app.sh`
3. Run `./test-app.sh` to see which tests fail
4. Check the browser console for frontend errors
5. Check the terminal output for backend errors

## Prevention

To avoid common issues:

1. Always run scripts from the project root directory
2. Use the provided scripts instead of manual commands
3. Check port availability before starting services
4. Keep dependencies up to date
5. Use version control to track changes

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./diagnose.sh` | Diagnose issues |
| `./start-app.sh` | Start application |
| `./test-app.sh` | Test application |
| `lsof -i :3000` | Check port 3000 |
| `lsof -i :5001` | Check port 5001 |
| `pkill -f "vite"` | Kill Vite processes |
| `npm run build` | Build project |
| `npm install` | Install dependencies |
