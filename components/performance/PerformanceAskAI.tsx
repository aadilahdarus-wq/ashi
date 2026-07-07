"use client";

import { useState } from "react";
import type { PerformanceRow } from "@/lib/performance";

type Props = {
  campaigns: PerformanceRow[];
  rangeLabel: string;
};

const SUGGESTED_QUESTIONS = [
  "Which campaign should I pause or cut budget on?",
  "Where should I increase budget for the best return?",
  "Why is my CPA so different across campaigns?",
  "Suggest 3 optimisations based on this data",
];

export function PerformanceAskAI({ campaigns, rangeLabel }: Props) {
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setLoading(true);
    setAnalysis("");
    setError("");

    try {
      const res = await fetch("/api/analyze-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          campaigns,
          rangeLabel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get analysis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-pale">
          <span className="text-[16px] leading-none text-orange">✦</span>
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-text">Ask ASHI</h2>
          <p className="text-[12px] text-text-3">
            Ask anything about your {rangeLabel} performance
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleAsk(q)}
            disabled={loading}
            className="rounded-full border border-border px-3 py-1.5 text-[12px] text-text-2 transition-colors hover:border-orange hover:text-orange disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk(question)}
          placeholder="e.g. Suggest optimisations for this period..."
          disabled={loading}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-[13px] text-text placeholder:text-text-3 focus:border-orange focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => handleAsk(question)}
          disabled={loading || !question.trim()}
          className="rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Analysing…" : "Ask"}
        </button>
      </div>

      {loading && (
        <div className="mt-5 flex items-center gap-2 text-[13px] text-text-3">
          <span className="animate-pulse">✦</span>
          <span>ASHI is analysing your campaigns…</span>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-pale p-4 text-[13px] text-red-text">
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="mt-5 rounded-lg border border-border bg-surface-2 p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">
            ASHI Analysis · {rangeLabel}
          </p>
          <div className="space-y-2">
            {analysis.split("\n\n").map((para, i) => (
              <p key={i} className="whitespace-pre-line text-[13px] leading-relaxed text-text-2">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
