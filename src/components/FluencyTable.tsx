"use client";

import { CheckCircle2, Wrench, GraduationCap, Zap, Download } from "lucide-react";
import type { FluencyTable as FluencyTableType } from "@/types";
import { cn } from "@/lib/utils";
import { exportFluencyTableToPdf } from "@/lib/pdf";

const LEVEL_CONFIG = {
  Unskilled: { color: "#ef4444", bg: "bg-red-900/20", border: "border-red-800/40", badge: "bg-red-900/40 text-red-300" },
  Capable: { color: "#f59e0b", bg: "bg-amber-900/20", border: "border-amber-800/40", badge: "bg-amber-900/40 text-amber-300" },
  Adoptive: { color: "#3b82f6", bg: "bg-blue-900/20", border: "border-blue-800/40", badge: "bg-blue-900/40 text-blue-300" },
  Transformative: { color: "#6366f1", bg: "bg-indigo-900/20", border: "border-indigo-800/40", badge: "bg-indigo-900/40 text-indigo-300" },
} as const;

type LevelName = keyof typeof LEVEL_CONFIG;

function getLevelConfig(level: string) {
  return LEVEL_CONFIG[level as LevelName] ?? LEVEL_CONFIG.Capable;
}

interface Props {
  data: FluencyTableType;
  showExport?: boolean;
}

export function FluencyTable({ data, showExport = true }: Props) {
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
          <button
            type="button"
            onClick={() => exportFluencyTableToPdf(data)}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg bg-[#1e293b] border border-[#334155] text-[#cbd5e1] hover:border-[#475569] hover:text-white transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.levels.map((lvl) => {
          const cfg = getLevelConfig(lvl.level);
          return (
            <div
              key={lvl.level}
              className={cn(
                "rounded-2xl border p-5 flex flex-col gap-4",
                cfg.bg,
                cfg.border
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", cfg.badge)}>
                  {lvl.level}
                </span>
              </div>

              {lvl.criteria.length > 0 && (
                <Section icon={<CheckCircle2 className="w-3.5 h-3.5" />} title="Criteria" color={cfg.color}>
                  {lvl.criteria.map((c, i) => (
                    <li key={i} className="text-sm text-[#cbd5e1] leading-relaxed">{c}</li>
                  ))}
                </Section>
              )}

              {lvl.examples.length > 0 && (
                <Section icon={<Zap className="w-3.5 h-3.5" />} title="Examples" color={cfg.color}>
                  {lvl.examples.map((e, i) => (
                    <li key={i} className="text-sm text-[#cbd5e1] leading-relaxed">{e}</li>
                  ))}
                </Section>
              )}

              {lvl.tools.length > 0 && (
                <Section icon={<Wrench className="w-3.5 h-3.5" />} title="Tools" color={cfg.color}>
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.tools.map((t, i) => (
                      <span key={i} className="text-xs bg-[#0f172a]/60 border border-[#334155] text-[#94a3b8] px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {lvl.skills.length > 0 && (
                <Section icon={<GraduationCap className="w-3.5 h-3.5" />} title="Skills" color={cfg.color}>
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.skills.map((s, i) => (
                      <span key={i} className="text-xs bg-[#0f172a]/60 border border-[#334155] text-[#94a3b8] px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>
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
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <ul className="list-none space-y-1">{children}</ul>
    </div>
  );
}
