import { NextRequest, NextResponse } from "next/server";
import { generateJobPrompts } from "@/lib/openai";
import { getCache, setCache, cacheKey } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roleTitle, industry, context } = body;

    if (!roleTitle?.trim() || !industry?.trim()) {
      return NextResponse.json(
        { error: "roleTitle and industry are required" },
        { status: 400 }
      );
    }

    if (roleTitle.length > 100 || industry.length > 100) {
      return NextResponse.json(
        { error: "Input too long" },
        { status: 400 }
      );
    }

    const key = cacheKey("prompts", roleTitle, industry, context);
    const cached = getCache(key);
    if (cached) {
      return NextResponse.json({ ...JSON.parse(cached), cached: true });
    }

    const result = await generateJobPrompts(roleTitle.trim(), industry.trim(), context?.trim());
    setCache(key, JSON.stringify(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error("job-prompts error:", error);
    return NextResponse.json(
      { error: "Failed to generate job prompts" },
      { status: 500 }
    );
  }
}
