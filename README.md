# AI Fluency for Teams - MVP

A web application that provides personalized AI fluency assessments and learning resources based on job roles and industries.

## Features

- **Role Selection**: Choose from various job roles
- **Industry Selection**: Select your industry context
- **AI Fluency Table**: Generate personalized fluency levels (Unacceptable → Capable → Adoptive → Transformative)
- **Learning Resources**: Browse and bookmark learning materials
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React + TypeScript + Material-UI + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (planned)
- **Cache**: Redis (planned)
- **Containerization**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose (for containerized setup)

### Option 1: Local Development (without Docker)

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Docker Development

1. **Start all services**:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

- `GET /health` - Health check
- `GET /api/roles` - Get available job roles
- `GET /api/industries` - Get available industries
- `GET /api/fluency-table/:roleId/:industry` - Generate fluency table
- `GET /api/resources` - Get learning resources
- `POST /api/bookmarks` - Bookmark a resource

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic services
│   │   ├── models/         # Data models
│   │   └── middleware/     # Express middleware
│   ├── tests/              # Backend tests
│   └── package.json
├── docker/                 # Docker configuration
│   └── docker-compose.dev.yml
└── docs/                   # Documentation
```

## Development Status

### ✅ Completed (MVP)
- [x] Project structure and configuration
- [x] Backend API with mock data
- [x] Frontend React application with routing
- [x] Basic Docker setup
- [x] Role and industry selection
- [x] Fluency table display
- [x] Resource browsing and bookmarking
- [x] Basic tests

### 🚧 Next Steps
- [ ] Database integration (PostgreSQL)
- [ ] Redis caching
- [ ] OpenAI API integration
- [ ] User authentication
- [ ] Advanced search and filtering
- [ ] Performance optimization
- [ ] Comprehensive testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License