import { NextRequest, NextResponse } from "next/server";
import { generateFluencyTable } from "@/lib/openai";
import { getCache, setCache, cacheKey } from "@/lib/cache";
import type { TeamMember, TeamMemberResult } from "@/types";

const MAX_TEAM_SIZE = 20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { members, industry, context } = body as {
      members: TeamMember[];
      industry: string;
      context?: string;
    };

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    if (members.length > MAX_TEAM_SIZE) {
      return NextResponse.json(
        { error: `Maximum ${MAX_TEAM_SIZE} team members allowed` },
        { status: 400 }
      );
    }

    if (!industry?.trim()) {
      return NextResponse.json(
        { error: "Industry is required" },
        { status: 400 }
      );
    }

    for (const m of members) {
      if (!m.name?.trim() || !m.roleTitle?.trim()) {
        return NextResponse.json(
          { error: "Each team member needs a name and role title" },
          { status: 400 }
        );
      }
      if (m.name.length > 100 || m.roleTitle.length > 100) {
        return NextResponse.json(
          { error: "Name and role title must be under 100 characters" },
          { status: 400 }
        );
      }
    }

    const settled = await Promise.allSettled(
      members.map(async (member) => {
        const key = cacheKey("fluency", member.roleTitle, industry, context);
        const cached = getCache(key);

        if (cached) {
          return {
            member,
            assessment: { ...JSON.parse(cached), cached: true },
          };
        }

        const assessment = await generateFluencyTable(
          member.roleTitle.trim(),
          industry.trim(),
          context?.trim()
        );
        setCache(key, JSON.stringify(assessment));
        return { member, assessment };
      })
    );

    const results: TeamMemberResult[] = [];
    const failures: { member: TeamMember; error: string }[] = [];
    settled.forEach((outcome, idx) => {
      if (outcome.status === "fulfilled") {
        results.push(outcome.value);
      } else {
        const err =
          outcome.reason instanceof Error
            ? outcome.reason.message
            : "Unknown error";
        console.error("team-fluency member failed:", members[idx], err);
        failures.push({ member: members[idx], error: err });
      }
    });

    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            failures[0]?.error || "Failed to generate team assessment",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      industry,
      context: context || "",
      results,
      failures,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("team-fluency error:", error);
    return NextResponse.json(
      { error: "Failed to generate team assessment" },
      { status: 500 }
    );
  }
}
