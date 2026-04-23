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

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const MAX_TOKENS = 4000;

async function chat(system: string, user: string): Promise<string> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_completion_tokens: MAX_TOKENS,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  const choice = completion.choices[0];
  const content = choice?.message?.content;
  if (!content) throw new Error("No response from OpenAI");
  if (choice.finish_reason === "length") {
    throw new Error(
      "Response was truncated — try a shorter role title or reduce team size"
    );
  }
  return content;
}

function extractJson(raw: string): unknown {
  // Strip markdown code fences if present (response_format: json_object usually prevents this)
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
