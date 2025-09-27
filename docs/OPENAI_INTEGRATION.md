# OpenAI Integration Guide

This guide explains how to set up and use the OpenAI GPT-4.1 integration for AI Fluency for Teams.

## 🚀 Quick Start

1. **Get your OpenAI API key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

2. **Configure your environment:**
   - Open `backend/.env`
   - Replace `your_openai_api_key_here` with your actual API key
   - Ensure `OPENAI_MODEL=gpt-4.1` is set

3. **Start the application:**
   ```bash
   ./start-app.sh
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔧 Features

### AI-Powered Fluency Tables
- **Personalized Content**: Tables are generated specifically for the user's role and industry
- **Dynamic Criteria**: Each fluency level includes role-specific criteria and examples
- **Industry Context**: Content is tailored to the specific industry context
- **Real-world Examples**: Practical examples that users can relate to

### Curated Learning Resources
- **17+ High-Quality Resources**: Curated collection of learning materials
- **Multiple Categories**: Courses, tutorials, documentation, guides
- **Difficulty Levels**: Beginner to advanced resources
- **Time Estimates**: Clear time commitments for each resource
- **Direct Links**: Easy access to external learning materials

### Context-Aware Assessments
- **Additional Context Input**: Users can provide specific role context
- **Personalized Prompts**: AI generates content based on user context
- **Industry-Specific Examples**: Real-world examples relevant to user's industry
- **Role-Specific Criteria**: Assessment criteria tailored to specific job roles

### Database Caching
- **Cost Optimization**: Reduces API calls by caching generated content
- **Performance**: Faster response times for cached content
- **SQLite Integration**: Lightweight database caching system
- **Automatic Cache Management**: Intelligent cache expiration and cleanup

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Application Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_here
API_RATE_LIMIT=100
```

### OpenAI Model Configuration

- **Model**: `gpt-4.1` (current default) - supports both `max_tokens` and `max_completion_tokens`
- **Max Tokens**: `2000` (adjust based on your needs)
- **Temperature**: `0.7` (balance between creativity and consistency)
- **Auto-Detection**: Automatically uses correct parameters for GPT-4 vs GPT-5 models

### Database Caching Configuration

- **SQLite Database**: `backend/data/ai_fluency.db`
- **Automatic Caching**: Generated fluency tables are automatically cached
- **Cache Persistence**: Database persists between application restarts
- **No Additional Setup**: No Redis or external dependencies required

## 📡 API Endpoints

### AI-Powered Endpoints

#### Generate Fluency Table
```http
POST /api/fluency-table
Content-Type: application/json

{
  "roleTitle": "Software Engineer",
  "industry": "Technology",
  "context": "I work on React applications and use AI tools for code generation"
}
```

**Response**: Complete fluency table with 4 levels (Unskilled → Capable → Adoptive → Transformative)

#### Get Cached Fluency Table
```http
GET /api/fluency-table/:roleId/:industry
```

**Example**: `GET /api/fluency-table/software-engineer/technology`

### Resource Endpoints

#### Get Learning Resources
```http
GET /api/resources
```

**Response**: Array of 17+ curated learning resources with metadata

#### Get Industries
```http
GET /api/industries
```

**Response**: Array of available industries

### Health Check

#### Application Status
```http
GET /health
```

**Response**: Application health status and timestamp

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

### Database Caching Strategy
- **Automatic Caching**: All generated fluency tables are automatically cached
- **Persistent Storage**: SQLite database persists between application restarts
- **Cache Hit Optimization**: Identical role/industry combinations served from cache
- **Cost Reduction**: Significant reduction in OpenAI API calls through intelligent caching

### API Optimization
- **Prompt Engineering**: Optimized prompts for better results with fewer tokens
- **Response Parsing**: Efficient JSON parsing and validation
- **Error Handling**: Graceful fallbacks to reduce unnecessary API calls
- **Model Compatibility**: Automatic parameter detection for GPT-4 vs GPT-5 models

### Performance Monitoring
- **Database Statistics**: Monitor cache hit rates and database performance
- **API Usage**: Track OpenAI API calls and costs
- **Response Times**: Monitor fluency table generation performance
- **Error Tracking**: Comprehensive error logging and monitoring

## 🎯 Current Implementation Status

### ✅ Completed Features
- **GPT-4.1 Integration**: Full support for OpenAI GPT-4.1 model
- **Database Caching**: SQLite-based caching system for cost optimization
- **Context-Aware Generation**: Support for additional user context input
- **Logo Integration**: Professional branding throughout the application
- **Modern UI**: Material-UI with dark/light mode support
- **One-Command Setup**: `./start-app.sh` for instant application startup

### 🔧 Technical Implementation
- **Model Compatibility**: Automatic detection of GPT-4 vs GPT-5 parameter requirements
- **Error Handling**: Comprehensive error management and user feedback
- **Rate Limiting**: API protection with configurable limits
- **Input Validation**: Joi schemas for request validation
- **Security**: CORS, helmet, and input sanitization

### 📊 Performance Metrics
- **Cache Hit Rate**: High cache hit rate for repeated role/industry combinations
- **Response Time**: Fast response times for cached content
- **Cost Optimization**: Significant reduction in OpenAI API costs through caching
- **Reliability**: Robust error handling and fallback mechanisms

## 🚨 Troubleshooting

### Common Issues

#### OpenAI API Key Not Set
```
⚠️  Missing required environment variables: OPENAI_API_KEY
```
**Solution**: Add your API key to `backend/.env`

#### Database Connection Failed
```
Database connection error: SQLITE_CANTOPEN
```
**Solution**: Ensure the `backend/data/` directory exists and is writable. The database will be created automatically on first run.

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
