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

export interface TeamMember {
  id: string;
  name: string;
  roleTitle: string;
}

export interface TeamMemberResult {
  member: TeamMember;
  assessment: FluencyTable;
}

export interface TeamMemberFailure {
  member: TeamMember;
  error: string;
}

export interface TeamAssessment {
  industry: string;
  context: string;
  results: TeamMemberResult[];
  failures?: TeamMemberFailure[];
  generatedAt: string;
}
