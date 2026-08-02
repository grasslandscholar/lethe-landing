"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { openPrivacyModal } from "@/components/PrivacyModal";
import PrivacyModal from "@/components/PrivacyModal";
import { CYPRESS_CONTENT, type CypressContent } from "@/lib/cypress/content";
import { classify, TAXONOMY } from "@/lib/cypress/taxonomy";
import { gradeOf, scoreFromCategories, staleMultiplier } from "@/lib/cypress/scoring";
import { parseFile, type CategoryId, type ParsedCategory } from "@/lib/cypress/parsers";
import { SERVICE_EMAIL_MAP } from "@/lib/cypress/serviceEmailMap";
import type { NormalizedRow, TabDataset } from "@/lib/cypress/types";
import { recordCleanupRequest, recordLetheEvent, type CleanupServiceItem, type LetheEventName, type LetheEventProperties } from "@/lib/analytics/client";

type Dataset = Partial<Record<CategoryId, TabDataset>>;
type PlatformTab = "kakao" | "naver" | "generic";
type CleanupStep = "results" | "thanks";
type UploadedFileStatus = {
  name: string;
  provider: PlatformTab | "mixed" | "unknown";
  status: "ready" | "error";
};

const SCORED_CATEGORIES: CategoryId[] = ["kakao", "kakao_collect", "kakao_collect_extra", "naver", "generic"];
const COMPARABLE_CATEGORIES: CategoryId[] = ["kakao", "naver"];
const HIGH_RISK_THRESHOLD = 60;
const CLEANUP_KEY_SEPARATOR = "\u001f";

function providerFromCategories(categories: ParsedCategory[]): PlatformTab | "mixed" | "unknown" {
  const providers = new Set<PlatformTab>();
  categories.forEach((cat) => {
    if (cat.id.startsWith("kakao")) providers.add("kakao");
    else if (cat.id === "naver") providers.add("naver");
    else providers.add("generic");
  });
  if (providers.size === 0) return "unknown";
  if (providers.size > 1) return "mixed";
  return [...providers][0];
}

function providerFromCategoryId(categoryId: CategoryId): PlatformTab {
  if (categoryId.startsWith("kakao")) return "kakao";
  if (categoryId === "naver") return "naver";
  return "generic";
}

function categoryIdsForProvider(provider: PlatformTab): CategoryId[] {
  if (provider === "kakao") return ["kakao", "kakao_collect", "kakao_collect_extra", "kakao_provider"];
  if (provider === "naver") return ["naver"];
  return ["generic"];
}

function providerFromDataset(dataset: Dataset): PlatformTab | "mixed" | "unknown" {
  return providerFromCategories(
    (Object.keys(dataset) as CategoryId[]).flatMap((id) => {
      const tab = dataset[id];
      return tab ? [{ id, rows: tab.rows, source: tab.source, note: tab.note ?? undefined, mergeDedupe: false }] : [];
    })
  );
}

function providerFromText(text: string): PlatformTab | "unknown" {
  const lower = text.toLowerCase();
  if (lower.includes("kakao") || lower.includes("카카오") || lower.includes("privacyinfos")) return "kakao";
  if (lower.includes("naver") || lower.includes("네이버") || lower.includes("token_list")) return "naver";
  return "unknown";
}

function providerFromReadResults(results: ({ text: string; name: string } | null)[]): PlatformTab | "mixed" | "unknown" {
  const providers = new Set<PlatformTab>();
  results.forEach((result) => {
    if (!result) return;
    const provider = providerFromText(result.text);
    if (provider !== "unknown") providers.add(provider);
  });
  if (providers.size === 0) return "unknown";
  if (providers.size > 1) return "mixed";
  return [...providers][0];
}

function cleanupKeyForRow(categoryId: CategoryId, row: NormalizedRow, rowIndex: number) {
  return [categoryId, rowIndex, row.serviceName, row.rawItemText].join(CLEANUP_KEY_SEPARATOR);
}

function serviceNameFromCleanupKey(key: string) {
  return key.split(CLEANUP_KEY_SEPARATOR)[2] ?? key;
}

function providerFromCleanupKey(key: string): CleanupServiceItem["provider"] {
  const categoryId = key.split(CLEANUP_KEY_SEPARATOR)[0] ?? "";
  if (categoryId.startsWith("kakao")) return "kakao";
  if (categoryId === "naver") return "naver";
  if (categoryId === "generic") return "generic";
  return "unknown";
}

function isCleanupEligibleCategory(categoryId: CategoryId) {
  return categoryId === "naver" || categoryId === "kakao" || categoryId === "generic";
}

function cleanupServiceItemsFromSelection(selected: Set<string>, customServiceName: string): CleanupServiceItem[] {
  const items = [...selected]
    .filter((key) => isCleanupEligibleCategory(key.split(CLEANUP_KEY_SEPARATOR)[0] as CategoryId))
    .map((key) => ({
      service: serviceNameFromCleanupKey(key),
      provider: providerFromCleanupKey(key),
    }));

  if (customServiceName) {
    items.push({
      service: customServiceName,
      provider: "custom",
    });
  }

  const merged = new Map<string, CleanupServiceItem>();
  items.forEach((item) => {
    const key = item.service.toLocaleLowerCase();
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, item);
      return;
    }

    if (existing.provider !== item.provider) {
      merged.set(key, { ...existing, provider: "mixed" });
    }
  });

  return [...merged.values()];
}

function isHarText(text: string, filename: string) {
  if (/\.har$/i.test(filename)) return true;

  try {
    const json = JSON.parse(text.trim()) as { log?: { entries?: unknown[] } };
    return Array.isArray(json.log?.entries);
  } catch {
    return false;
  }
}

function acceptedCategoriesForPoc(
  result: { text: string; name: string },
  categories: ParsedCategory[]
): { categories: ParsedCategory[]; provider: PlatformTab | "unknown"; error?: keyof CypressContent["errors"] } {
  const naverCategories = categories.filter((cat) => cat.id === "naver");
  if (naverCategories.length > 0) {
    if (!isHarText(result.text, result.name)) return { categories: [], provider: "naver", error: "naverHarRequired" };

    const usableNaverCategories = naverCategories.filter((cat) => cat.rows.length > 0);
    if (!usableNaverCategories.length) return { categories: [], provider: "naver", error: "harUnrecognized" };
    return { categories: usableNaverCategories, provider: "naver" };
  }

  const kakaoThirdPartyCategories = categories.filter((cat) => cat.id === "kakao" && cat.rows.length > 0);
  if (kakaoThirdPartyCategories.length > 0) {
    return { categories: kakaoThirdPartyCategories, provider: "kakao" };
  }

  if (categories.some((cat) => cat.id.startsWith("kakao"))) {
    return { categories: [], provider: "kakao", error: "kakaoThirdPartyRequired" };
  }

  return { categories: [], provider: "unknown", error: "fileTypeUnrecognized" };
}

function gradeToneClass(cls: string) {
  switch (cls) {
    case "g5":
      return "border-[#8f7768]/50 bg-[#eadfd8]/70 text-[#5d4035]";
    case "g4":
      return "border-[#b6a080]/55 bg-[#f0e6d5]/75 text-[#6b5738]";
    case "g3":
      return "border-[#91a5aa]/55 bg-[#e5eef0]/80 text-[#385862]";
    case "g2":
      return "border-[#aeb8a8]/60 bg-[#edf1e8]/80 text-[#52664b]";
    default:
      return "border-stone bg-[#f6f3ed] text-fog";
  }
}

function categoryChipClass(id: string, active: boolean) {
  const base = "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors";
  if (active) return `${base} border-slate bg-slate text-ivory`;
  switch (id) {
    case "reident":
    case "finance":
    case "location":
      return `${base} border-[#b6a080]/55 bg-[#f0e6d5]/70 text-[#6b5738] hover:border-[#8f7768]`;
    case "address":
    case "phone":
    case "email":
      return `${base} border-[#91a5aa]/55 bg-[#e5eef0]/75 text-[#385862] hover:border-[#6f8c95]`;
    case "behavior":
    case "friends":
      return `${base} border-[#aeb8a8]/60 bg-[#edf1e8]/75 text-[#52664b] hover:border-[#85947c]`;
    default:
      return `${base} border-stone bg-[#fbfaf7] text-fog hover:border-slate/45 hover:text-slate`;
  }
}

function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (!/^https?:\/\//.test(part)) return <span key={`${part}-${index}`}>{part}</span>;

        const trailing = part.match(/[.,;:!?)]$/)?.[0] ?? "";
        const href = trailing ? part.slice(0, -1) : part;

        return (
          <span key={`${href}-${index}`}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate underline decoration-stone underline-offset-2">
              {href}
            </a>
            {trailing}
          </span>
        );
      })}
    </>
  );
}

function applyScore(categoryId: CategoryId, r: NormalizedRow): NormalizedRow {
  if (!SCORED_CATEGORIES.includes(categoryId)) return r;
  const contextMultiplier = categoryId === "kakao" || categoryId === "naver" ? 1.3 : 1.0;
  const daysSince = r.lastUsedTimestamp ? Math.floor((Date.now() - r.lastUsedTimestamp) / 86400000) : null;
  const stale = staleMultiplier(daysSince);
  const matched = classify(r.rawItemText);
  const risk = scoreFromCategories(matched, contextMultiplier, stale.mult > 1 ? stale : undefined);
  return { ...r, risk };
}

function computeTabAnalytics(rows: NormalizedRow[], hasRisk: boolean) {
  const byName = new Map<string, { maxScore: number; matchedIds: Set<string> }>();
  rows.forEach((r) => {
    if (!byName.has(r.serviceName)) byName.set(r.serviceName, { maxScore: 0, matchedIds: new Set() });
    const entry = byName.get(r.serviceName)!;
    if (r.risk) {
      entry.maxScore = Math.max(entry.maxScore, r.risk.score);
      r.risk.matched.forEach((m) => entry.matchedIds.add(m.id));
    }
  });
  let highRisk = 0;
  const catCounts: Record<string, number> = {};
  byName.forEach((entry) => {
    if (hasRisk && entry.maxScore >= HIGH_RISK_THRESHOLD) highRisk++;
    entry.matchedIds.forEach((id) => {
      catCounts[id] = (catCounts[id] || 0) + 1;
    });
  });
  return { total: byName.size, highRisk, catCounts };
}

function trackPocEvent(event: LetheEventName, properties: LetheEventProperties = {}) {
  track(event, properties);
  void recordLetheEvent(event, properties);
}

export default function CypressClient() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const t = CYPRESS_CONTENT[locale];

  const [dataset, setDataset] = useState<Dataset>({});
  const [platformTabOverride, setPlatformTabOverride] = useState<PlatformTab | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [sortByRisk, setSortByRisk] = useState(false);
  const [stage, setStage] = useState<"idle" | "reading" | "parsing" | "done">("idle");
  const [errors, setErrors] = useState<(keyof CypressContent["errors"])[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileStatus[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [cleanupStep, setCleanupStep] = useState<CleanupStep>("results");
  const [cleanupMode, setCleanupMode] = useState(false);
  const [cleanupSubmitting, setCleanupSubmitting] = useState(false);
  const [cleanupSelected, setCleanupSelected] = useState<Set<string>>(new Set());
  const [customServiceEnabled, setCustomServiceEnabled] = useState(false);
  const [customService, setCustomService] = useState("");
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cleanupSectionRef = useRef<HTMLElement>(null);

  const requestSingle = useCallback(
    (serviceName: string) => {
      setRequested((prev) => {
        if (prev.has(serviceName)) return prev;
        track("lethe_delete_request_submit_single", { service_name: serviceName, ui_surface: "service_card", language: locale });
        const next = new Set(prev);
        next.add(serviceName);
        return next;
      });
    },
    [locale]
  );

  const onMailtoClick = useCallback(
    (serviceName: string) => {
      track("lethe_delete_mailto_click", { service_name: serviceName, ui_surface: "service_card", language: locale });
    },
    [locale]
  );

  const resetUploadedFiles = useCallback(() => {
    setDataset({});
    setUploadedFiles([]);
    setErrors([]);
    setStage("idle");
    setPlatformTabOverride(null);
    setSearch("");
    setActiveCategoryFilter(null);
    setSortByRisk(false);
    setCleanupStep("results");
    setCleanupMode(false);
    setCleanupSelected(new Set());
    setCustomServiceEnabled(false);
    setCustomService("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const clearUploadedProvider = useCallback((provider: PlatformTab) => {
    setDataset((prev) => {
      const next: Dataset = { ...prev };
      categoryIdsForProvider(provider).forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setUploadedFiles((prev) => prev.filter((file) => file.provider !== provider));
    setCleanupSelected((prev) => {
      const next = new Set(prev);
      [...next].forEach((key) => {
        const categoryId = key.split(CLEANUP_KEY_SEPARATOR)[0] as CategoryId;
        if (providerFromCategoryId(categoryId) === provider) next.delete(key);
      });
      return next;
    });
    setErrors([]);
    setStage("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const hasKakao = Boolean(dataset.kakao || dataset.kakao_collect || dataset.kakao_provider);
  const hasNaver = Boolean(dataset.naver);
  const hasGeneric = Boolean(dataset.generic);
  const hasAnyData = hasKakao || hasNaver || hasGeneric;

  const defaultPlatformTab: PlatformTab | null = hasKakao ? "kakao" : hasNaver ? "naver" : hasGeneric ? "generic" : null;
  const platformTab = platformTabOverride ?? defaultPlatformTab;
  const setPlatformTab = setPlatformTabOverride;

  const defaultKakaoSubTab: CategoryId = dataset.kakao ? "kakao" : dataset.kakao_collect ? "kakao_collect" : "kakao_provider";

  const activeCategoryId: CategoryId | null = platformTab === "kakao" ? defaultKakaoSubTab : platformTab;
  const activeTab = activeCategoryId ? dataset[activeCategoryId] : undefined;

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const files = [...fileList].slice(0, 1);
    setStage("reading");

    const readers = files.map(
      (file) =>
        new Promise<{ text: string; name: string } | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ text: String(reader.result ?? ""), name: file.name });
          reader.onerror = () => resolve(null);
          reader.readAsText(file, "UTF-8");
        })
    );

    Promise.all(readers).then((results) => {
      setStage("parsing");
      const startedAt = performance.now();
      const startedProvider = providerFromReadResults(results);
      trackPocEvent("analysis_started", { provider: startedProvider, file_count: files.length });

      const newErrors: (keyof CypressContent["errors"])[] = [];
      const parsedByFile: ParsedCategory[][] = [];
      const nextUploadedFiles: UploadedFileStatus[] = [];
      for (const result of results) {
        if (!result) {
          newErrors.push("fileTypeUnrecognized");
          continue;
        }
        let categories: ParsedCategory[];
        try {
          categories = parseFile(result.text, result.name);
        } catch {
          newErrors.push("fileTypeUnrecognized");
          continue;
        }
        if (!categories.length) {
          newErrors.push("fileTypeUnrecognized");
          continue;
        }
        const accepted = acceptedCategoriesForPoc(result, categories);
        if (accepted.error) {
          newErrors.push(accepted.error);
          continue;
        }

        parsedByFile.push(accepted.categories);
        nextUploadedFiles.push({
          name: result.name,
          provider: accepted.provider,
          status: "ready",
        });
      }

      setUploadedFiles((prev) => {
        const replacementProviders = new Set(
          nextUploadedFiles.map((file) => file.provider).filter((item): item is PlatformTab => item === "kakao" || item === "naver" || item === "generic")
        );
        return [...prev.filter((file) => !replacementProviders.has(file.provider as PlatformTab)), ...nextUploadedFiles];
      });

      if (parsedByFile.length) {
        const parsedCategories = parsedByFile.flat();
        const provider = providerFromCategories(parsedCategories);
        const replacementProviders = new Set(
          parsedCategories
            .map((cat) => providerFromCategoryId(cat.id))
            .filter((item): item is PlatformTab => item === "kakao" || item === "naver" || item === "generic")
        );

        setDataset((prev) => {
          const next: Dataset = { ...prev };
          replacementProviders.forEach((item) => {
            categoryIdsForProvider(item).forEach((id) => {
              delete next[id];
            });
          });
          for (const categories of parsedByFile) {
            for (const cat of categories) {
              const scoredRows = cat.rows.map((r) => applyScore(cat.id, r));
              next[cat.id] = {
                rows: scoredRows,
                source: cat.source,
                note: cat.note ?? null,
                comparable: COMPARABLE_CATEGORIES.includes(cat.id),
              };
            }
          }
          return next;
        });
        setCleanupSelected((prev) => {
          const next = new Set(prev);
          [...next].forEach((key) => {
            const categoryId = key.split(CLEANUP_KEY_SEPARATOR)[0] as CategoryId;
            if (replacementProviders.has(providerFromCategoryId(categoryId))) next.delete(key);
          });
          return next;
        });
        trackPocEvent("analysis_completed", { provider, duration_ms: Math.round(performance.now() - startedAt) });
      }

      if (newErrors.length) {
        newErrors.forEach((errorType) => {
          trackPocEvent("analysis_failed", { provider: startedProvider, error_type: errorType });
        });
      }
      setErrors(newErrors);
      setStage("done");
    });
  }, []);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer?.files ?? null);
  };

  useEffect(() => {
    document.body.classList.toggle("cypress-printing", reportOpen);
    return () => document.body.classList.remove("cypress-printing");
  }, [reportOpen]);

  const activeRows = useMemo(() => activeTab?.rows ?? [], [activeTab]);
  const activeHasRisk = activeCategoryId ? SCORED_CATEGORIES.includes(activeCategoryId) && activeRows.some((r) => r.risk) : false;
  const activeAnalytics = useMemo(() => computeTabAnalytics(activeRows, activeHasRisk), [activeRows, activeHasRisk]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = activeRows.map((row, originalIndex) => ({ row, originalIndex }));
    if (q) rows = rows.filter(({ row }) => row.serviceName.toLowerCase().includes(q));
    if (activeCategoryFilter) {
      rows = rows.filter(({ row }) => row.risk?.matched.some((m) => m.id === activeCategoryFilter));
    }
    if (sortByRisk && activeHasRisk) {
      rows = rows.slice().sort((a, b) => (b.row.risk?.score ?? 0) - (a.row.risk?.score ?? 0));
    }
    return rows;
  }, [activeRows, search, activeCategoryFilter, sortByRisk, activeHasRisk]);

  const unavailableServices = useMemo(() => {
    const names = new Set<string>();
    (Object.keys(dataset) as CategoryId[]).forEach((id) => {
      if (!SCORED_CATEGORIES.includes(id)) return;
      dataset[id]?.rows.forEach((r) => {
        if (!SERVICE_EMAIL_MAP[r.serviceName] && !requested.has(r.serviceName)) names.add(r.serviceName);
      });
    });
    return [...names];
  }, [dataset, requested]);

  const openCleanupReview = () => {
    trackPocEvent("cleanup_interest_clicked", { provider: providerFromDataset(dataset), language: locale });
    setCleanupMode(true);
    requestAnimationFrame(() => {
      cleanupSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleCleanupService = (cleanupKey: string) => {
    const categoryId = cleanupKey.split(CLEANUP_KEY_SEPARATOR)[0] as CategoryId;
    if (!isCleanupEligibleCategory(categoryId)) return;

    setCleanupSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cleanupKey)) next.delete(cleanupKey);
      else next.add(cleanupKey);
      return next;
    });
  };

  const submitCleanupReview = async () => {
    const custom = customService.trim();
    const serviceItems = cleanupServiceItemsFromSelection(cleanupSelected, customServiceEnabled ? custom : "");
    const selectedServices = serviceItems.map((item) => item.service);
    if (selectedServices.length === 0 || cleanupSubmitting) return;
    setCleanupSubmitting(true);

    trackPocEvent("cleanup_priority_submitted", {
      selected_count: selectedServices.length,
      custom_service_added: Boolean(customServiceEnabled && custom),
      language: locale,
    });
    const result = await recordCleanupRequest(selectedServices, serviceItems);
    setCleanupSubmitting(false);

    if (result?.id) {
      router.push(`/cleanup?request=${encodeURIComponent(result.id)}`);
      return;
    }

    setCleanupStep("thanks");
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const cleanupSelectionCount = cleanupSelected.size + (customServiceEnabled && customService.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-ivory text-slate">
      <header className="border-b border-stone">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" aria-label="Lethe home" className="relative block h-8 w-28 shrink-0 md:h-10 md:w-36">
            <Image src="/brand/textlogowB.svg" alt="Lethe" fill priority className="object-contain object-left" sizes="144px" />
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={openPrivacyModal}
              className="hidden min-h-[36px] items-center text-xs tracking-widest text-slate-400 transition-colors hover:text-slate md:flex"
            >
              {t.footer.privacy}
            </button>

            <div className="flex items-center gap-1">
            {(["ko", "en", "ja"] as const).map((code, i) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`min-h-[36px] px-2 text-xs tracking-widest transition-colors ${
                  locale === code ? "font-medium text-slate" : "text-slate-400 hover:text-slate-600"
                } ${i < 2 ? "border-r border-stone" : ""}`}
              >
                {code.toUpperCase()}
              </button>
            ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-16">
        {!hasAnyData && (
          <section className="mb-12">
            <p className="mb-3 font-mono text-xs tracking-[0.14em] text-fog uppercase">{t.hero.eyebrow}</p>
            <h1 className="max-w-2xl font-display text-3xl leading-tight md:text-4xl">{t.hero.title}</h1>
            <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-7 text-fog">{t.hero.body}</p>

            <details id="howto" className="mt-8 border border-stone">
              <summary className="cursor-pointer px-5 py-3 text-sm text-fog">{t.cta.howTo}</summary>
              <div className="space-y-6 px-5 pb-6 text-sm">
                <div>
                  <p className="mb-2 font-medium">{t.howto.kakaoTitle}</p>
                  <ol className="list-decimal space-y-1 pl-5 text-fog">
                    {t.howto.kakaoSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="mb-2 font-medium">{t.howto.naverTitle}</p>
                  <ol className="list-decimal space-y-1 pl-5 text-fog">
                    {t.howto.naverSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="grid gap-px overflow-hidden border border-stone bg-stone sm:grid-cols-2">
                  <div className="bg-ivory p-4">
                    <p className="text-xs font-medium">{t.formats.kakaoTitle}</p>
                    <p className="mt-1 text-xs text-fog">{t.formats.kakaoDesc}</p>
                  </div>
                  <div className="bg-ivory p-4">
                    <p className="text-xs font-medium">{t.formats.naverTitle}</p>
                    <p className="mt-1 text-xs text-fog">{t.formats.naverDesc}</p>
                  </div>
                </div>
                <p className="text-xs text-fog">{t.formats.unsupportedNote}</p>
              </div>
            </details>

            <div className="mt-6 border-l-2 border-stone bg-mist/40 px-5 py-4">
              <p className="text-sm font-medium">{t.preStart.title}</p>
              <p className="mt-2 text-xs leading-6 text-fog">{t.preStart.body}</p>
              <p className="mt-1 text-xs text-fog">{t.preStart.legalNote}</p>
              <button type="button" onClick={openPrivacyModal} className="mt-3 text-xs text-slate underline decoration-stone underline-offset-4">
                {t.preStart.privacyLink}
              </button>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-stone bg-stone sm:grid-cols-3">
              <div className="bg-ivory p-5">
                <p className="text-sm font-medium">{t.trust.localTitle}</p>
                <p className="mt-2 text-xs leading-6 text-fog">{t.footer.local}</p>
              </div>
              <div className="bg-ivory p-5">
                <p className="text-sm font-medium">{t.trust.storageTitle}</p>
                <p className="mt-2 text-xs leading-6 text-fog">{t.trust.storageBody}</p>
              </div>
              <div className="bg-ivory p-5">
                <p className="text-sm font-medium">{t.trust.opennessTitle}</p>
                <p className="mt-2 text-xs leading-6 text-fog">{t.disclaimer.scoreMeaning}</p>
              </div>
            </div>
          </section>
        )}

        <section id="upload">
          <div
            data-testid="cypress-dropzone"
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border p-5 transition-colors ${
              dragActive ? "border-slate bg-mist" : "border-stone bg-ivory"
            }`}
          >
            <div className="flex flex-col gap-3 border-b border-stone pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm">{t.dropzone.main}</p>
                <p className="mt-2 max-w-xl text-xs leading-6 text-fog">{t.dropzone.sub}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={resetUploadedFiles}
                    className="border border-stone px-4 py-2 text-xs text-fog transition-colors hover:border-slate hover:text-slate"
                  >
                    {t.dropzone.clearFiles}
                  </button>
                )}
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="border border-slate bg-slate px-4 py-2 text-xs text-ivory transition-colors hover:bg-slate-700"
                >
                  {t.dropzone.chooseFiles}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <UploadSlot
                title="Kakao"
                expected={t.dropzone.kakaoExpected}
                files={uploadedFiles.filter((file) => file.provider === "kakao")}
                active={dragActive}
                onClick={openFilePicker}
                onClear={() => clearUploadedProvider("kakao")}
                t={t}
              />
              <UploadSlot
                title="Naver"
                expected={t.dropzone.naverExpected}
                files={uploadedFiles.filter((file) => file.provider === "naver")}
                active={dragActive}
                onClick={openFilePicker}
                onClear={() => clearUploadedProvider("naver")}
                t={t}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.json,.har"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-fog">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate/60" />
            {t.dropzone.privacyNote}
          </p>

          {stage === "reading" || stage === "parsing" ? (
            <p className="mt-3 text-center text-xs text-fog">{stage === "reading" ? t.progress.reading : t.progress.parsing}</p>
          ) : null}

          {errors.map((key, i) => (
            <div key={i} className="mt-3 border border-warm-beige/60 bg-warm-beige/10 px-4 py-3 text-xs text-slate">
              {t.errors[key]}
            </div>
          ))}

        </section>

        {hasAnyData && activeCategoryId && (
          <section className="mt-14">
            <div className="border-l-2 border-warm-beige bg-warm-beige/10 px-5 py-4 text-xs leading-6 text-slate">
              <p>{t.disclaimer.snapshot}</p>
              <p className="mt-1">{t.disclaimer.scoreMeaning}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="border border-slate px-4 py-2 text-xs tracking-wide text-slate transition-colors hover:bg-slate hover:text-ivory"
                >
                  {t.report.button}
                </button>
              </div>
            </div>

            <CleanupReviewSection
              ref={cleanupSectionRef}
              t={t}
              mode={cleanupMode}
              step={cleanupStep}
              selected={cleanupSelected}
              customServiceEnabled={customServiceEnabled}
              customService={customService}
              submitting={cleanupSubmitting}
              onStart={openCleanupReview}
              onToggleCustom={() => setCustomServiceEnabled((value) => !value)}
              onCustomServiceChange={setCustomService}
              onSubmit={submitCleanupReview}
              onBack={() => {
                setCleanupStep("results");
                setCleanupMode(false);
              }}
            />

            <div className="mt-6 flex gap-1 border-b border-stone">
              {(["kakao", "naver", "generic"] as PlatformTab[])
                .filter((p) => (p === "kakao" ? hasKakao : p === "naver" ? hasNaver : hasGeneric))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatformTab(p)}
                    className={`px-4 py-2.5 text-sm transition-colors ${
                      platformTab === p ? "border-b-2 border-slate text-slate" : "text-fog hover:text-slate"
                    }`}
                  >
                    {p === "kakao" ? t.tabs.kakao : p === "naver" ? t.tabs.naver : t.tabs.generic}
                  </button>
                ))}
            </div>

            <div className="mt-6 grid gap-px overflow-hidden border border-stone bg-stone sm:grid-cols-2">
              <div className="bg-ivory p-4">
                <p className="font-mono text-2xl">{activeAnalytics.total}</p>
                <p className="mt-1 text-xs text-fog">{t.summary.serviceCount}</p>
              </div>
              <div className="bg-ivory p-4">
                {activeHasRisk ? (
                  <>
                    <p className="font-mono text-2xl">{activeAnalytics.highRisk}</p>
                    <p className="mt-1 text-xs text-fog">{t.summary.sensitiveCount}</p>
                  </>
                ) : (
                  <p className="text-xs text-fog">{t.summary.noScoreNote}</p>
                )}
              </div>
            </div>

            <p className="mt-3 inline-block font-mono text-[11px] text-fog">
              {activeTab?.comparable ? t.summary.comparableTag : t.summary.platformOnlyTag}
            </p>

            {activeHasRisk && Object.keys(activeAnalytics.catCounts).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(activeAnalytics.catCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, count]) => {
                    const cat = TAXONOMY.find((c) => c.id === id);
                    const active = activeCategoryFilter === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveCategoryFilter((current) => (current === id ? null : id))}
                        className={categoryChipClass(id, active)}
                        aria-pressed={active}
                      >
                        {cat?.label[locale] ?? id} <b className={active ? "text-ivory" : "text-slate"}>{count}</b>
                      </button>
                    );
                  })}
                {activeCategoryFilter && (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryFilter(null)}
                    className="rounded-full border border-stone bg-transparent px-3 py-1 font-mono text-[11px] text-fog transition-colors hover:border-slate/45 hover:text-slate"
                  >
                    {t.toolbar.clearCategoryFilter}
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.toolbar.searchPlaceholder}
                className="min-h-11 flex-1 border border-stone bg-ivory px-3 text-sm focus:border-slate focus:outline-none"
              />
              {activeHasRisk && (
                <button
                  type="button"
                  onClick={() => setSortByRisk((v) => !v)}
                  className={`min-h-11 border px-4 text-xs tracking-wide transition-colors ${
                    sortByRisk ? "border-slate bg-slate text-ivory" : "border-stone text-fog hover:text-slate"
                  }`}
                >
                  {t.toolbar.sortButton}
                </button>
              )}
            </div>

            <details className="mt-6 border border-stone">
              <summary className="cursor-pointer px-5 py-3 font-mono text-xs text-fog">{t.methodology.summary}</summary>
              <div className="space-y-3 px-5 pb-5 text-xs leading-6 text-fog">
                <p>{t.methodology.intro}</p>
                <div className="mt-2 space-y-1">
                  {TAXONOMY.slice()
                    .sort((a, b) => b.weight - a.weight)
                    .map((cat) => (
                      <div key={cat.id} className="flex items-baseline gap-2">
                        <span className="w-5 text-right font-mono text-slate">{cat.weight}</span>
                        <span>{cat.label[locale]}</span>
                      </div>
                    ))}
                </div>
              </div>
            </details>

            {activeTab?.note && (
              <div className="mt-4 border border-warm-beige/60 bg-warm-beige/10 px-4 py-3 text-xs text-slate">{activeTab.note[locale]}</div>
            )}

            <div className="mt-4 border border-stone">
              {filteredRows.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-fog">{t.rows.emptyResult}</div>
              ) : (
                filteredRows.map(({ row: r, originalIndex }, i) => (
                  <RowCard
                    key={cleanupKeyForRow(activeCategoryId, r, originalIndex)}
                    row={r}
                    index={i}
                    locale={locale}
                    t={t}
                    deleteEligible={false}
                    supportEmail={SERVICE_EMAIL_MAP[r.serviceName]}
                    isRequested={requested.has(r.serviceName)}
                    onRequestSingle={requestSingle}
                    onMailtoClick={onMailtoClick}
                    cleanupMode={cleanupMode && isCleanupEligibleCategory(activeCategoryId)}
                    cleanupKey={cleanupKeyForRow(activeCategoryId, r, originalIndex)}
                    cleanupSelected={cleanupSelected.has(cleanupKeyForRow(activeCategoryId, r, originalIndex))}
                    onToggleCleanup={toggleCleanupService}
                  />
                ))
              )}
            </div>

            {activeCategoryId === "kakao_collect" && dataset.kakao_collect_extra && dataset.kakao_collect_extra.rows.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-medium">{t.tabs.kakaoCollectExtra}</h2>
                {dataset.kakao_collect_extra.note && (
                  <div className="mt-3 border border-warm-beige/60 bg-warm-beige/10 px-4 py-3 text-xs text-slate">
                    {dataset.kakao_collect_extra.note[locale]}
                  </div>
                )}
                <div className="mt-3 border border-stone">
                  {dataset.kakao_collect_extra.rows
                    .map((row, originalIndex) => ({ row, originalIndex }))
                    .filter(({ row }) => !activeCategoryFilter || row.risk?.matched.some((m) => m.id === activeCategoryFilter))
                    .map(({ row: r, originalIndex }, i) => (
                      <RowCard
                        key={cleanupKeyForRow("kakao_collect_extra", r, originalIndex)}
                        row={r}
                        index={i}
                        locale={locale}
                        t={t}
                        deleteEligible={false}
                        supportEmail={SERVICE_EMAIL_MAP[r.serviceName]}
                        isRequested={requested.has(r.serviceName)}
                        onRequestSingle={requestSingle}
                        onMailtoClick={onMailtoClick}
                        cleanupMode={cleanupMode && isCleanupEligibleCategory("kakao_collect_extra")}
                        cleanupKey={cleanupKeyForRow("kakao_collect_extra", r, originalIndex)}
                        cleanupSelected={cleanupSelected.has(cleanupKeyForRow("kakao_collect_extra", r, originalIndex))}
                        onToggleCleanup={toggleCleanupService}
                      />
                    ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {hasAnyData && cleanupStep === "results" && (
        <FloatingCleanupControls
          t={t}
          cleanupMode={cleanupMode}
          selectedCount={cleanupSelectionCount}
          onCleanupClick={() => {
            if (cleanupMode) {
              cleanupSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              openCleanupReview();
            }
          }}
        />
      )}

      <footer className="mt-16 border-t border-stone">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-2 md:px-10">
          {t.footer.disclosures.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-medium text-slate">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-xs leading-6 text-fog">{section.body}</p>
            </section>
          ))}
        </div>
      </footer>

      {reportOpen && (
        <ReportOverlay dataset={dataset} locale={locale} t={t} onClose={() => setReportOpen(false)} />
      )}

      {bulkModalOpen && (
        <BulkRequestModal
          services={unavailableServices}
          t={t}
          onCancel={() => setBulkModalOpen(false)}
          onConfirm={(selected) => {
            track("lethe_delete_request_submit_bulk", { services_count: selected.length, ui_surface: "bulk_modal", language: locale });
            setRequested((prev) => new Set([...prev, ...selected]));
            setBulkModalOpen(false);
          }}
        />
      )}

      <PrivacyModal />
    </div>
  );
}

const CleanupReviewSection = forwardRef<HTMLElement, {
  t: (typeof CYPRESS_CONTENT)["ko"];
  mode: boolean;
  step: CleanupStep;
  selected: Set<string>;
  customServiceEnabled: boolean;
  customService: string;
  submitting: boolean;
  onStart: () => void;
  onToggleCustom: () => void;
  onCustomServiceChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}>(function CleanupReviewSection({
  t,
  mode,
  step,
  selected,
  customServiceEnabled,
  customService,
  submitting,
  onStart,
  onToggleCustom,
  onCustomServiceChange,
  onSubmit,
  onBack,
}, ref) {
  const canSubmit = selected.size > 0 || (customServiceEnabled && customService.trim().length > 0);

  if (step === "thanks") {
    return (
      <section ref={ref} className="mt-8 border border-stone bg-[#fbfaf7] px-6 py-8 md:px-8">
        <p className="font-mono text-xs tracking-[0.16em] text-fog uppercase">{t.cleanupReview.thanksEyebrow}</p>
        <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{t.cleanupReview.thanksTitle}</h2>
        <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-fog">{t.cleanupReview.thanksBody}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-8 inline-flex min-h-11 items-center border border-slate bg-slate px-5 py-2.5 text-xs tracking-[0.16em] text-ivory transition-opacity hover:opacity-90"
        >
          {t.cleanupReview.returnButton}
        </button>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`mt-8 border px-6 md:px-8 ${
        mode
          ? "border-stone bg-[#fbfaf7] py-8"
          : "border-[#163140] bg-[#0b1e29] py-6 text-ivory shadow-[0_18px_50px_rgba(35,48,58,0.12)]"
      }`}
    >
      <div className={`grid gap-6 ${mode ? "md:grid-cols-[0.85fr_1.15fr] md:gap-14" : "md:grid-cols-[1fr_auto] md:items-center"}`}>
        <div>
          <p className={`font-mono text-xs tracking-[0.16em] uppercase ${mode ? "text-fog" : "text-white/50"}`}>{t.cleanupReview.eyebrow}</p>
          <h2 className={`mt-4 max-w-xl font-display leading-tight ${mode ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
            {t.cleanupReview.title}
          </h2>
          <p className={`mt-4 max-w-lg whitespace-pre-line text-sm leading-7 ${mode ? "text-fog" : "text-white/62"}`}>{t.cleanupReview.body}</p>
        </div>
        {!mode && (
          <div className="md:justify-self-end">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-11 items-center border border-white/70 px-5 py-2.5 text-xs tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-slate"
            >
              {t.cleanupReview.cta}
            </button>
          </div>
        )}

        {mode && (
        <div className="border border-stone bg-ivory p-5 md:p-7">
          <div className="flex items-baseline justify-between gap-4 border-b border-stone pb-4">
            <p className="text-sm text-slate">{t.cleanupReview.selectionGuide}</p>
            <span className="shrink-0 font-mono text-xs text-fog">{t.cleanupReview.selectedCount(selected.size)}</span>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex min-h-12 cursor-pointer items-center gap-3 border border-stone bg-ivory px-4 py-3 text-sm transition-colors hover:border-slate/40">
              <input type="checkbox" checked={customServiceEnabled} onChange={onToggleCustom} className="h-5 w-5 accent-slate" />
              <span>{t.cleanupReview.customOption}</span>
            </label>
            {customServiceEnabled && (
              <input
                type="text"
                value={customService}
                onChange={(e) => onCustomServiceChange(e.target.value)}
                placeholder={t.cleanupReview.customPlaceholder}
                className="min-h-12 w-full border border-stone bg-ivory px-4 text-sm focus:border-slate focus:outline-none"
              />
            )}
          </div>

          <p className="mt-5 whitespace-pre-line border-t border-stone pt-5 text-xs leading-6 text-fog">{t.cleanupReview.privacyNote}</p>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
            className="mt-6 min-h-12 w-full bg-slate px-6 py-3 text-xs tracking-[0.16em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-35"
          >
            {submitting ? t.cleanupReview.submitting : t.cleanupReview.submit}
          </button>
        </div>
        )}
      </div>
    </section>
  );
});

function FloatingCleanupControls({
  t,
  cleanupMode,
  selectedCount,
  onCleanupClick,
}: {
  t: (typeof CYPRESS_CONTENT)["ko"];
  cleanupMode: boolean;
  selectedCount: number;
  onCleanupClick: () => void;
}) {
  const label = cleanupMode ? t.cleanupReview.selectedCount(selectedCount) : t.cleanupReview.cta;

  return (
    <div
      className={`fixed right-5 top-[58vh] z-40 hidden -translate-y-1/2 items-center overflow-hidden border bg-[#fbfaf7]/88 text-slate shadow-[0_18px_46px_rgba(35,48,58,0.14)] backdrop-blur-md transition-all duration-300 md:inline-flex ${
        cleanupMode ? "border-slate/55" : "border-stone/80"
      }`}
    >
      <button
        type="button"
        aria-label="Top"
        title="Top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-12 w-11 items-center justify-center border-r border-stone/70 text-base text-fog transition-colors hover:bg-mist/70 hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate focus-visible:outline-offset-[-2px]"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onCleanupClick}
        className={`flex h-12 min-w-[148px] items-center justify-center px-5 text-[11px] tracking-[0.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate focus-visible:outline-offset-[-2px] ${
          cleanupMode ? "bg-slate text-ivory hover:bg-slate-700" : "text-slate hover:bg-mist/70"
        }`}
      >
        {label}
      </button>
      <button
        type="button"
        aria-label="Bottom"
        title="Bottom"
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
        className="flex h-12 w-11 items-center justify-center border-l border-stone/70 text-base text-fog transition-colors hover:bg-mist/70 hover:text-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate focus-visible:outline-offset-[-2px]"
      >
        ↓
      </button>
    </div>
  );
}

function UploadSlot({
  title,
  expected,
  files,
  active,
  onClick,
  onClear,
  t,
}: {
  title: string;
  expected: string;
  files: UploadedFileStatus[];
  active: boolean;
  onClick: () => void;
  onClear: () => void;
  t: (typeof CYPRESS_CONTENT)["ko"];
}) {
  const readyFiles = files.filter((file) => file.status === "ready");

  return (
    <div
      className={`min-h-40 border p-5 text-left transition-colors ${
        active ? "border-slate bg-ivory" : "border-stone bg-[#fbfaf7] hover:border-slate/45 hover:bg-mist/45"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-fog uppercase">{title}</p>
          <p className="mt-2 text-sm text-slate">{readyFiles.length > 0 ? t.dropzone.filesReady(readyFiles.length) : t.dropzone.slotEmpty}</p>
        </div>
        <span
          className={`border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] ${
            readyFiles.length > 0 ? "border-slate text-slate" : "border-stone text-fog"
          }`}
        >
          {readyFiles.length > 0 ? t.dropzone.ready : t.dropzone.empty}
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-fog">{expected}</p>
      {readyFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {readyFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 border border-stone bg-ivory px-3 py-2">
              <p className="truncate text-xs text-slate">{file.name}</p>
              <button
                type="button"
                onClick={onClear}
                className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-fog underline decoration-stone underline-offset-4 transition-colors hover:text-slate"
              >
                {t.dropzone.clearSlot}
              </button>
            </div>
          ))}
        </div>
      )}
      {readyFiles.length === 0 && (
        <button
          type="button"
          onClick={onClick}
          className="mt-4 border border-stone px-3 py-2 text-xs text-fog transition-colors hover:border-slate hover:text-slate"
        >
          {t.dropzone.chooseFiles}
        </button>
      )}
    </div>
  );
}

function RowCard({
  row,
  index,
  locale,
  t,
  deleteEligible,
  supportEmail,
  isRequested,
  onRequestSingle,
  onMailtoClick,
  cleanupMode,
  cleanupKey,
  cleanupSelected,
  onToggleCleanup,
}: {
  row: NormalizedRow;
  index: number;
  locale: "ko" | "en" | "ja";
  t: (typeof CYPRESS_CONTENT)["ko"];
  deleteEligible: boolean;
  supportEmail?: string;
  isRequested: boolean;
  onRequestSingle: (serviceName: string) => void;
  onMailtoClick: (serviceName: string) => void;
  cleanupMode: boolean;
  cleanupKey: string;
  cleanupSelected: boolean;
  onToggleCleanup: (cleanupKey: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const risk = row.risk;
  const grade = risk && risk.score > 0 ? gradeOf(risk.score) : null;

  return (
    <div className={`border-b border-stone px-5 py-4 transition-colors last:border-b-0 ${cleanupSelected ? "bg-mist/60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        {cleanupMode && (
          <input
            type="checkbox"
            aria-label={t.cleanupReview.rowCheckboxLabel(row.serviceName)}
            checked={cleanupSelected}
            onChange={() => onToggleCleanup(cleanupKey)}
            className="mr-1 h-5 w-5 accent-slate"
          />
        )}
        <span className="font-mono text-[11px] text-fog">{String(index + 1).padStart(3, "0")}</span>
        <span className="text-sm font-medium">{row.serviceName}</span>
        {grade && (
          <span className={`rounded border px-2 py-0.5 font-mono text-[11px] ${gradeToneClass(grade.cls)}`}>
            {risk!.score} · {grade.label[locale]}
          </span>
        )}
        {risk?.staleInfo && (
          <span className="rounded border border-stone bg-mist px-2 py-0.5 font-mono text-[11px] text-slate">
            {t.rows.cleanupBadge(risk.staleInfo.days)}
          </span>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-xs">
        {row.fieldOrder.map((key) => (
          <div key={key} className="contents">
            <dt className="font-mono text-fog">{key}</dt>
            <dd className="break-words">
              <LinkifiedText text={row.fields[key] || "—"} />
            </dd>
          </div>
        ))}
        {row.link && (
          <div className="contents">
            <dt className="font-mono text-fog">URL</dt>
            <dd className="break-words">
              <a href={row.link.href} target="_blank" rel="noopener noreferrer" className="text-slate underline decoration-stone underline-offset-2">
                {row.link.label}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {risk && (risk.matched.length > 0 || risk.staleInfo) && (
        <details className="mt-3">
          <summary className="cursor-pointer font-mono text-[11px] text-fog">
            {t.rows.whyScore(risk.matched.length, Boolean(risk.staleInfo))}
          </summary>
          <ul className="mt-2 space-y-2">
            {risk.matched.map((m) => (
              <li key={m.id} className="border-l-2 border-stone bg-mist/50 px-3 py-2 text-xs">
                <span className="font-medium">{m.label[locale]}</span>
                <span className="ml-2 font-mono text-[11px] text-fog">+{m.weight}</span>
                <span className="mt-1 block text-fog">{m.rationale[locale]}</span>
              </li>
            ))}
            {risk.comboBonus && (
              <li className="border-l-2 border-stone bg-mist/50 px-3 py-2 text-xs text-fog">{t.rows.comboNote}</li>
            )}
            {risk.staleInfo && (
              <li className="border-l-2 border-stone bg-mist/50 px-3 py-2 text-xs text-fog">
                {t.rows.staleNote(risk.staleInfo.days)}
              </li>
            )}
          </ul>
        </details>
      )}

      {deleteEligible && (
        <div className="mt-3 border-t border-stone pt-3">
          {isRequested ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-forest">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest" />
              {t.deleteFlow.ctaRequested}
            </span>
          ) : supportEmail ? (
            <div>
              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent(t.deleteFlow.mailtoSubject(row.serviceName))}&body=${encodeURIComponent(
                  t.deleteFlow.mailtoBody(row.serviceName)
                )}`}
                onClick={() => onMailtoClick(row.serviceName)}
                className="inline-flex min-h-9 items-center border border-slate px-3 py-1.5 text-xs tracking-wide text-slate transition-colors hover:bg-slate hover:text-ivory"
              >
                {t.deleteFlow.ctaAvailable}
              </a>
              <p className="mt-2 text-[11px] text-fog">{t.deleteFlow.newTabNote}</p>
              <details className="mt-2">
                <summary className="cursor-pointer font-mono text-[11px] text-fog">{t.deleteFlow.mailtoFallbackIntro}</summary>
                <div className="mt-2 space-y-2">
                  <pre className="whitespace-pre-wrap border border-stone bg-mist/40 p-3 text-[11px] leading-5 text-slate">
                    {t.deleteFlow.mailtoSubject(row.serviceName)}
                    {"\n\n"}
                    {t.deleteFlow.mailtoBody(row.serviceName)}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`${t.deleteFlow.mailtoSubject(row.serviceName)}\n\n${t.deleteFlow.mailtoBody(row.serviceName)}`)
                        .then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                    }}
                    className="border border-stone px-3 py-1 font-mono text-[11px] text-fog transition-colors hover:text-slate"
                  >
                    {copied ? t.deleteFlow.copyDone : t.deleteFlow.copyButton}
                  </button>
                </div>
              </details>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onRequestSingle(row.serviceName)}
              className="inline-flex min-h-9 items-center border border-stone px-3 py-1.5 text-xs tracking-wide text-fog transition-colors hover:border-slate hover:text-slate"
            >
              {t.deleteFlow.ctaUnavailable}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function scoreClass(score: number) {
  if (score >= 60) return "text-slate font-semibold";
  if (score >= 40) return "text-slate font-medium";
  return "text-fog";
}

function ReportOverlay({
  dataset,
  locale,
  t,
  onClose,
}: {
  dataset: Dataset;
  locale: "ko" | "en" | "ja";
  t: (typeof CYPRESS_CONTENT)["ko"];
  onClose: () => void;
}) {
  const agg = useMemo(() => {
    const platformRows: { id: CategoryId; label: string; comparable: boolean; total: number; highRisk: number; hasRisk: boolean }[] = [];
    const scored: { name: string; label: string; score: number; days?: number; matched: string[] }[] = [];
    const catTotals: Record<string, Set<string>> = {};

    (Object.keys(dataset) as CategoryId[]).forEach((id) => {
      const tab = dataset[id];
      if (!tab || !tab.rows.length) return;
      const hasRisk = SCORED_CATEGORIES.includes(id);
      const label =
        id === "kakao"
          ? t.tabs.kakao
          : id === "kakao_collect"
          ? t.tabs.kakaoCollect
          : id === "kakao_collect_extra"
          ? t.tabs.kakaoCollectExtra
          : id === "kakao_provider"
          ? t.tabs.kakaoProvider
          : id === "naver"
          ? t.tabs.naver
          : t.tabs.generic;
      const analytics = computeTabAnalytics(tab.rows, hasRisk);
      platformRows.push({ id, label, comparable: COMPARABLE_CATEGORIES.includes(id), total: analytics.total, highRisk: analytics.highRisk, hasRisk });

      const seenForCat: Record<string, Set<string>> = {};
      tab.rows.forEach((r) => {
        if (r.risk) {
          scored.push({
            name: r.serviceName,
            label,
            score: r.risk.score,
            days: r.risk.staleInfo?.days,
            matched: r.risk.matched.map((m) => m.label[locale]),
          });
          r.risk.matched.forEach((m) => {
            if (!seenForCat[m.id]) seenForCat[m.id] = new Set();
            seenForCat[m.id].add(r.serviceName);
          });
        }
      });
      Object.entries(seenForCat).forEach(([id, names]) => {
        if (!catTotals[id]) catTotals[id] = new Set();
        names.forEach((n) => catTotals[id].add(`${label}::${n}`));
      });
    });

    const byKey = new Map<string, (typeof scored)[number]>();
    scored.forEach((s) => {
      const key = `${s.label}::${s.name}`;
      const prev = byKey.get(key);
      if (!prev || s.score > prev.score) byKey.set(key, s);
    });
    const dedup = [...byKey.values()];
    const top = dedup.slice().sort((a, b) => b.score - a.score).slice(0, 6);
    const cleanup = dedup
      .filter((s) => s.days != null)
      .sort((a, b) => (b.days ?? 0) - (a.days ?? 0))
      .slice(0, 6);
    const catList = Object.entries(catTotals)
      .map(([id, set]) => ({ label: TAXONOMY.find((c) => c.id === id)?.label[locale] ?? id, count: set.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return { platformRows, top, cleanup, catList };
  }, [dataset, locale, t]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const totalHigh = agg.platformRows.reduce((sum, p) => sum + (p.hasRisk ? p.highRisk : 0), 0);
    if (totalHigh > 0) recs.push(t.report.recHigh(totalHigh));
    if (agg.cleanup.length > 0) recs.push(t.report.recCleanup(agg.cleanup.length));
    const reident = agg.catList.find((c) => c.label === TAXONOMY.find((x) => x.id === "reident")?.label[locale]);
    if (reident) recs.push(t.report.recReident(reident.count));
    const finance = agg.catList.find((c) => c.label === TAXONOMY.find((x) => x.id === "finance")?.label[locale]);
    if (finance) recs.push(t.report.recFinance(finance.count));
    recs.push(t.report.recSnapshot);
    recs.push(t.report.recScoreMeaning);
    return recs;
  }, [agg, locale, t]);

  const dateStr = new Date().toLocaleString(locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US");

  return (
    <div className="cypress-report-overlay fixed inset-0 z-50 overflow-auto bg-slate/95 px-4 py-8">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] justify-end gap-3">
        <button onClick={() => window.print()} className="bg-ivory px-4 py-2 font-mono text-xs">
          {t.report.print}
        </button>
        <button onClick={onClose} className="border border-ivory px-4 py-2 font-mono text-xs text-ivory">
          {t.report.close}
        </button>
      </div>

      <div className="mx-auto min-h-[297mm] max-w-[210mm] bg-white px-10 py-10 text-[#1a1a1a] shadow-2xl">
        <h1 className="font-display text-2xl">{t.report.title}</h1>
        <p className="mt-1 text-xs text-gray-500">{t.report.generatedAt(dateStr)}</p>

        <h2 className="mt-6 border-b border-gray-200 pb-1 text-xs font-semibold uppercase tracking-wide">{t.report.overview}</h2>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="py-1 text-left font-medium">{t.report.tableHead.tab}</th>
              <th className="py-1 text-left font-medium">{t.report.tableHead.serviceCount}</th>
              <th className="py-1 text-left font-medium">{t.report.tableHead.sensitiveCount}</th>
            </tr>
          </thead>
          <tbody>
            {agg.platformRows.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-1">{p.label}</td>
                <td className="py-1">{p.total}</td>
                <td className="py-1">{p.hasRisk ? p.highRisk : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-6 border-b border-gray-200 pb-1 text-xs font-semibold uppercase tracking-wide">{t.report.topRisk}</h2>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="py-1 text-left font-medium">{t.report.topRiskHead.name}</th>
              <th className="py-1 text-left font-medium">{t.report.topRiskHead.tab}</th>
              <th className="py-1 text-left font-medium">{t.report.topRiskHead.score}</th>
              <th className="py-1 text-left font-medium">{t.report.topRiskHead.items}</th>
            </tr>
          </thead>
          <tbody>
            {agg.top.map((s, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1">{s.name}</td>
                <td className="py-1 text-gray-500">{s.label}</td>
                <td className={`py-1 font-mono ${scoreClass(s.score)}`}>{s.score}</td>
                <td className="py-1 text-gray-500">{s.matched.slice(0, 3).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-6 border-b border-gray-200 pb-1 text-xs font-semibold uppercase tracking-wide">{t.report.cleanup}</h2>
        {agg.cleanup.length ? (
          <ul className="mt-2 list-disc pl-4 text-xs">
            {agg.cleanup.map((s, i) => (
              <li key={i} className="mb-1">
                {s.name} <span className="text-gray-500">({s.label} · {s.days}{locale === "ko" ? "일" : locale === "ja" ? "日" : "d"})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-gray-500">{t.report.cleanupNone}</p>
        )}

        <h2 className="mt-6 border-b border-gray-200 pb-1 text-xs font-semibold uppercase tracking-wide">{t.report.categories}</h2>
        {agg.catList.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {agg.catList.map((c, i) => (
              <span key={i} className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-600">
                {c.label} · {c.count}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-500">{t.report.categoriesNone}</p>
        )}

        <h2 className="mt-6 border-b border-gray-200 pb-1 text-xs font-semibold uppercase tracking-wide">{t.report.recommendations}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
          {recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <p className="mt-6 border-t border-gray-200 pt-3 text-[10px] text-gray-400">{t.report.footNote}</p>
      </div>
    </div>
  );
}

function BulkRequestModal({
  services,
  t,
  onCancel,
  onConfirm,
}: {
  services: string[];
  t: (typeof CYPRESS_CONTENT)["ko"];
  onCancel: () => void;
  onConfirm: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(services));

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/60 px-4">
      <div className="max-h-[80vh] w-full max-w-md overflow-auto border border-stone bg-ivory p-6">
        <h2 className="font-display text-lg">{t.deleteFlow.bulkModalTitle}</h2>
        <p className="mt-2 text-xs leading-6 text-fog">{t.deleteFlow.bulkModalBody}</p>

        <div className="mt-4 space-y-2">
          {services.length === 0 ? (
            <p className="text-xs text-fog">{t.deleteFlow.bulkModalEmpty}</p>
          ) : (
            services.map((name) => (
              <label key={name} className="flex items-center gap-2 border border-stone px-3 py-2 text-sm">
                <input type="checkbox" checked={selected.has(name)} onChange={() => toggle(name)} className="h-4 w-4" />
                {name}
              </label>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="border border-stone px-4 py-2 text-xs tracking-wide text-fog">
            {t.deleteFlow.bulkModalCancel}
          </button>
          {services.length > 0 && (
            <button
              type="button"
              disabled={selected.size === 0}
              onClick={() => onConfirm([...selected])}
              className="border border-slate bg-slate px-4 py-2 text-xs tracking-wide text-ivory transition-opacity disabled:opacity-40"
            >
              {t.deleteFlow.bulkModalConfirm(selected.size)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
