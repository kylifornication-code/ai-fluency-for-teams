"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { RESOURCES } from "@/lib/data";
import { cn } from "@/lib/utils";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-green-900/40 text-green-300",
  "beginner-intermediate": "bg-teal-900/40 text-teal-300",
  intermediate: "bg-blue-900/40 text-blue-300",
  "intermediate-advanced": "bg-indigo-900/40 text-indigo-300",
  advanced: "bg-purple-900/40 text-purple-300",
};

const TYPE_LABELS: Record<string, string> = {
  course: "Course",
  tutorial: "Tutorial",
  guide: "Guide",
  documentation: "Docs",
  repository: "Repo",
  examples: "Examples",
};

export function ResourcesPanel() {
  const [filter, setFilter] = useState<string>("all");

  const types = ["all", ...Array.from(new Set(RESOURCES.map((r) => r.type)))];
  const filtered =
    filter === "all" ? RESOURCES : RESOURCES.filter((r) => r.type === filter);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Learning Resources</h2>
        <p className="text-[#64748b] text-sm">
          Curated resources to help your team level up AI skills.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors",
              filter === t
                ? "bg-[#6366f1] text-white"
                : "bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155]"
            )}
          >
            {t === "all" ? "All" : TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#6366f1]/50 hover:bg-[#1e293b]/80 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-white text-sm leading-snug group-hover:text-[#818cf8] transition-colors">
                {r.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-[#475569] shrink-0 mt-0.5 group-hover:text-[#6366f1] transition-colors" />
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed flex-1">{r.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", DIFFICULTY_BADGE[r.difficulty] || "bg-[#334155] text-[#94a3b8]")}>
                {r.difficulty}
              </span>
              <span className="text-xs text-[#475569]">{r.estimatedTime}h</span>
              <span className="text-xs text-[#334155] bg-[#0f172a] px-2 py-0.5 rounded-full">
                {TYPE_LABELS[r.type] || r.type}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
