import { NextResponse } from "next/server";
import { runWeeklyReports } from "@/lib/weekly-report";

// Multiple clients x (Google Ads queries + a Claude call) can take a while.
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runWeeklyReports();
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run weekly reports";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
