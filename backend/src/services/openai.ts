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

// Note: ResourceRecommendation interface removed - not used

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
  async generateFluencyTable(roleTitle: string, industry: string, context?: string): Promise<FluencyTable> {
    const prompt = this.buildFluencyTablePrompt(roleTitle, industry, context);
    
    try {
      // Determine the correct parameter based on model
      const isGPT5 = config.openai.model.includes('gpt-5');
      const requestParams: any = {
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
        temperature: config.openai.temperature,
      };

      // Use the correct parameter based on model
      if (isGPT5) {
        requestParams.max_completion_tokens = config.openai.maxTokens;
      } else {
        requestParams.max_tokens = config.openai.maxTokens;
      }

      const completion = await openai.chat.completions.create(requestParams);

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

  // Note: Resource recommendations and learning path methods removed - not used

  private buildFluencyTablePrompt(roleTitle: string, industry: string, context?: string): string {
    const contextSection = context ? `

ADDITIONAL CONTEXT:
The user has provided additional context about their specific role: "${context}"

Please incorporate this context into the fluency assessment to make it more relevant and specific to their actual responsibilities and work environment.` : '';

    return `
Generate a comprehensive AI fluency assessment table for a ${roleTitle} in the ${industry} industry.${contextSection}

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
- Career progression implications${context ? `
- The specific context provided by the user` : ''}

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

  // Note: Resource recommendation and learning path prompt methods removed - not used

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

  // Note: Resource recommendation and learning path parsing methods removed - not used

  /**
   * Generate job-role-specific prompts organized by categories
   */
  async generateJobPrompts(roleTitle: string, industry: string, context?: string): Promise<JobPrompts> {
    const prompt = this.buildJobPromptsPrompt(roleTitle, industry, context);
    
    try {
      const isGPT5 = config.openai.model.includes('gpt-5');
      const requestParams: any = {
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI prompt engineering expert. Generate practical, useful prompts organized by categories that are specifically tailored to different job roles and industries. Focus on real-world applications and actionable prompts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.openai.temperature,
      };

      if (isGPT5) {
        requestParams.max_completion_tokens = config.openai.maxTokens;
      } else {
        requestParams.max_tokens = config.openai.maxTokens;
      }

      const completion = await openai.chat.completions.create(requestParams);

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseJobPromptsResponse(response, roleTitle, industry);
    } catch (error) {
      console.error('Error generating job prompts:', error);
      throw new Error('Failed to generate job prompts');
    }
  }

  private buildJobPromptsPrompt(roleTitle: string, industry: string, context?: string): string {
    const contextSection = context ? `

ADDITIONAL CONTEXT:
The user has provided additional context about their specific role: "${context}"

Please incorporate this context into the prompt suggestions to make them more relevant and specific to their actual responsibilities and work environment.` : '';

    return `
Generate a comprehensive collection of AI prompts for a ${roleTitle} in the ${industry} industry.${contextSection}

Create multiple categories of prompts (at least 4-6 categories) that would be useful for this job role. Examples of categories might include:
- Daily Tasks & Productivity
- Problem Solving & Analysis
- Communication & Writing
- Research & Learning
- Strategy & Planning
- Data Analysis & Reporting
- Creative & Design
- Technical & Development
- Management & Leadership
- Customer Service & Support

For each category, provide:
- A clear category name
- A brief description of why this category is relevant for this role
- 3-5 example prompts that are specific, actionable, and useful for this job role

Focus on practical, real-world prompts that someone in this role would actually use. Make the prompts specific to the ${roleTitle} role in the ${industry} industry.${context ? `
- Incorporate the specific context provided by the user` : ''}

Format the response as a JSON object with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Why this category is relevant",
      "prompts": [
        "Example prompt 1",
        "Example prompt 2",
        "Example prompt 3"
      ]
    }
  ]
}
`;
  }

  private parseJobPromptsResponse(response: string, roleTitle: string, industry: string): JobPrompts {
    try {
      const parsed = JSON.parse(response);
      return {
        roleTitle,
        industry,
        categories: parsed.categories || [],
        generatedAt: new Date().toISOString(),
        cached: false
      };
    } catch (error) {
      console.error('Error parsing job prompts response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }
}

export interface PromptCategory {
  name: string;
  description: string;
  prompts: string[];
}

export interface JobPrompts {
  roleTitle: string;
  industry: string;
  categories: PromptCategory[];
  generatedAt: string;
  cached: boolean;
}
