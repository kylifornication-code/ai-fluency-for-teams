"use client";

import { Loader2, Sparkles, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types";

interface Props {
  members: TeamMember[];
  setMembers: (m: TeamMember[]) => void;
  industry: string;
  setIndustry: (v: string) => void;
  context: string;
  setContext: (v: string) => void;
  industries: string[];
  onGenerate: () => void;
  isLoading: boolean;
}

let nextId = 100;
function createMember(): TeamMember {
  return { id: String(nextId++), name: "", roleTitle: "" };
}

export function ManagerForm({
  members,
  setMembers,
  industry,
  setIndustry,
  context,
  setContext,
  industries,
  onGenerate,
  isLoading,
}: Props) {
  const canSubmit =
    industry &&
    members.length > 0 &&
    members.every((m) => m.name.trim() && m.roleTitle.trim()) &&
    !isLoading;

  function addMember() {
    setMembers([...members, createMember()]);
  }

  function removeMember(id: string) {
    if (members.length <= 1) return;
    setMembers(members.filter((m) => m.id !== id));
  }

  function updateMember(id: string, field: "name" | "roleTitle", value: string) {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 flex flex-col gap-5">
      {/* Industry (shared across team) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
            Team Industry
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
            Team Context{" "}
            <span className="normal-case text-[#475569] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Mid-size SaaS company, 50 employees"
            maxLength={500}
            className="bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Team members */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
            Team Members ({members.length})
          </label>
          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-1.5 text-xs font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add member
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
            >
              <span className="text-xs text-[#475569] w-6 text-right tabular-nums">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(member.id, "name", e.target.value)}
                placeholder="Name"
                maxLength={100}
                className="bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]"
              />
              <input
                type="text"
                value={member.roleTitle}
                onChange={(e) =>
                  updateMember(member.id, "roleTitle", e.target.value)
                }
                placeholder="Role title"
                maxLength={100}
                className="bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1]"
              />
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                disabled={members.length <= 1}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  members.length > 1
                    ? "text-[#64748b] hover:text-red-400 hover:bg-red-900/20"
                    : "text-[#1e293b] cursor-not-allowed"
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
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
            Generating {members.length} assessment{members.length !== 1 ? "s" : ""}…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Team Assessment
          </>
        )}
      </button>
    </div>
  );
}
