import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { LetheEventName, LetheEventProperties } from "@/lib/analytics/types";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set<LetheEventName>([
  "landing_view",
  "analysis_cta_clicked",
  "analysis_started",
  "analysis_completed",
  "analysis_failed",
  "cleanup_interest_clicked",
  "cleanup_priority_submitted",
  "cleanup_guide_requested",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeProperties(value: unknown): LetheEventProperties {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item === null || ["string", "number", "boolean"].includes(typeof item))
      .map(([key, item]) => [key.slice(0, 80), typeof item === "string" ? item.slice(0, 500) : item])
  ) as LetheEventProperties;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 120) : "";
    const event = typeof body.event === "string" ? body.event : "";

    if (!sessionId || !ALLOWED_EVENTS.has(event as LetheEventName)) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("events").insert({
      session_id: sessionId,
      event,
      properties: sanitizeProperties(body.properties),
    });

    if (error) return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "request_failed" }, { status: 500 });
  }
}
