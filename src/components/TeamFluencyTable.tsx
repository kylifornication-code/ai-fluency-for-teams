"use client";

import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Check,
  Users,
} from "lucide-react";
import type { TeamAssessment, TeamMemberResult } from "@/types";
import { cn } from "@/lib/utils";
import { FluencyTable } from "./FluencyTable";
import { exportTeamAssessmentToPdf } from "@/lib/pdf";
import { ExportPdfMenu } from "./ExportPdfMenu";

const LEVEL_ORDER = ["Unskilled", "Capable", "Adoptive", "Transformative"] as const;
type Level = (typeof LEVEL_ORDER)[number];

const LEVEL_STYLES: Record<
  Level,
  {
    dot: string;
    text: string;
    bg: string;
    border: string;
    bar: string;
    ring: string;
  }
> = {
  Unskilled: {
    dot: "bg-red-400",
    text: "text-red-300",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    bar: "bg-red-400",
    ring: "ring-red-400",
  },
  Capable: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    bar: "bg-amber-400",
    ring: "ring-amber-400",
  },
  Adoptive: {
    dot: "bg-blue-400",
    text: "text-blue-300",
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
    bar: "bg-blue-400",
    ring: "ring-blue-400",
  },
  Transformative: {
    dot: "bg-indigo-400",
    text: "text-indigo-300",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/40",
    bar: "bg-indigo-400",
    ring: "ring-indigo-400",
  },
};

interface Props {
  data: TeamAssessment;
}

export function TeamFluencyTable({ data }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // member.id → selected level (null when not yet assessed)
  const [assessments, setAssessments] = useState<Record<string, Level | null>>(
    () =>
      Object.fromEntries(
        data.results.map((r) => [r.member.id, null])
      ) as Record<string, Level | null>
  );

  function toggleExpanded(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function setLevel(memberId: string, level: Level) {
    setAssessments((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === level ? null : level,
    }));
  }

  const distribution = LEVEL_ORDER.reduce<Record<Level, number>>(
    (acc, lvl) => {
      acc[lvl] = 0;
      return acc;
    },
    {} as Record<Level, number>
  );
  let assessedCount = 0;
  for (const lvl of Object.values(assessments)) {
    if (lvl) {
      distribution[lvl]++;
      assessedCount++;
    }
  }
  const totalMembers = data.results.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#6366f1]/10">
          <Users className="w-5 h-5 text-[#6366f1]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Team Assessment Overview
          </h2>
          <p className="text-[#64748b] text-sm">
            {totalMembers} role{totalMembers !== 1 ? "s" : ""} · {data.industry}
          </p>
        </div>
        <ExportPdfMenu
          onExport={(includedLevels) =>
            exportTeamAssessmentToPdf(data, assessments, { includedLevels })
          }
          className="ml-auto"
        />
      </div>

      {/* Partial failure notice */}
      {data.failures && data.failures.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl px-4 py-3 flex gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-amber-200">
            <p className="font-medium">
              {data.failures.length} of{" "}
              {data.results.length + data.failures.length} assessments could
              not be generated:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-300/80 text-xs">
              {data.failures.map((f) => (
                <li key={f.member.id}>
                  <span className="text-amber-200">{f.member.name}</span> (
                  {f.member.roleTitle}) — {f.error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Team distribution */}
      <div className="bg-[#1e293b] rounded-2xl p-5 flex flex-col gap-3 border border-[#334155]/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Team Distribution
          </h3>
          <p className="text-xs text-[#64748b]">
            {assessedCount} of {totalMembers} assessed
          </p>
        </div>

        {/* Stacked bar */}
        <div className="flex h-2 rounded-full overflow-hidden bg-[#0f172a]">
          {assessedCount === 0 ? (
            <div className="flex-1 bg-[#334155]/40" />
          ) : (
            LEVEL_ORDER.map((lvl) => {
              const pct = (distribution[lvl] / assessedCount) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={lvl}
                  className={cn("h-full", LEVEL_STYLES[lvl].bar)}
                  style={{ width: `${pct}%` }}
                />
              );
            })
          )}
        </div>

        {/* Counts per level */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LEVEL_ORDER.map((lvl) => {
            const style = LEVEL_STYLES[lvl];
            const count = distribution[lvl];
            return (
              <div
                key={lvl}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border",
                  count > 0
                    ? cn(style.bg, style.border)
                    : "bg-[#0f172a]/40 border-[#334155]/40"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                <span className="text-xs text-[#94a3b8]">{lvl}</span>
                <span
                  className={cn(
                    "ml-auto text-sm font-semibold tabular-nums",
                    count > 0 ? style.text : "text-[#475569]"
                  )}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {assessedCount < totalMembers && (
          <p className="text-xs text-[#64748b] mt-1">
            Click a level below for each team member to build your team snapshot.
          </p>
        )}
      </div>

      {/* Member table */}
      <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-[#334155]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Role
                </th>
                {LEVEL_ORDER.map((level) => (
                  <th
                    key={level}
                    className="text-center px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wider"
                  >
                    {level}
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {data.results.map((result) => (
                <MemberRow
                  key={result.member.id}
                  result={result}
                  selectedLevel={assessments[result.member.id] ?? null}
                  onSelectLevel={(lvl) => setLevel(result.member.id, lvl)}
                  isExpanded={expandedId === result.member.id}
                  onToggle={() => toggleExpanded(result.member.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MemberRow({
  result,
  selectedLevel,
  onSelectLevel,
  isExpanded,
  onToggle,
}: {
  result: TeamMemberResult;
  selectedLevel: Level | null;
  onSelectLevel: (lvl: Level) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className={cn(
          "transition-colors",
          isExpanded ? "bg-[#6366f1]/5" : "hover:bg-[#0f172a]/40"
        )}
      >
        <td className="px-5 py-3 text-white font-medium whitespace-nowrap">
          {result.member.name}
        </td>
        <td className="px-5 py-3 text-[#94a3b8] whitespace-nowrap">
          {result.member.roleTitle}
        </td>
        {LEVEL_ORDER.map((level) => {
          const style = LEVEL_STYLES[level];
          const isSelected = selectedLevel === level;
          return (
            <td key={level} className="text-center px-3 py-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLevel(level);
                }}
                aria-pressed={isSelected}
                aria-label={`Set ${result.member.name} to ${level}`}
                className={cn(
                  "w-8 h-8 rounded-full inline-flex items-center justify-center border transition-all",
                  isSelected
                    ? cn(
                        style.bg,
                        style.border,
                        "ring-2 ring-offset-2 ring-offset-[#1e293b]",
                        style.ring
                      )
                    : "border-[#334155] hover:border-[#475569] bg-[#0f172a]/50"
                )}
              >
                {isSelected ? (
                  <Check className={cn("w-4 h-4", style.text)} />
                ) : (
                  <span className={cn("w-2 h-2 rounded-full", style.dot, "opacity-40")} />
                )}
              </button>
            </td>
          );
        })}
        <td className="px-3 py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse rubric" : "Expand rubric"}
            className="p-1 rounded hover:bg-[#334155]/40 text-[#64748b] hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="px-5 py-4 bg-[#0f172a]/40">
            <FluencyTable data={result.assessment} showExport={false} />
          </td>
        </tr>
      )}
    </>
  );
}
