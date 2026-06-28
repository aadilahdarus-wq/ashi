"use client";

import { useState } from "react";
import type { GenerateReportResult } from "@/app/api/generate-report/route";
import { streamGeneratedReport } from "@/lib/api-client";
import {
  reportHighlights,
  reportRecommendations,
  reportSummary,
} from "@/lib/reports";
import { MeetingNotesBox } from "@/components/reports/MeetingNotesBox";
import { ReportConfigBar } from "@/components/reports/ReportConfigBar";
import { ReportDocument } from "@/components/reports/ReportDocument";
import { ReportSidebar } from "@/components/reports/ReportSidebar";

const defaultKpis = {
  spend: "RM 12,480",
  leads: "348",
  roas: "4.2×",
  cpl: "RM 35.9",
};

const defaultPeriod = "Jun 1-14, 2026";

export function ReportsWorkspace() {
  const [selectedReportId, setSelectedReportId] = useState("june-full");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [reportContent, setReportContent] = useState<GenerateReportResult>({
    narrative: reportSummary,
    highlights: reportHighlights,
    recommendations: reportRecommendations,
  });
  const [streamingNarrative, setStreamingNarrative] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegenerateReport() {
    setIsGenerating(true);
    setError(null);
    setStreamingNarrative("");

    try {
      await streamGeneratedReport(
        {
          meetingNotes,
          kpis: defaultKpis,
          period: defaultPeriod,
        },
        {
          onNarrativeDelta: (text) => {
            setStreamingNarrative((current) => `${current ?? ""}${text}`);
          },
          onComplete: (result) => {
            setReportContent(result);
            setStreamingNarrative(null);
          },
          onError: (message) => {
            setError(message);
            setStreamingNarrative(null);
          },
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
      setStreamingNarrative(null);
    } finally {
      setIsGenerating(false);
    }
  }

  const summaryText = streamingNarrative ?? reportContent.narrative;

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
      <ReportSidebar
        selectedReportId={selectedReportId}
        onSelectReport={setSelectedReportId}
      />

      <div className="min-w-0 flex-1 space-y-5">
        <ReportConfigBar
          isGenerating={isGenerating}
          onRegenerate={handleRegenerateReport}
        />

        {error && (
          <div className="rounded-xl border border-red/20 bg-red-pale px-5 py-3">
            <p className="text-[13px] font-medium text-red-text">{error}</p>
          </div>
        )}

        <MeetingNotesBox
          notes={meetingNotes}
          onNotesChange={setMeetingNotes}
          isGenerating={isGenerating}
          onSaveRegenerate={handleRegenerateReport}
        />

        <ReportDocument
          period={defaultPeriod}
          summary={summaryText}
          highlights={reportContent.highlights}
          recommendations={reportContent.recommendations}
          isStreaming={streamingNarrative !== null}
        />
      </div>
    </div>
  );
}
