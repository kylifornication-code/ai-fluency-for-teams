"use client";

import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  roleTitle: string;
  setRoleTitle: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  context: string;
  setContext: (v: string) => void;
  industries: string[];
  onGenerate: () => void;
  isLoading: boolean;
  buttonLabel: string;
}

export function AssessmentForm({
  roleTitle,
  setRoleTitle,
  industry,
  setIndustry,
  context,
  setContext,
  industries,
  onGenerate,
  isLoading,
  buttonLabel,
}: Props) {
  const canSubmit = roleTitle.trim() && industry && !isLoading;

  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
            Job Title
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="e.g. Marketing Manager"
            maxLength={100}
            className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]"
            onKeyDown={(e) => e.key === "Enter" && canSubmit && onGenerate()}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]"
          >
            <option value="" disabled>
              Select industry
            </option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Additional Context{" "}
          <span className="normal-case text-[#475569] font-normal">(optional)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. I work at a mid-size SaaS company focused on enterprise sales..."
          rows={2}
          maxLength={500}
          className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] resize-none"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={!canSubmit}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold transition-all",
          canSubmit
            ? "bg-[#6366f1] text-white hover:bg-[#818cf8] shadow-lg shadow-[#6366f1]/20"
            : "bg-[#334155] text-[#475569] cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {buttonLabel}
          </>
        )}
      </button>
    </div>
  );
}
