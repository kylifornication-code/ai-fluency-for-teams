# AI Fluency Table Generator - Technical Specification

## Project Overview

**Project Name**: AI Fluency for Teams - Table Generator  
**Version**: 1.0.0  
**Constitution Compliance**: v1.0.0  
**Last Updated**: 2025-9-21

## Executive Summary

The AI Fluency Table Generator is a web application that provides personalized AI fluency assessments and learning resources based on job roles and industries. The application serves individual contributors seeking to advance their AI skills through role-specific learning paths and practical application.

## Functional Requirements

### Core Features

#### 1. Individual Role-Based AI Fluency Table Generation
- **Input**: Job title, industry
- **Output**: 
  - Personalized AI fluency table (Unacceptable → Capable → Adoptive → Transformative)
  - Role-specific learning resources and example projects
  - Recommended learning path based on role requirements
  - Resource bookmarking and favorites


#### 2. Resource and Project Library
- **Content Types**:
  - Learning materials (tutorials, courses, documentation)
  - Example projects with step-by-step guides
  - Tool recommendations and setup guides
  - Best practices and case studies
- **Filtering**: By role, industry, skill level, learning style

### User Experience Requirements

#### Individual User Journey
1. **Onboarding**: Role selection, industry selection
2. **Table Generation**: Instant AI fluency table based on role and industry
3. **Exploration**: Detailed fluency level explanations and criteria
4. **Resources**: Curated learning materials and example projects
5. **Bookmarking**: Save favorite resources and track learning
6. **Sharing**: Export tables and share with colleagues


## Technical Architecture

### System Components

#### Frontend Application
- **Framework**: React with TypeScript
- **UI Library**: Material-UI for accessibility compliance
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router
- **Charts/Tables**: Recharts for fluency visualizations
- **Caching**: Redis for frontend caching

#### Backend API
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL for structured data storage
- **Caching**: Redis for OpenAI response caching
- **AI Integration**: OpenAI API for content generation
- **Authentication**: JWT-based authentication

#### Data Layer
- **Role Database**: Comprehensive job role definitions and industry mappings
- **Fluency Framework**: Standardized fluency level definitions and criteria
- **Resource Database**: Learning materials, projects, and tool recommendations
- **User Progress**: Individual and team progress tracking
- **OpenAI Cache**: Redis-based caching for AI-generated content
- **Response Storage**: PostgreSQL storage for generated fluency tables and recommendations

### Data Models

#### Core Entities

```typescript
interface JobRole {
  id: string;
  title: string;
  industry: string;
  department: string;
  description: string;
  aiRelevanceScore: number; // 1-10 scale
  fluencyLevels: FluencyLevel[];
}

interface FluencyLevel {
  level: 'Unacceptable' | 'Capable' | 'Adoptive' | 'Transformative';
  criteria: string[];
  examples: string[];
  tools: string[];
  skills: string[];
}

interface LearningResource {
  id: string;
  title: string;
  type: 'tutorial' | 'course' | 'project' | 'tool' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in hours
  prerequisites: string[];
  roles: string[]; // applicable job roles
  industries: string[];
  url: string;
  description: string;
}

interface ExampleProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  roles: string[];
  steps: ProjectStep[];
  resources: string[];
  expectedOutcomes: string[];
}

interface UserProfile {
  userId: string;
  roleId: string;
  industry: string;
  preferences: UserPreferences;
  bookmarks: string[];
  createdAt: Date;
  lastAccessed: Date;
}


interface FluencyTable {
  id: string;
  roleId: string;
  industry: string;
  levels: FluencyLevel[];
  generatedAt: Date;
  modelVersion: string;
  cached: boolean;
}

interface OpenAICache {
  id: string;
  promptHash: string;
  response: any;
  modelVersion: string;
  createdAt: Date;
  expiresAt: Date;
}
```

### API Endpoints

#### Individual User Endpoints
```
GET /api/roles - Get available job roles
GET /api/industries - Get available industries
GET /api/fluency-table/{roleId}/{industry} - Generate fluency table
GET /api/resources - Get learning resources (filtered)
GET /api/projects - Get example projects (filtered)
POST /api/bookmarks - Save resource bookmarks
GET /api/profile - Get user profile
PUT /api/profile - Update user preferences
```


#### Resource Endpoints
```
GET /api/resources/search - Search resources
GET /api/projects/search - Search projects
POST /api/resources/rate - Rate resource helpfulness
GET /api/analytics/usage - Get usage analytics
```

## User Interface Design

### Design Principles
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile Responsive**: Works on all device sizes
- **Progressive Disclosure**: Information revealed as needed
- **Visual Hierarchy**: Clear information architecture
- **Consistent Navigation**: Intuitive user flows

### Key UI Components

#### Fluency Table Component
- Interactive table showing progression through fluency levels
- Color-coded levels (red → yellow → green → blue)
- Expandable criteria and examples
- Progress indicators for current vs. target levels

#### Resource Browser
- Filterable by role, industry, difficulty, type
- Search functionality with autocomplete
- Rating and review system
- Bookmarking and favorites


### Responsive Design
- **Mobile**: Single-column layout, touch-friendly interactions
- **Tablet**: Two-column layout with collapsible sidebar
- **Desktop**: Full dashboard with multiple panels

## OpenAI Integration

### AI-Powered Features
- **Fluency Table Generation**: Generate role-specific fluency tables using OpenAI API
- **Resource Recommendations**: AI-powered learning resource suggestions
- **Manager Guidance**: Generate team-specific recommendations and insights
- **Content Curation**: Intelligent filtering and ranking of learning materials

### Caching Strategy
- **Redis Caching**: Store OpenAI responses for 24-48 hours
- **Cache Keys**: Role + Industry + Content Type + Model Version
- **Cache Invalidation**: Time-based expiration and manual refresh
- **Fallback Strategy**: Direct OpenAI API call if cache miss

### Response Storage
- **Database Storage**: Store generated content in PostgreSQL
- **Content Types**: Fluency tables, recommendations, resources
- **Metadata**: Generation timestamp, model version, user context
- **Retrieval**: Fast lookup for similar role/industry combinations

### Performance Optimization
- **Response Time**: < 2 seconds for cached content, < 5 seconds for new generation
- **Cache Hit Rate**: Target 80%+ cache hit rate for common role/industry combinations
- **Cost Optimization**: Minimize OpenAI API calls through intelligent caching
- **Quality Assurance**: Human review of AI-generated content before serving

## Content Strategy

### Fluency Level Definitions

#### Unacceptable Level
- No AI tool usage or understanding
- Resistance to AI adoption
- Manual processes only
- No AI-related learning

#### Capable Level
- Basic AI tool usage (ChatGPT, Copilot)
- Understanding of AI concepts
- Simple prompt engineering
- Basic AI tool evaluation

#### Adoptive Level
- Integrated AI workflows
- Advanced prompt engineering
- AI tool selection and optimization
- Team knowledge sharing

#### Transformative Level
- AI-first approach to work
- Custom AI solutions development
- AI strategy and leadership
- Innovation and thought leadership

### Content Curation Strategy

#### Learning Resources
- **Beginner**: AI fundamentals, basic tool tutorials
- **Intermediate**: Advanced techniques, workflow integration
- **Advanced**: Custom solutions, leadership skills

#### Example Projects
- **Role-Specific**: Tailored to job function
- **Industry-Specific**: Relevant use cases
- **Progressive Difficulty**: Building complexity
- **Measurable Outcomes**: Clear success criteria

## Implementation Phases

### Phase 1: Core MVP (Months 1-3)
- Role-based fluency table generation
- Core learning resource library
- Individual user experience
- Basic bookmarking functionality

### Phase 2: Advanced Features (Months 4-6)
- Enhanced resource library
- Advanced search and filtering
- User analytics and insights
- Social sharing features

### Phase 3: AI-Powered Features (Months 7-9)
- AI-powered recommendations
- Advanced analytics
- Social learning features
- Integration capabilities

## Success Metrics

### User Engagement
- **Table Generation Rate**: > 90% of visitors generate tables
- **Resource Usage**: Average 5+ resources per user
- **Return Visits**: 60% monthly return rate
- **Bookmarking Activity**: 70% users bookmark resources

### Learning Outcomes
- **Skill Advancement**: 50% users advance one fluency level
- **Project Completion**: 40% users complete example projects
- **Knowledge Sharing**: 30% users share resources with team
- **User Satisfaction**: 4.5+ star rating from users

## Risk Assessment

### Technical Risks
- **Data Security**: Breach or unauthorized access
- **Performance**: Slow response times or downtime
- **Scalability**: Inability to handle user growth
- **Integration**: Third-party service failures

### Mitigation Strategies
- **Security**: Regular audits and penetration testing
- **Performance**: Load testing and optimization
- **Scalability**: Auto-scaling and monitoring
- **Integration**: Fallback systems and error handling

## Docker Deployment

### Container Architecture
- **Frontend Container**: React application with Nginx
- **Backend Container**: Node.js/Express API server
- **Database Container**: PostgreSQL with persistent volumes
- **Cache Container**: Redis for caching
- **Reverse Proxy**: Nginx for load balancing and SSL termination

### Docker Requirements
- **Docker Engine**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Multi-stage Builds**: Optimized container images
- **Health Checks**: Container health monitoring
- **Volume Management**: Persistent data storage

### Container Configuration
- **Base Images**: Alpine Linux for minimal size
- **Security**: Non-root user execution
- **Resource Limits**: CPU and memory constraints
- **Network Isolation**: Separate networks for services
- **Secrets Management**: Secure handling of sensitive data

### Development Environment
- **Local Development**: Docker Compose for local setup
- **Hot Reloading**: Development containers with volume mounting
- **Database Seeding**: Automated database initialization
- **Environment Variables**: Configuration management

### Production Deployment
- **Container Registry**: Docker Hub or AWS ECR
- **Orchestration**: Kubernetes or Docker Swarm
- **Load Balancing**: Nginx reverse proxy
- **SSL Termination**: HTTPS support
- **Monitoring**: Container health and performance monitoring

### Docker Compose Services
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [backend]
  
  backend:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/ai_fluency
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis]
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=ai_fluency
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes: [postgres_data:/var/lib/postgresql/data]
  
  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]
  
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    depends_on: [frontend, backend]

volumes:
  postgres_data:
  redis_data:
```

### Performance Requirements
- **Container Startup**: < 30 seconds
- **Memory Usage**: < 512MB per container
- **CPU Usage**: < 1 core per container
- **Disk I/O**: Optimized for container storage
- **Network Latency**: < 100ms between containers