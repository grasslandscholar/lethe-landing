import { COMBO_IDS } from "./taxonomy";
import type { LocalizedText, RiskInfo, StaleInfo, TaxonomyCategory } from "./types";

const STALE_LABELS: { maxDays: number | null; mult: number; label: LocalizedText | null }[] = [
  { maxDays: 90, mult: 1.0, label: null },
  {
    maxDays: 365,
    mult: 1.1,
    label: { ko: "휴면 시작 (91일~1년 미사용)", en: "Going dormant (unused 91 days–1 year)", ja: "休眠開始(91日〜1年未使用)" },
  },
  {
    maxDays: 730,
    mult: 1.25,
    label: { ko: "장기 미사용 (1~2년)", en: "Long-term unused (1–2 years)", ja: "長期未使用(1〜2年)" },
  },
  {
    maxDays: null,
    mult: 1.4,
    label: { ko: "장기 방치 — 점검 권장 (2년 이상 미사용)", en: "Long abandoned — review recommended (2+ years unused)", ja: "長期放置 — 確認推奨(2年以上未使用)" },
  },
];

export function staleMultiplier(daysSince: number | null | undefined): { mult: number; label: LocalizedText | null; days?: number } {
  if (daysSince == null) return { mult: 1, label: null };
  for (const tier of STALE_LABELS) {
    if (tier.maxDays === null || daysSince <= tier.maxDays) {
      return { mult: tier.mult, label: tier.label, days: daysSince };
    }
  }
  return { mult: 1, label: null };
}

export function scoreFromCategories(
  matched: TaxonomyCategory[],
  contextMultiplier: number,
  staleInfo?: { mult: number; label: LocalizedText | null; days?: number }
): RiskInfo {
  if (!matched.length && !(staleInfo && staleInfo.mult > 1)) {
    return { score: 0, raw: 0, matched: [], comboBonus: false, staleInfo: null };
  }
  let raw = matched.reduce((sum, c) => sum + c.weight, 0);
  const comboHit = matched.filter((c) => COMBO_IDS.includes(c.id)).length;
  if (comboHit >= 3) raw += 6;
  raw *= contextMultiplier;
  if (staleInfo) raw *= staleInfo.mult;
  const score = Math.round(100 * (1 - Math.exp(-raw / 25)));
  const resolvedStale: StaleInfo | null =
    staleInfo && staleInfo.mult > 1 && staleInfo.label
      ? { mult: staleInfo.mult, label: staleInfo.label, days: staleInfo.days ?? 0 }
      : null;
  return { score, raw, matched, comboBonus: comboHit >= 3, staleInfo: resolvedStale };
}

export function gradeOf(score: number): { label: LocalizedText; cls: string } {
  if (score >= 80) return { label: { ko: "매우 높음", en: "Very high", ja: "非常に高い" }, cls: "g5" };
  if (score >= 60) return { label: { ko: "높음", en: "High", ja: "高い" }, cls: "g4" };
  if (score >= 40) return { label: { ko: "보통", en: "Moderate", ja: "普通" }, cls: "g3" };
  if (score >= 20) return { label: { ko: "낮음", en: "Low", ja: "低い" }, cls: "g2" };
  return { label: { ko: "최소", en: "Minimal", ja: "最小" }, cls: "g1" };
}
