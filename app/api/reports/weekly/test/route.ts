import { NextResponse } from "next/server";
import { runWeeklyReports } from "@/lib/weekly-report";

// Manual trigger for the "Send weekly report now" button in Settings.
// No secret required — ASHI has no login/auth layer anywhere else either,
// so this matches the rest of the app's security posture (personal tool,
// not multi-user SaaS).
export const maxDuration = 60;

export async function POST() {
  try {
    const results = await runWeeklyReports();
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run weekly reports";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
