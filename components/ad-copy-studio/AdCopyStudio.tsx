"use client";

import { useState } from "react";
import { GenerateTab } from "@/components/ad-copy-studio/GenerateTab";
import { StudioPlaceholderTab } from "@/components/ad-copy-studio/StudioPlaceholderTab";

const tabs = [
  { id: "dashboard", label: "Assets Dashboard" },
  { id: "generate", label: "Generate" },
  { id: "saved", label: "Saved" },
  { id: "ab-tests", label: "A/B Tests" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdCopyStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("generate");

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-1.5">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-orange-pale text-orange"
                  : "text-text-3 hover:bg-surface-2 hover:text-text-2",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "generate" && <GenerateTab />}
      {activeTab === "dashboard" && (
        <StudioPlaceholderTab
          title="Assets Dashboard"
          description="View performance and status across all generated ad assets. Coming soon."
        />
      )}
      {activeTab === "saved" && (
        <StudioPlaceholderTab
          title="Saved"
          description="Browse and reuse your saved headlines and descriptions. Coming soon."
        />
      )}
      {activeTab === "ab-tests" && (
        <StudioPlaceholderTab
          title="A/B Tests"
          description="Compare ad copy variants and track test results. Coming soon."
        />
      )}
    </div>
  );
}
