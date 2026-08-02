import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CleanupRequestRow = {
  id: string;
  services: string[];
  service_items?: unknown;
  created_at: string;
};

function normalizeServiceItems(value: unknown, services: string[]) {
  if (!Array.isArray(value)) return services.map((service) => ({ service, provider: "unknown" }));

  const items = value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => {
      const service = typeof item.service === "string" ? item.service : "";
      const provider = typeof item.provider === "string" ? item.provider : "unknown";
      return service ? { service, provider } : null;
    })
    .filter((item): item is { service: string; provider: string } => Boolean(item));

  return items.length > 0 ? items : services.map((service) => ({ service, provider: "unknown" }));
}

export async function GET(request: Request, ctx: RouteContext<"/api/cleanup-requests/[id]">) {
  try {
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const withItems = await supabase
      .from("cleanup_requests")
      .select("id, services, service_items, created_at")
      .eq("id", id)
      .single();
    const { data, error } = withItems.error?.message.includes("service_items")
      ? await supabase.from("cleanup_requests").select("id, services, created_at").eq("id", id).single()
      : withItems;

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const row = data as CleanupRequestRow;

    return NextResponse.json({
      ok: true,
      request: {
        id: row.id,
        services: row.services,
        service_items: normalizeServiceItems(row.service_items, row.services),
        created_at: row.created_at,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "request_failed" }, { status: 500 });
  }
}
