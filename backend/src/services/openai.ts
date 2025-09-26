import OpenAI from 'openai';
import { config } from '../config/environment';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export interface FluencyLevel {
  level: string;
  criteria: string[];
  examples: string[];
  tools: string[];
  skills: string[];
}

export interface FluencyTable {
  roleId: string;
  industry: string;
  levels: FluencyLevel[];
  generatedAt: string;
  cached: boolean;
}

export interface ResourceRecommendation {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  url: string;
  description: string;
  relevanceScore: number;
  whyRecommended: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  
  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  /**
   * Generate a personalized AI fluency table for a specific role and industry
   */
  async generateFluencyTable(roleTitle: string, industry: string): Promise<FluencyTable> {
    const prompt = this.buildFluencyTablePrompt(roleTitle, industry);
    
    try {
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI fluency assessment expert. Generate detailed, practical fluency levels for different roles and industries. Focus on real-world applications and specific skills.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseFluencyTableResponse(response, roleTitle, industry);
    } catch (error) {
      console.error('Error generating fluency table:', error);
      throw new Error('Failed to generate fluency table');
    }
  }

  /**
   * Generate personalized resource recommendations
   */
  async generateResourceRecommendations(
    roleTitle: string, 
    industry: string, 
    currentLevel: string
  ): Promise<ResourceRecommendation[]> {
    const prompt = this.buildResourceRecommendationPrompt(roleTitle, industry, currentLevel);
    
    try {
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI learning consultant. Recommend specific, actionable learning resources based on the user\'s role, industry, and current AI fluency level. Focus on practical, high-quality resources.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseResourceRecommendationsResponse(response);
    } catch (error) {
      console.error('Error generating resource recommendations:', error);
      throw new Error('Failed to generate resource recommendations');
    }
  }

  /**
   * Generate a personalized learning path
   */
  async generateLearningPath(
    roleTitle: string, 
    industry: string, 
    currentLevel: string,
    targetLevel: string
  ): Promise<{
    path: string[];
    timeline: string;
    milestones: string[];
  }> {
    const prompt = this.buildLearningPathPrompt(roleTitle, industry, currentLevel, targetLevel);
    
    try {
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI learning path expert. Create structured, step-by-step learning paths that help users progress from their current AI fluency level to their target level.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseLearningPathResponse(response);
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  private buildFluencyTablePrompt(roleTitle: string, industry: string): string {
    return `
Generate a comprehensive AI fluency assessment table for a ${roleTitle} in the ${industry} industry.

Create 4 fluency levels:
1. Unskilled - No AI knowledge or usage
2. Capable - Basic AI tool usage and understanding
3. Adoptive - Integrated AI workflows and advanced usage
4. Transformative - AI-first approach and innovation leadership

For each level, provide:
- Specific criteria that define this level
- Real-world examples of what this looks like in practice
- Relevant AI tools and platforms
- Required skills and competencies

Focus on practical, actionable insights specific to ${roleTitle} roles in ${industry}. Consider:
- Industry-specific AI applications
- Role-specific AI use cases
- Common challenges and opportunities
- Career progression implications

Format the response as a JSON object with this structure:
{
  "levels": [
    {
      "level": "Unskilled",
      "criteria": ["criterion1", "criterion2"],
      "examples": ["example1", "example2"],
      "tools": ["tool1", "tool2"],
      "skills": ["skill1", "skill2"]
    }
  ]
}
`;
  }

  private buildResourceRecommendationPrompt(
    roleTitle: string, 
    industry: string, 
    currentLevel: string
  ): string {
    return `
Recommend 5-8 specific learning resources for a ${roleTitle} in the ${industry} industry who is currently at the "${currentLevel}" AI fluency level.

Focus on:
- Resources that help them progress to the next fluency level
- Industry-specific AI applications
- Role-relevant skills and tools
- Mix of beginner-friendly and advanced resources

For each resource, provide:
- Title and description
- Type (course, tutorial, guide, documentation, etc.)
- Difficulty level (beginner, intermediate, advanced)
- Estimated time to complete
- Why it's relevant for their role and industry
- A realistic URL (use actual learning platforms)

Format as JSON array:
[
  {
    "title": "Resource Title",
    "type": "course",
    "difficulty": "beginner",
    "estimatedTime": 4,
    "url": "https://example.com/resource",
    "description": "Detailed description",
    "relevanceScore": 0.9,
    "whyRecommended": "Specific reason for this role/industry"
  }
]
`;
  }

  private buildLearningPathPrompt(
    roleTitle: string, 
    industry: string, 
    currentLevel: string,
    targetLevel: string
  ): string {
    return `
Create a personalized learning path for a ${roleTitle} in the ${industry} industry to progress from "${currentLevel}" to "${targetLevel}" AI fluency level.

Include:
- 5-7 specific learning steps
- Realistic timeline
- Key milestones to track progress
- Industry-specific considerations

Format as JSON:
{
  "path": ["step1", "step2", "step3"],
  "timeline": "3-6 months",
  "milestones": ["milestone1", "milestone2"]
}
`;
  }

  private parseFluencyTableResponse(response: string, roleTitle: string, industry: string): FluencyTable {
    try {
      const parsed = JSON.parse(response);
      return {
        roleId: roleTitle.toLowerCase().replace(/\s+/g, '-'),
        industry,
        levels: parsed.levels || [],
        generatedAt: new Date().toISOString(),
        cached: false
      };
    } catch (error) {
      console.error('Error parsing fluency table response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  private parseResourceRecommendationsResponse(response: string): ResourceRecommendation[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.map((resource: any, index: number) => ({
        id: `ai-gen-${index + 1}`,
        title: resource.title || 'Untitled Resource',
        type: resource.type || 'guide',
        difficulty: resource.difficulty || 'beginner',
        estimatedTime: resource.estimatedTime || 1,
        url: resource.url || '#',
        description: resource.description || 'No description available',
        relevanceScore: resource.relevanceScore || 0.5,
        whyRecommended: resource.whyRecommended || 'Recommended for your role and industry'
      }));
    } catch (error) {
      console.error('Error parsing resource recommendations response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  private parseLearningPathResponse(response: string): {
    path: string[];
    timeline: string;
    milestones: string[];
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        path: parsed.path || [],
        timeline: parsed.timeline || '3-6 months',
        milestones: parsed.milestones || []
      };
    } catch (error) {
      console.error('Error parsing learning path response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }
}
