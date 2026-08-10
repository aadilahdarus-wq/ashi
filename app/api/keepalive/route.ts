import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase's free tier auto-pauses a project after 7 days with no API
// activity. This route does a trivial read so a scheduled cron hit keeps
// the project active even when nobody opens the app for a while.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("clients").select("id").limit(1);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Keepalive ping failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
