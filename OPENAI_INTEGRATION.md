# OpenAI Integration Guide

This guide explains how to set up and use the OpenAI integration for AI Fluency for Teams.

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   ./setup-openai.sh
   ```

2. **Get your OpenAI API key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

3. **Configure your environment:**
   - Open `backend/.env`
   - Replace `your_openai_api_key_here` with your actual API key

4. **Start the application:**
   ```bash
   ./start-app.sh
   ```

## 🔧 Features

### AI-Powered Fluency Tables
- **Personalized Content**: Tables are generated specifically for the user's role and industry
- **Dynamic Criteria**: Each fluency level includes role-specific criteria and examples
- **Industry Context**: Content is tailored to the specific industry context
- **Real-world Examples**: Practical examples that users can relate to

### Intelligent Resource Recommendations
- **Personalized Suggestions**: Resources are recommended based on role, industry, and current fluency level
- **Relevance Scoring**: Each recommendation includes a relevance score and explanation
- **Progressive Learning**: Resources help users progress to the next fluency level
- **Quality Curation**: Focus on high-quality, actionable resources

### Custom Learning Paths
- **Step-by-step Guidance**: Structured learning paths from current to target fluency level
- **Timeline Estimates**: Realistic timelines for skill development
- **Milestone Tracking**: Clear milestones to measure progress
- **Industry-specific Considerations**: Paths consider industry-specific requirements

### Smart Caching
- **Cost Optimization**: Reduces API calls by caching generated content
- **Performance**: Faster response times for cached content
- **Configurable TTL**: Adjustable cache expiration times
- **Redis Integration**: Scalable caching with Redis

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Application Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Caching Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# Security
JWT_SECRET=your_jwt_secret_here
API_RATE_LIMIT=100
```

### OpenAI Model Configuration

- **Model**: `gpt-4` (recommended) or `gpt-3.5-turbo` (faster, cheaper)
- **Max Tokens**: `2000` (adjust based on your needs)
- **Temperature**: `0.7` (balance between creativity and consistency)

### Caching Configuration

- **TTL**: `3600` seconds (1 hour) - how long to cache generated content
- **Redis**: Required for caching (fallback to memory if unavailable)

## 📡 API Endpoints

### AI-Powered Endpoints

#### Generate Fluency Table
```http
POST /api/fluency-table
Content-Type: application/json

{
  "roleTitle": "Software Engineer",
  "industry": "Technology"
}
```

#### Get Resource Recommendations
```http
POST /api/resources/recommendations
Content-Type: application/json

{
  "roleTitle": "Software Engineer",
  "industry": "Technology",
  "currentLevel": "Capable"
}
```

#### Generate Learning Path
```http
POST /api/learning-path
Content-Type: application/json

{
  "roleTitle": "Software Engineer",
  "industry": "Technology",
  "currentLevel": "Capable",
  "targetLevel": "Adoptive"
}
```

### Cache Management

#### Get Cache Statistics
```http
GET /api/cache/stats
```

#### Clear Cache
```http
DELETE /api/cache
```

## 🔒 Security Features

### API Key Management
- **Environment Variables**: API keys stored securely in environment variables
- **No Hardcoding**: Keys are never committed to version control
- **Validation**: Environment validation on startup

### Rate Limiting
- **Request Limits**: Configurable rate limiting per IP
- **Window-based**: 15-minute windows with configurable limits
- **Headers**: Standard rate limit headers included

### Input Validation
- **Joi Schemas**: Comprehensive input validation
- **Error Handling**: Detailed error messages for validation failures
- **Sanitization**: Input sanitization to prevent injection attacks

## 💰 Cost Management

### Caching Strategy
- **Intelligent Caching**: Cache generated content to reduce API calls
- **TTL Management**: Configurable cache expiration
- **Cache Keys**: Structured cache keys for efficient retrieval

### API Optimization
- **Prompt Engineering**: Optimized prompts for better results with fewer tokens
- **Response Parsing**: Efficient JSON parsing and validation
- **Error Handling**: Graceful fallbacks to reduce unnecessary API calls

### Monitoring
- **Cache Statistics**: Monitor cache hit rates and memory usage
- **API Usage**: Track API calls and costs
- **Performance Metrics**: Monitor response times and error rates

## 🚨 Troubleshooting

### Common Issues

#### OpenAI API Key Not Set
```
⚠️  Missing required environment variables: OPENAI_API_KEY
```
**Solution**: Add your API key to `backend/.env`

#### Redis Connection Failed
```
Redis connection error: connect ECONNREFUSED
```
**Solution**: Start Redis with `docker run -d --name ai-fluency-redis -p 6379:6379 redis:7-alpine`

#### Rate Limit Exceeded
```
Too many requests from this IP, please try again later.
```
**Solution**: Wait for the rate limit window to reset or increase the limit in configuration

#### OpenAI API Error
```
Failed to generate fluency table
```
**Solution**: Check your API key, billing status, and model availability

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

### Fallback Behavior

The application gracefully falls back to mock data if:
- OpenAI API is unavailable
- API key is invalid
- Rate limits are exceeded
- Network issues occur

## 📊 Monitoring and Analytics

### Cache Performance
- **Hit Rate**: Percentage of requests served from cache
- **Memory Usage**: Redis memory consumption
- **Key Count**: Number of cached items

### API Usage
- **Request Count**: Total API requests made
- **Error Rate**: Percentage of failed requests
- **Response Time**: Average response time

### Cost Tracking
- **Token Usage**: Track tokens consumed per request
- **Cost Estimation**: Approximate costs based on usage
- **Optimization Suggestions**: Recommendations for cost reduction

## 🔄 Updates and Maintenance

### Updating Prompts
- Edit prompt templates in `backend/src/services/openai.ts`
- Test with different roles and industries
- Monitor response quality and adjust as needed

### Cache Management
- Monitor cache performance
- Adjust TTL based on usage patterns
- Clear cache when updating prompts

### Model Updates
- Test new OpenAI models
- Compare performance and costs
- Update configuration as needed

## 📚 Best Practices

### Prompt Engineering
- **Be Specific**: Include role and industry context
- **Use Examples**: Provide clear examples in prompts
- **Iterate**: Test and refine prompts based on results

### Caching Strategy
- **Cache Key Design**: Use consistent, descriptive cache keys
- **TTL Selection**: Balance freshness with performance
- **Cache Warming**: Pre-populate cache for common combinations

### Error Handling
- **Graceful Degradation**: Always provide fallbacks
- **User Feedback**: Clear error messages for users
- **Logging**: Comprehensive logging for debugging

### Security
- **API Key Rotation**: Regularly rotate API keys
- **Access Control**: Implement proper access controls
- **Monitoring**: Monitor for suspicious activity

## 🆘 Support

If you encounter issues:

1. **Check the logs**: Look for error messages in the console
2. **Verify configuration**: Ensure all environment variables are set
3. **Test connectivity**: Verify OpenAI API and Redis connectivity
4. **Check documentation**: Review this guide and troubleshooting section
5. **Create an issue**: Report bugs or request features

## 🎯 Future Enhancements

- **Multi-language Support**: Generate content in different languages
- **Custom Models**: Fine-tuned models for specific industries
- **Advanced Analytics**: Detailed usage and performance analytics
- **A/B Testing**: Test different prompts and configurations
- **Integration APIs**: Connect with other learning platforms
