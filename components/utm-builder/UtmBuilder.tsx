"use client";

import { useState } from "react";
import { PlaceholderTab } from "@/components/utm-builder/PlaceholderTab";
import { SingleLinkTab } from "@/components/utm-builder/SingleLinkTab";

const tabs = [
  { id: "single", label: "Single Link" },
  { id: "bulk", label: "Bulk Builder" },
  { id: "templates", label: "Templates" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function UtmBuilder() {
  const [activeTab, setActiveTab] = useState<TabId>("single");

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

      {activeTab === "single" && <SingleLinkTab />}
      {activeTab === "bulk" && (
        <PlaceholderTab
          title="Bulk Builder"
          description="Generate UTM links in bulk from a spreadsheet-style input. Coming soon."
        />
      )}
      {activeTab === "templates" && (
        <PlaceholderTab
          title="Templates"
          description="Save and reuse UTM parameter sets for recurring campaigns. Coming soon."
        />
      )}
    </div>
  );
}
