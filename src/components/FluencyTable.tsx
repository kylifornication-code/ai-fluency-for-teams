"use client";

import {
  CheckCircle2,
  Wrench,
  GraduationCap,
  Zap,
  Check,
  UserCheck,
} from "lucide-react";
import type { FluencyTable as FluencyTableType } from "@/types";
import { cn } from "@/lib/utils";
import { exportFluencyTableToPdf } from "@/lib/pdf";
import { ExportPdfMenu } from "./ExportPdfMenu";

const LEVEL_CONFIG = {
  Unskilled: {
    color: "#ef4444",
    bg: "bg-red-900/20",
    border: "border-red-800/40",
    badge: "bg-red-900/40 text-red-300",
    ring: "ring-red-400",
    dot: "bg-red-400",
    text: "text-red-300",
    selectedBg: "bg-red-500/15",
    selectedBorder: "border-red-500/60",
  },
  Capable: {
    color: "#f59e0b",
    bg: "bg-amber-900/20",
    border: "border-amber-800/40",
    badge: "bg-amber-900/40 text-amber-300",
    ring: "ring-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-300",
    selectedBg: "bg-amber-500/15",
    selectedBorder: "border-amber-500/60",
  },
  Adoptive: {
    color: "#3b82f6",
    bg: "bg-blue-900/20",
    border: "border-blue-800/40",
    badge: "bg-blue-900/40 text-blue-300",
    ring: "ring-blue-400",
    dot: "bg-blue-400",
    text: "text-blue-300",
    selectedBg: "bg-blue-500/15",
    selectedBorder: "border-blue-500/60",
  },
  Transformative: {
    color: "#6366f1",
    bg: "bg-indigo-900/20",
    border: "border-indigo-800/40",
    badge: "bg-indigo-900/40 text-indigo-300",
    ring: "ring-indigo-400",
    dot: "bg-indigo-400",
    text: "text-indigo-300",
    selectedBg: "bg-indigo-500/15",
    selectedBorder: "border-indigo-500/60",
  },
} as const;

type LevelName = keyof typeof LEVEL_CONFIG;
const LEVEL_ORDER: LevelName[] = [
  "Unskilled",
  "Capable",
  "Adoptive",
  "Transformative",
];

function getLevelConfig(level: string) {
  return LEVEL_CONFIG[level as LevelName] ?? LEVEL_CONFIG.Capable;
}

interface Props {
  data: FluencyTableType;
  showExport?: boolean;
  selfAssessmentLevel?: LevelName | null;
  onSelfAssess?: (level: LevelName | null) => void;
}

export function FluencyTable({
  data,
  showExport = true,
  selfAssessmentLevel,
  onSelfAssess,
}: Props) {
  const selfAssessEnabled = typeof onSelfAssess === "function";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            AI Fluency Assessment
          </h2>
          <p className="text-[#64748b] text-sm">
            {data.roleId.replace(/-/g, " ")} · {data.industry}
            {data.cached && (
              <span className="ml-2 text-xs text-[#475569] bg-[#1e293b] px-2 py-0.5 rounded-full">
                cached
              </span>
            )}
          </p>
        </div>
        {showExport && (
          <ExportPdfMenu
            selfAssessedLevel={selfAssessmentLevel ?? null}
            onExport={(includedLevels) =>
              exportFluencyTableToPdf(data, {
                selfAssessedLevel: selfAssessmentLevel ?? null,
                includedLevels,
              })
            }
            className="shrink-0"
          />
        )}
      </div>

      {selfAssessEnabled && (
        <SelfAssessmentSelector
          selectedLevel={selfAssessmentLevel ?? null}
          onChange={(lvl) => onSelfAssess?.(lvl)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.levels.map((lvl) => {
          const cfg = getLevelConfig(lvl.level);
          const isSelected =
            selfAssessEnabled && selfAssessmentLevel === lvl.level;
          return (
            <div
              key={lvl.level}
              className={cn(
                "rounded-2xl border p-5 flex flex-col gap-4 transition-all",
                isSelected
                  ? cn(
                      cfg.selectedBg,
                      cfg.selectedBorder,
                      "ring-2 ring-offset-2 ring-offset-[#0f172a]",
                      cfg.ring
                    )
                  : cn(cfg.bg, cfg.border)
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    cfg.badge
                  )}
                >
                  {lvl.level}
                </span>
                {isSelected && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      cfg.text
                    )}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Your level
                  </span>
                )}
              </div>

              {lvl.criteria.length > 0 && (
                <Section
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  title="Criteria"
                  color={cfg.color}
                >
                  {lvl.criteria.map((c, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#cbd5e1] leading-relaxed"
                    >
                      {c}
                    </li>
                  ))}
                </Section>
              )}

              {lvl.examples.length > 0 && (
                <Section
                  icon={<Zap className="w-3.5 h-3.5" />}
                  title="Examples"
                  color={cfg.color}
                >
                  {lvl.examples.map((e, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#cbd5e1] leading-relaxed"
                    >
                      {e}
                    </li>
                  ))}
                </Section>
              )}

              {lvl.tools.length > 0 && (
                <Section
                  icon={<Wrench className="w-3.5 h-3.5" />}
                  title="Tools"
                  color={cfg.color}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.tools.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#0f172a]/60 border border-[#334155] text-[#94a3b8] px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {lvl.skills.length > 0 && (
                <Section
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  title="Skills"
                  color={cfg.color}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#0f172a]/60 border border-[#334155] text-[#94a3b8] px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {selfAssessEnabled && (
                <button
                  type="button"
                  onClick={() =>
                    onSelfAssess?.(isSelected ? null : (lvl.level as LevelName))
                  }
                  aria-pressed={isSelected}
                  className={cn(
                    "mt-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-semibold transition-colors border",
                    isSelected
                      ? cn(cfg.selectedBg, cfg.selectedBorder, cfg.text)
                      : "bg-[#0f172a]/60 border-[#334155] text-[#94a3b8] hover:text-white hover:border-[#475569]"
                  )}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Selected as your level
                    </>
                  ) : (
                    <>This is me</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelfAssessmentSelector({
  selectedLevel,
  onChange,
}: {
  selectedLevel: LevelName | null;
  onChange: (level: LevelName | null) => void;
}) {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-5 flex flex-col gap-3 border border-[#334155]/50">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#6366f1]" />
          <h3 className="text-sm font-semibold text-white">
            Self-Assessment
          </h3>
        </div>
        {selectedLevel && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-[#64748b] hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-[#94a3b8] leading-relaxed">
        Review the rubric below and pick the level that best describes how you
        currently work with AI in this role.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LEVEL_ORDER.map((lvl) => {
          const cfg = LEVEL_CONFIG[lvl];
          const isSelected = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange(isSelected ? null : lvl)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                isSelected
                  ? cn(
                      cfg.selectedBg,
                      cfg.selectedBorder,
                      "ring-2 ring-offset-2 ring-offset-[#1e293b]",
                      cfg.ring,
                      cfg.text
                    )
                  : "bg-[#0f172a]/50 border-[#334155] text-[#94a3b8] hover:border-[#475569] hover:text-white"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              <span>{lvl}</span>
              {isSelected && <Check className="w-3.5 h-3.5 ml-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <ul className="list-none space-y-1">{children}</ul>
    </div>
  );
}
