"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import type { JobPrompts } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  data: JobPrompts;
}

export function PromptLibrary({ data }: Props) {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  async function copyPrompt(text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Prompt Library</h2>
        <p className="text-[#64748b] text-sm">
          {data.roleTitle} · {data.industry}
          {data.cached && (
            <span className="ml-2 text-xs text-[#475569] bg-[#1e293b] px-2 py-0.5 rounded-full">
              cached
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {data.categories.map((cat, i) => (
          <div
            key={i}
            className="bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden"
          >
            <button
              onClick={() => setOpenCategory(openCategory === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#334155]/40 transition-colors"
            >
              <div>
                <div className="font-medium text-white">{cat.name}</div>
                <div className="text-xs text-[#64748b] mt-0.5">{cat.description}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className="text-xs text-[#475569] bg-[#0f172a] px-2 py-0.5 rounded-full">
                  {cat.prompts.length} prompts
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[#64748b] transition-transform",
                    openCategory === i && "rotate-180"
                  )}
                />
              </div>
            </button>

            {openCategory === i && (
              <div className="border-t border-[#334155] px-5 py-3 flex flex-col gap-2">
                {cat.prompts.map((prompt, j) => (
                  <div
                    key={j}
                    className="group bg-[#0f172a] rounded-xl p-4 flex items-start gap-3 border border-[#1e293b] hover:border-[#334155] transition-colors"
                  >
                    <p className="text-sm text-[#cbd5e1] leading-relaxed flex-1">{prompt}</p>
                    <button
                      onClick={() => copyPrompt(prompt)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-[#334155] text-[#475569] hover:text-white transition-colors"
                      title="Copy prompt"
                    >
                      {copiedPrompt === prompt ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
