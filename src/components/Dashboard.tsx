"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, BookOpen, Library, User, Users } from "lucide-react";
import { AssessmentForm } from "./AssessmentForm";
import { ManagerForm } from "./ManagerForm";
import { FluencyTable } from "./FluencyTable";
import { TeamFluencyTable } from "./TeamFluencyTable";
import { PromptLibrary } from "./PromptLibrary";
import { ResourcesPanel } from "./ResourcesPanel";
import type {
  FluencyTable as FluencyTableType,
  JobPrompts,
  TeamMember,
  TeamAssessment,
} from "@/types";
import { INDUSTRIES } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "fluency" | "prompts" | "resources";
type Mode = "individual" | "manager";
type FluencyLevel = "Unskilled" | "Capable" | "Adoptive" | "Transformative";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("fluency");
  const [mode, setMode] = useState<Mode>("individual");
  const [fluencyData, setFluencyData] = useState<FluencyTableType | null>(null);
  const [selfAssessmentLevel, setSelfAssessmentLevel] =
    useState<FluencyLevel | null>(null);
  const [promptData, setPromptData] = useState<JobPrompts | null>(null);
  const [teamData, setTeamData] = useState<TeamAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Individual mode fields
  const [roleTitle, setRoleTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [context, setContext] = useState("");

  // Manager mode fields
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "init-0", name: "", roleTitle: "" },
  ]);
  const [teamIndustry, setTeamIndustry] = useState("");
  const [teamContext, setTeamContext] = useState("");

  async function handleGenerate() {
    if (!roleTitle.trim() || !industry) return;
    setIsLoading(true);
    setError(null);

    try {
      if (tab === "fluency") {
        const res = await fetch("/api/fluency-table", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roleTitle, industry, context }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        setFluencyData(await res.json());
        setSelfAssessmentLevel(null);
      } else if (tab === "prompts") {
        const res = await fetch("/api/job-prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roleTitle, industry, context }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        setPromptData(await res.json());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTeamGenerate() {
    if (
      !teamIndustry ||
      teamMembers.length === 0 ||
      !teamMembers.every((m) => m.name.trim() && m.roleTitle.trim())
    )
      return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team-fluency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: teamMembers,
          industry: teamIndustry,
          context: teamContext,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setTeamData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const tabs = [
    { id: "fluency" as Tab, label: "Fluency Assessment", icon: Sparkles },
    { id: "prompts" as Tab, label: "Prompt Library", icon: BookOpen },
    { id: "resources" as Tab, label: "Resources", icon: Library },
  ];

  const showModeToggle = tab === "fluency";
  const showIndividualForm = tab !== "resources" && (tab === "prompts" || mode === "individual");
  const showManagerForm = tab === "fluency" && mode === "manager";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="AI Fluency for Teams" width={32} height={32} className="rounded-lg" />
            <div>
              <h1 className="font-bold text-white text-sm leading-tight">AI Fluency for Teams</h1>
              <p className="text-[#64748b] text-xs">Powered by GPT-5.4</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6 flex-1">
        {/* Hero */}
        <div className="text-center py-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Understand your team&apos;s{" "}
            <span className="text-[#6366f1]">AI readiness</span>
          </h2>
          <p className="text-[#94a3b8] max-w-xl mx-auto text-sm leading-relaxed">
            Generate a personalized AI fluency assessment or a role-specific prompt library
            for any job title and industry.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl w-fit mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-[#6366f1] text-white shadow"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Mode toggle — only shown on fluency tab */}
        {showModeToggle && (
          <div className="flex items-center justify-center gap-1 bg-[#1e293b]/60 p-1 rounded-xl w-fit mx-auto">
            <ModeRadio
              active={mode === "individual"}
              onClick={() => setMode("individual")}
              icon={<User className="w-3.5 h-3.5" />}
              label="Individual"
            />
            <ModeRadio
              active={mode === "manager"}
              onClick={() => setMode("manager")}
              icon={<Users className="w-3.5 h-3.5" />}
              label="Manager"
            />
          </div>
        )}

        {/* Individual form — shown for prompts tab, and fluency tab in individual mode */}
        {showIndividualForm && (
          <AssessmentForm
            roleTitle={roleTitle}
            setRoleTitle={setRoleTitle}
            industry={industry}
            setIndustry={setIndustry}
            context={context}
            setContext={setContext}
            industries={INDUSTRIES}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            buttonLabel={tab === "fluency" ? "Generate Assessment" : "Generate Prompts"}
          />
        )}

        {/* Manager form — fluency tab in manager mode */}
        {showManagerForm && (
          <ManagerForm
            members={teamMembers}
            setMembers={setTeamMembers}
            industry={teamIndustry}
            setIndustry={setTeamIndustry}
            context={teamContext}
            setContext={setTeamContext}
            industries={INDUSTRIES}
            onGenerate={handleTeamGenerate}
            isLoading={isLoading}
          />
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {tab === "fluency" && mode === "individual" && fluencyData && (
          <FluencyTable
            data={fluencyData}
            selfAssessmentLevel={selfAssessmentLevel}
            onSelfAssess={setSelfAssessmentLevel}
          />
        )}
        {tab === "fluency" && mode === "manager" && teamData && (
          <TeamFluencyTable data={teamData} />
        )}
        {tab === "prompts" && promptData && (
          <PromptLibrary data={promptData} />
        )}
        {tab === "resources" && <ResourcesPanel />}
      </div>
    </div>
  );
}

function ModeRadio({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
        active
          ? "bg-[#0f172a] text-white shadow-sm border border-[#334155]"
          : "text-[#64748b] hover:text-[#94a3b8]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
