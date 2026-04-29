"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const LEVEL_ORDER = ["Unskilled", "Capable", "Adoptive", "Transformative"] as const;
export type Level = (typeof LEVEL_ORDER)[number];

const LEVEL_DOT: Record<Level, string> = {
  Unskilled: "bg-red-400",
  Capable: "bg-amber-400",
  Adoptive: "bg-blue-400",
  Transformative: "bg-indigo-400",
};

type Scope = "all" | "self" | "custom";

interface Props {
  selfAssessedLevel?: Level | null;
  onExport: (includedLevels: Level[]) => void;
  className?: string;
}

export function ExportPdfMenu({ selfAssessedLevel, onExport, className }: Props) {
  const [open, setOpen] = useState(false);
  const [userScope, setUserScope] = useState<Scope | null>(null);
  const [custom, setCustom] = useState<Set<Level>>(
    () => new Set<Level>(LEVEL_ORDER)
  );
  const ref = useRef<HTMLDivElement>(null);

  const scope: Scope = userScope ?? (selfAssessedLevel ? "self" : "all");

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function resolveLevels(): Level[] {
    if (scope === "all") return [...LEVEL_ORDER];
    if (scope === "self" && selfAssessedLevel) return [selfAssessedLevel];
    return LEVEL_ORDER.filter((l) => custom.has(l));
  }

  function handleExport() {
    onExport(resolveLevels());
    setOpen(false);
  }

  function toggleCustom(level: Level) {
    setCustom((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  const canExport =
    scope !== "self" || (scope === "self" && !!selfAssessedLevel);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg bg-[#1e293b] border border-[#334155] text-[#cbd5e1] hover:border-[#475569] hover:text-white transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Export PDF
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Export PDF options"
          className="absolute right-0 top-full mt-2 w-72 z-20 bg-[#0f172a] border border-[#334155] rounded-xl shadow-xl p-4 flex flex-col gap-3"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
              Levels to include
            </p>
            {selfAssessedLevel ? (
              <p className="text-xs text-[#94a3b8] mt-1">
                Self-assessed as{" "}
                <span className="text-white font-medium">{selfAssessedLevel}</span>
              </p>
            ) : (
              <p className="text-xs text-[#64748b] mt-1">
                Tip: pick a self-assessed level to enable the &ldquo;Only my
                level&rdquo; option.
              </p>
            )}
          </div>

          <div role="radiogroup" className="flex flex-col gap-1">
            <ScopeRadio
              checked={scope === "all"}
              onChange={() => setUserScope("all")}
              label="All levels"
              hint="Full report"
            />
            <ScopeRadio
              checked={scope === "self"}
              onChange={() => selfAssessedLevel && setUserScope("self")}
              disabled={!selfAssessedLevel}
              label="Only my self-assessed level"
              hint={
                selfAssessedLevel
                  ? `Includes ${selfAssessedLevel}`
                  : "Select a level first"
              }
            />
            <ScopeRadio
              checked={scope === "custom"}
              onChange={() => setUserScope("custom")}
              label="Custom selection"
            />
          </div>

          {scope === "custom" && (
            <div className="flex flex-col gap-1 pl-1 border-l-2 border-[#1e293b] ml-1">
              {LEVEL_ORDER.map((level) => {
                const checked = custom.has(level);
                return (
                  <label
                    key={level}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#1e293b]/60 cursor-pointer"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        checked
                          ? "bg-[#6366f1] border-[#6366f1]"
                          : "border-[#334155] bg-transparent"
                      )}
                    >
                      {checked && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className={cn("w-2 h-2 rounded-full", LEVEL_DOT[level])} />
                    <span className="text-xs text-[#cbd5e1]">{level}</span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleCustom(level)}
                    />
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs px-3 py-1.5 rounded-lg text-[#94a3b8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canExport || resolveLevels().length === 0}
              onClick={handleExport}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#6366f1] text-white hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScopeRadio({
  checked,
  onChange,
  disabled,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-2 px-2 py-1.5 rounded-md transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#1e293b]/60 cursor-pointer"
      )}
    >
      <span
        className={cn(
          "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
          checked ? "border-[#6366f1]" : "border-[#334155]"
        )}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-[#6366f1]" />}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xs text-[#cbd5e1]">{label}</span>
        {hint && <span className="text-[10px] text-[#64748b]">{hint}</span>}
      </span>
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
