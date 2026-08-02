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

function sanitizeServiceItems(value: unknown, services: string[]) {
  if (!Array.isArray(value)) {
    return services.map((service) => ({ service, provider: "unknown" }));
  }

  const allowedProviders = new Set(["kakao", "naver", "generic", "custom", "mixed", "unknown"]);
  const items = value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => {
      const service = typeof item.service === "string" ? item.service.trim().slice(0, 100) : "";
      const provider = typeof item.provider === "string" && allowedProviders.has(item.provider) ? item.provider : "unknown";
      return service ? { service, provider } : null;
    })
    .filter((item): item is { service: string; provider: string } => Boolean(item));

  return items.length > 0 ? items.slice(0, 50) : services.map((service) => ({ service, provider: "unknown" }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 120) : "";
    const services = sanitizeServices(body.services);
    const serviceItems = sanitizeServiceItems(body.service_items, services);

    if (!sessionId || services.length === 0) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const requestId = crypto.randomUUID();
    const supabase = createSupabaseAdminClient();
    const payload = {
      id: requestId,
      session_id: sessionId,
      services,
    };
    const { error } = await supabase.from("cleanup_requests").insert({
      ...payload,
      service_items: serviceItems,
    });

    if (error?.message.includes("service_items")) {
      const fallback = await supabase.from("cleanup_requests").insert(payload);
      if (fallback.error) return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
      return NextResponse.json({ ok: true, id: requestId });
    }

    if (error) return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    return NextResponse.json({ ok: true, id: requestId });
  } catch {
    return NextResponse.json({ ok: false, error: "request_failed" }, { status: 500 });
  }
}
