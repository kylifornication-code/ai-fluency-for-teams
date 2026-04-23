import OpenAI from "openai";
import type { FluencyTable, JobPrompts } from "@/types";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";
const MAX_TOKENS = 2000;

async function chat(system: string, user: string): Promise<string> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: MAX_TOKENS,
    temperature: 0.7,
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");
  return content;
}

function extractJson(raw: string): unknown {
  // Strip markdown code fences if present
  const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  return JSON.parse(match ? match[1] : raw);
}

export async function generateFluencyTable(
  roleTitle: string,
  industry: string,
  context?: string
): Promise<FluencyTable> {
  const contextSection = context
    ? `\n\nADDITIONAL CONTEXT: "${context}"\nIncorporate this into the assessment.`
    : "";

  const prompt = `Generate a comprehensive AI fluency assessment table for a ${roleTitle} in the ${industry} industry.${contextSection}

Create 4 fluency levels: Unskilled, Capable, Adoptive, Transformative.
For each level provide: criteria, real-world examples, AI tools, and required skills.
Focus on practical, role-specific AI applications in ${industry}.

Return ONLY valid JSON:
{
  "levels": [
    {
      "level": "Unskilled",
      "criteria": ["..."],
      "examples": ["..."],
      "tools": ["..."],
      "skills": ["..."]
    }
  ]
}`;

  const raw = await chat(
    "You are an AI fluency assessment expert. Generate detailed, practical fluency levels. Respond with valid JSON only.",
    prompt
  );

  const parsed = extractJson(raw) as { levels: FluencyTable["levels"] };
  return {
    roleId: roleTitle.toLowerCase().replace(/\s+/g, "-"),
    industry,
    levels: parsed.levels || [],
    generatedAt: new Date().toISOString(),
    cached: false,
  };
}

export async function generateJobPrompts(
  roleTitle: string,
  industry: string,
  context?: string
): Promise<JobPrompts> {
  const contextSection = context
    ? `\n\nADDITIONAL CONTEXT: "${context}"\nIncorporate this context into the prompts.`
    : "";

  const prompt = `Generate a comprehensive collection of AI prompts for a ${roleTitle} in the ${industry} industry.${contextSection}

Create 4-6 categories of prompts specific to this role. For each category provide:
- A clear name
- A brief description of its relevance
- 3-5 specific, actionable prompts

Return ONLY valid JSON:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Why relevant",
      "prompts": ["Prompt 1", "Prompt 2", "Prompt 3"]
    }
  ]
}`;

  const raw = await chat(
    "You are an AI prompt engineering expert. Generate practical, role-specific prompts. Respond with valid JSON only.",
    prompt
  );

  const parsed = extractJson(raw) as { categories: JobPrompts["categories"] };
  return {
    roleTitle,
    industry,
    categories: parsed.categories || [],
    generatedAt: new Date().toISOString(),
    cached: false,
  };
}
