import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST() {
  try {
    await sendTelegramMessage("✅ Test message from ASHI — your Telegram connection is working!");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send Telegram test message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
