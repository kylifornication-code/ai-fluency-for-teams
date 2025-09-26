import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config, validateEnvironment } from './config/environment';
import { OpenAIService } from './services/openai';
import { CacheService } from './services/cache';
import { validateRequest, fluencyTableSchema, resourceRecommendationsSchema, learningPathSchema, bookmarkSchema } from './validation/schemas';

// Validate environment variables
validateEnvironment();

const app = express();
const PORT = config.app.port;

// Initialize services
const openaiService = OpenAIService.getInstance();
const cacheService = CacheService.getInstance();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.security.apiRateLimit,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MVP API routes
app.get('/api/roles', (req, res) => {
  res.json([
    { id: '1', title: 'Software Engineer', industry: 'Technology' },
    { id: '2', title: 'Data Scientist', industry: 'Technology' },
    { id: '3', title: 'Product Manager', industry: 'Technology' },
    { id: '4', title: 'Marketing Manager', industry: 'Marketing' },
    { id: '5', title: 'Sales Representative', industry: 'Sales' }
  ]);
});

app.get('/api/industries', (req, res) => {
  res.json([
    'Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Sales',
    'Education',
    'Manufacturing',
    'Retail'
  ]);
});

// AI-powered fluency table generation
app.post('/api/fluency-table', validateRequest(fluencyTableSchema), async (req, res) => {
  try {
    const { roleTitle, industry } = req.validatedData;
    
    // Check cache first
    const cached = await cacheService.getFluencyTable(roleTitle, industry);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate with OpenAI
    const fluencyTable = await openaiService.generateFluencyTable(roleTitle, industry);
    
    // Cache the result
    await cacheService.setFluencyTable(roleTitle, industry, fluencyTable);
    
    res.json(fluencyTable);
  } catch (error) {
    console.error('Error generating fluency table:', error);
    res.status(500).json({ 
      error: 'Failed to generate fluency table',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Fallback to mock data if OpenAI is not available
app.get('/api/fluency-table/:roleId/:industry', (req, res) => {
  const { roleId, industry } = req.params;
  
  // Mock fluency table response (fallback)
  res.json({
    roleId,
    industry,
    levels: [
      {
        level: 'Unskilled',
        criteria: ['No AI tool usage', 'Resistance to AI adoption'],
        examples: ['Manual processes only', 'No AI learning'],
        tools: [],
        skills: []
      },
      {
        level: 'Capable',
        criteria: ['Basic AI tool usage', 'Understanding AI concepts'],
        examples: ['Using ChatGPT', 'Simple prompt engineering'],
        tools: ['ChatGPT', 'GitHub Copilot'],
        skills: ['Basic prompting', 'Tool evaluation']
      },
      {
        level: 'Adoptive',
        criteria: ['Integrated AI workflows', 'Advanced prompt engineering'],
        examples: ['Custom AI solutions', 'Team knowledge sharing'],
        tools: ['Multiple AI tools', 'Custom integrations'],
        skills: ['Workflow integration', 'Advanced prompting']
      },
      {
        level: 'Transformative',
        criteria: ['AI-first approach', 'Custom AI solutions development'],
        examples: ['AI strategy leadership', 'Innovation and thought leadership'],
        tools: ['Custom AI models', 'Advanced platforms'],
        skills: ['AI strategy', 'Leadership', 'Innovation']
      }
    ],
    generatedAt: new Date().toISOString(),
    cached: false
  });
});

app.get('/api/resources', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'AI for Everyone',
      type: 'course',
      difficulty: 'beginner',
      estimatedTime: 4,
      url: 'https://www.coursera.org/learn/ai-for-everyone',
      description: 'Comprehensive introduction to AI concepts, terminology, and applications'
    },
    {
      id: '2',
      title: 'Machine Learning Crash Course',
      type: 'course',
      difficulty: 'beginner-intermediate',
      estimatedTime: 6,
      url: 'https://developers.google.com/machine-learning/crash-course',
      description: 'Practical introduction to machine learning concepts and tools'
    },
    {
      id: '3',
      title: 'ChatGPT Complete Guide',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 2,
      url: 'https://openai.com/blog/chatgpt',
      description: 'Learn to use ChatGPT effectively for various tasks'
    },
    {
      id: '4',
      title: 'GitHub Copilot Documentation',
      type: 'documentation',
      difficulty: 'beginner',
      estimatedTime: 1,
      url: 'https://docs.github.com/en/copilot',
      description: 'Official guide to using GitHub Copilot for coding assistance'
    },
    {
      id: '5',
      title: 'Microsoft Copilot for Microsoft 365',
      type: 'tutorial',
      difficulty: 'beginner',
      estimatedTime: 1.5,
      url: 'https://support.microsoft.com/en-us/copilot',
      description: 'Learn to use Copilot in Microsoft Office applications'
    },
    {
      id: '6',
      title: 'Prompt Engineering Guide',
      type: 'guide',
      difficulty: 'beginner-intermediate',
      estimatedTime: 3,
      url: 'https://www.promptingguide.ai/',
      description: 'Comprehensive guide to writing effective prompts for AI systems'
    },
    {
      id: '7',
      title: 'Advanced Prompt Engineering',
      type: 'course',
      difficulty: 'intermediate-advanced',
      estimatedTime: 4,
      url: 'https://learnprompting.org/',
      description: 'Advanced techniques for complex AI interactions'
    },
    {
      id: '8',
      title: 'AI Ethics: A Guide for Business Leaders',
      type: 'guide',
      difficulty: 'intermediate',
      estimatedTime: 2,
      url: 'https://www.ibm.com/artificial-intelligence/ethics',
      description: 'Understanding ethical considerations in AI implementation'
    },
    {
      id: '9',
      title: 'Responsible AI Practices',
      type: 'course',
      difficulty: 'intermediate',
      estimatedTime: 3,
      url: 'https://cloud.google.com/learn/responsible-ai',
      description: 'Best practices for implementing AI responsibly in organizations'
    },
    {
      id: '10',
      title: 'AI for Business Leaders',
      type: 'course',
      difficulty: 'beginner-intermediate',
      estimatedTime: 5,
      url: 'https://www.coursera.org/learn/ai-for-business',
      description: 'How AI can transform business operations and strategy'
    }
  ]);
});

// AI-powered resource recommendations
app.post('/api/resources/recommendations', validateRequest(resourceRecommendationsSchema), async (req, res) => {
  try {
    const { roleTitle, industry, currentLevel } = req.validatedData;
    
    // Check cache first
    const cached = await cacheService.getResourceRecommendations(roleTitle, industry, currentLevel);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate with OpenAI
    const recommendations = await openaiService.generateResourceRecommendations(roleTitle, industry, currentLevel);
    
    // Cache the result
    await cacheService.setResourceRecommendations(roleTitle, industry, currentLevel, recommendations);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating resource recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate resource recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// AI-powered learning path generation
app.post('/api/learning-path', validateRequest(learningPathSchema), async (req, res) => {
  try {
    const { roleTitle, industry, currentLevel, targetLevel } = req.validatedData;
    
    // Check cache first
    const cached = await cacheService.getLearningPath(roleTitle, industry, currentLevel, targetLevel);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate with OpenAI
    const learningPath = await openaiService.generateLearningPath(roleTitle, industry, currentLevel, targetLevel);
    
    // Cache the result
    await cacheService.setLearningPath(roleTitle, industry, currentLevel, targetLevel, learningPath);
    
    res.json(learningPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ 
      error: 'Failed to generate learning path',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cache management endpoints
app.get('/api/cache/stats', async (req, res) => {
  try {
    const stats = await cacheService.getCacheStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

app.delete('/api/cache', async (req, res) => {
  try {
    await cacheService.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

app.post('/api/bookmarks', validateRequest(bookmarkSchema), (req, res) => {
  const { resourceId, userId } = req.validatedData;
  res.json({ 
    success: true, 
    message: 'Resource bookmarked successfully',
    bookmarkId: `bookmark_${Date.now()}`
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
