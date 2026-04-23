"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, BookOpen, Library } from "lucide-react";
import { AssessmentForm } from "./AssessmentForm";
import { FluencyTable } from "./FluencyTable";
import { PromptLibrary } from "./PromptLibrary";
import { ResourcesPanel } from "./ResourcesPanel";
import type { FluencyTable as FluencyTableType, JobPrompts } from "@/types";
import { INDUSTRIES } from "@/lib/data";

type Tab = "fluency" | "prompts" | "resources";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("fluency");
  const [fluencyData, setFluencyData] = useState<FluencyTableType | null>(null);
  const [promptData, setPromptData] = useState<JobPrompts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roleTitle, setRoleTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [context, setContext] = useState("");

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

  const tabs = [
    { id: "fluency" as Tab, label: "Fluency Assessment", icon: Sparkles },
    { id: "prompts" as Tab, label: "Prompt Library", icon: BookOpen },
    { id: "resources" as Tab, label: "Resources", icon: Library },
  ];

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

        {/* Form — shown for fluency and prompts tabs */}
        {tab !== "resources" && (
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

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {tab === "fluency" && fluencyData && (
          <FluencyTable data={fluencyData} />
        )}
        {tab === "prompts" && promptData && (
          <PromptLibrary data={promptData} />
        )}
        {tab === "resources" && <ResourcesPanel />}
      </div>
    </div>
  );
}
