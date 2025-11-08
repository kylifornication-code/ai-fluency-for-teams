FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm install

# Create data directory for SQLite database
RUN mkdir -p data

# Note: Source code is mounted as volume in docker-compose.dev.yml
# No need to COPY source code here for development mode

# Expose port
EXPOSE 5001

# Start the application in development mode with nodemon for hot reloading
CMD ["npm", "run", "dev"]
