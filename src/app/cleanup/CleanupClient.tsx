"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { recordLetheEvent } from "@/lib/analytics/client";

type CleanupRequest = {
  id: string;
  services: string[];
  service_items?: CleanupServiceItem[];
  created_at: string;
};

type CleanupServiceItem = {
  service: string;
  provider: string;
};

type LoadState = "loading" | "ready" | "missing" | "error";

function providerLabel(provider: string) {
  switch (provider) {
    case "kakao":
      return "카카오 파일에서 확인된 서비스";
    case "naver":
      return "네이버 파일에서 확인된 서비스";
    case "custom":
      return "직접 입력한 서비스";
    case "mixed":
      return "여러 출처에서 확인된 서비스";
    case "generic":
      return "파일에서 확인한 서비스";
    default:
      return "출처를 확인 중인 서비스";
  }
}

export default function CleanupClient() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request") ?? "";
  const [request, setRequest] = useState<CleanupRequest | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [requestedServices, setRequestedServices] = useState<Set<string>>(() => new Set());
  const visibleState: LoadState = requestId ? state : "missing";

  function requestCleanupGuide(item: CleanupServiceItem) {
    const serviceKey = `${item.provider}:${item.service}`;

    setRequestedServices((current) => {
      if (current.has(serviceKey)) return current;
      const next = new Set(current);
      next.add(serviceKey);
      return next;
    });

    void recordLetheEvent("cleanup_guide_requested", {
      request_id: requestId,
      service: item.service,
      provider: item.provider,
    });
  }

  useEffect(() => {
    if (!requestId) return;

    fetch(`/api/cleanup-requests/${encodeURIComponent(requestId)}`)
      .then((response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Failed to load cleanup request.");
        return response.json() as Promise<{ ok: boolean; request: CleanupRequest }>;
      })
      .then((data) => {
        if (!data?.request) {
          setState("missing");
          return;
        }
        setRequest(data.request);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [requestId]);

  return (
    <main className="min-h-screen bg-ivory text-slate">
      <header className="border-b border-stone">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" aria-label="Lethe home" className="relative block h-8 w-28 shrink-0 md:h-10 md:w-36">
            <Image src="/brand/textlogowB.svg" alt="Lethe" fill priority className="object-contain object-left" sizes="144px" />
          </Link>
          <Link href="/notes/understanding-me-myself" className="text-xs tracking-[0.16em] text-fog transition-colors hover:text-slate">
            분석으로 돌아가기
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        <p className="font-mono text-xs tracking-[0.18em] text-fog uppercase">Service cleanup</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
          선택한 서비스를 정리하는 방법을 살펴보세요.
        </h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-7 text-fog">
          현재 Lethe는 베타 단계이며, 직접적인 삭제 지원은 아직 제공하지 않습니다.
          {"\n"}대신 선택한 서비스를 기준으로 확인된 삭제 방법과 조사 상태를 안내할 예정입니다.
        </p>

        <div className="mt-12 border border-stone bg-[#fbfaf7]">
          {visibleState === "loading" && <p className="px-6 py-8 text-sm text-fog">선택한 서비스 목록을 불러오고 있습니다.</p>}
          {visibleState === "missing" && (
            <div className="px-6 py-8">
              <h2 className="text-lg font-medium">선택 기록을 찾을 수 없습니다.</h2>
              <p className="mt-3 text-sm leading-7 text-fog">
                제출 후 이동한 링크인지 확인해주세요. 업로드 파일과 분석 결과는 서버에 저장되지 않습니다.
              </p>
            </div>
          )}
          {visibleState === "error" && (
            <div className="px-6 py-8">
              <h2 className="text-lg font-medium">목록을 불러오지 못했습니다.</h2>
              <p className="mt-3 text-sm leading-7 text-fog">잠시 후 다시 시도해주세요.</p>
            </div>
          )}
          {visibleState === "ready" && request && (
            <div>
              <div className="border-b border-stone px-6 py-5">
                <p className="text-sm text-fog">
                  사용자가 직접 제출한 {request.services.length}개의 서비스만 불러왔습니다.
                </p>
              </div>
              <ul>
                {(request.service_items ?? request.services.map((service) => ({ service, provider: "unknown" }))).map((item) => {
                  const serviceKey = `${item.provider}:${item.service}`;
                  const isRequested = requestedServices.has(serviceKey);

                  return (
                    <li key={serviceKey} className="flex flex-col gap-4 border-b border-stone px-6 py-5 last:border-b-0 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-lg font-medium">{item.service}</h2>
                      <p className="mt-1 text-xs text-fog">{providerLabel(item.provider)}</p>
                      <p className="mt-1 text-xs text-fog">삭제 가이드 준비 상태를 확인하는 중입니다.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-fit border border-stone px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-fog">
                        준비 중
                      </span>
                      <button
                        type="button"
                        onClick={() => requestCleanupGuide(item)}
                        disabled={isRequested}
                        className="w-fit border border-slate/25 px-4 py-1.5 text-xs text-slate transition-colors hover:border-slate hover:bg-slate hover:text-ivory disabled:border-stone disabled:bg-transparent disabled:text-fog"
                      >
                        {isRequested ? "요청 완료" : "가이드 요청하기"}
                      </button>
                    </div>
                  </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
