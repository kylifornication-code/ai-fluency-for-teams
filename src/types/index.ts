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

export interface Resource {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  url: string;
  description: string;
}
