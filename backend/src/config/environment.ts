import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },
  
  // Application Configuration
  app: {
    port: parseInt(process.env.PORT || '5001'),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-secret-key-only'),
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100'),
  },
};

// Validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Please set these variables in your .env file or environment');
    console.warn('Copy env.example to .env and fill in the values');
  }

  // In production, require JWT_SECRET to be explicitly set
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('❌ ERROR: JWT_SECRET must be set in production environment');
      console.error('Please set JWT_SECRET in your .env file with a strong, random secret');
      process.exit(1);
    }
  }
};
