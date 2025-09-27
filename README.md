# AI Fluency for Teams

A comprehensive web application that provides personalized AI fluency assessments and learning resources based on job roles and industries. Built with modern technologies and powered by OpenAI's GPT-4.1 model.

## ✨ Features

- **🤖 AI-Powered Assessments**: Generate personalized fluency tables using OpenAI GPT-4.1
- **🎯 Role-Based Analysis**: Customized assessments for specific job roles and industries
- **📊 Fluency Levels**: Four-tier system (Unskilled → Capable → Adoptive → Transformative)
- **📚 Curated Resources**: 17+ high-quality learning resources and tools
- **💾 Smart Caching**: Database caching for cost optimization and performance
- **🎨 Modern UI**: Beautiful, responsive design with dark/light mode
- **⚡ Real-time Generation**: Instant fluency table generation with progress indicators
- **🔍 Context-Aware**: Additional context input for more personalized assessments

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Material-UI + Vite
- **Backend**: Node.js + Express + TypeScript
- **AI Integration**: OpenAI GPT-4.1 API
- **Database**: SQLite (with PostgreSQL migration path)
- **Caching**: In-memory with database persistence
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload, TypeScript, ESLint

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **OpenAI API Key** (required for AI functionality)
- **Docker and Docker Compose** (optional, for containerized setup)

### 🎯 One-Command Setup

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd AI-Fluency-for-Teams
   chmod +x start-app.sh
   ```

2. **Configure OpenAI** (if not already done):
   ```bash
   ./setup-openai.sh
   # Follow the prompts to add your OpenAI API key
   ```

3. **Start the application**:
   ```bash
   ./start-app.sh
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **Health Check**: http://localhost:5001/health

### 🔧 Manual Setup (Alternative)

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   # Copy and edit environment file
   cp backend/env.example backend/.env
   # Add your OpenAI API key to backend/.env
   ```

3. **Start services**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### 🐳 Docker Setup (Optional)

1. **Start all services**:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔌 API Endpoints

### Core Endpoints
- `GET /health` - Health check and system status
- `GET /api/industries` - Get available industries
- `GET /api/resources` - Get curated learning resources (17+ resources)

### AI Fluency Generation
- `POST /api/fluency-table` - Generate personalized fluency table
  - **Body**: `{ "roleTitle": "string", "industry": "string", "context": "string" }`
  - **Response**: Complete fluency table with 4 levels
- `GET /api/fluency-table/:roleId/:industry` - Get cached fluency table

### Development & Testing
- `POST /api/test-fluency` - Test OpenAI integration (development only)

## 📁 Project Structure

```
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Main page components
│   │   │   └── AIFluencyDashboard.tsx  # Main dashboard
│   │   ├── App.tsx             # Root component with theme
│   │   └── main.tsx            # Application entry point
│   ├── public/
│   │   └── logo.png            # Application logo
│   ├── dist/                   # Built frontend assets
│   └── package.json
├── backend/                     # Node.js backend API
│   ├── src/
│   │   ├── services/           # Core business logic
│   │   │   ├── openai.ts       # OpenAI integration
│   │   │   └── database.ts     # Database operations
│   │   ├── config/
│   │   │   └── environment.ts  # Environment configuration
│   │   ├── validation/
│   │   │   └── schemas.ts      # Request validation schemas
│   │   ├── types/
│   │   │   └── express.d.ts    # TypeScript declarations
│   │   ├── index.ts            # Express server setup
│   │   └── tests/              # Backend tests
│   ├── data/
│   │   └── ai_fluency.db       # SQLite database
│   ├── dist/                   # Compiled TypeScript
│   └── package.json
├── docker/                     # Docker configuration
│   └── docker-compose.dev.yml
├── docs/                       # Documentation
├── start-app.sh               # One-command startup script
├── setup-openai.sh            # OpenAI configuration script
├── diagnose.sh                # Troubleshooting script
└── README.md                  # This file
```

## 🎯 Current Status

### ✅ Completed Features
- [x] **Full-Stack Application**: React frontend + Node.js backend
- [x] **OpenAI Integration**: GPT-4.1 powered fluency assessments
- [x] **Database Caching**: SQLite with intelligent caching system
- [x] **Modern UI**: Material-UI with dark/light mode support
- [x] **Role-Based Assessments**: Personalized fluency tables
- [x] **Learning Resources**: 17+ curated resources and tools
- [x] **Context-Aware**: Additional context input for personalization
- [x] **Responsive Design**: Works on all device sizes
- [x] **Logo Integration**: Professional branding
- [x] **One-Command Setup**: Automated startup scripts
- [x] **Error Handling**: Comprehensive error management
- [x] **Rate Limiting**: API protection and optimization

### 🚀 Recent Updates
- **GPT-4.1 Integration**: Latest AI model for enhanced assessments
- **Smart Caching**: Database persistence for cost optimization
- **Logo Integration**: Professional branding throughout the app
- **Improved UI**: Enhanced user experience with animations
- **Better Error Handling**: More informative error messages

### 🔮 Future Enhancements
- [ ] **User Authentication**: Login and user profiles
- [ ] **Progress Tracking**: Learning journey monitoring
- [ ] **Advanced Analytics**: Usage insights and metrics
- [ ] **Export Features**: PDF/CSV export capabilities
- [ ] **Team Features**: Collaborative assessments
- [ ] **Mobile App**: Native mobile application
- [ ] **API Rate Optimization**: Advanced caching strategies

## 🛠️ Development

### Environment Variables
Create a `.env` file in the `backend/` directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Available Scripts
```bash
# Start the application
./start-app.sh

# Setup OpenAI integration
./setup-openai.sh

# Diagnose issues
./diagnose.sh

# Backend development
cd backend && npm run dev

# Frontend development
cd frontend && npm run dev

# Build for production
cd backend && npm run build
cd frontend && npm run build
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style
4. **Add tests**: Ensure your changes are tested
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components for consistency
- Add proper error handling
- Include JSDoc comments for complex functions
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4.1 API
- **Material-UI** for the beautiful component library
- **React** and **TypeScript** communities for excellent tooling
- **Vite** for fast development experience