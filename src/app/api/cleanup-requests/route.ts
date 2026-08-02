import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function sanitizeServices(value: unknown) {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 100))
    ),
  ].slice(0, 50);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 120) : "";
    const services = sanitizeServices(body.services);

    if (!sessionId || services.length === 0) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("cleanup_requests").insert({
      session_id: sessionId,
      services,
    });

    if (error) return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "request_failed" }, { status: 500 });
  }
}
