export type Locale = "ko" | "en" | "ja";

export type LocalizedText = Record<Locale, string>;

export interface StaleInfo {
  mult: number;
  label: LocalizedText | null;
  days: number;
}

export interface RiskInfo {
  score: number;
  raw: number;
  matched: TaxonomyCategory[];
  comboBonus: boolean;
  staleInfo: StaleInfo | null;
}

export interface TaxonomyCategory {
  id: string;
  weight: number;
  label: LocalizedText;
  rationale: LocalizedText;
  patterns: RegExp[];
}

export interface NormalizedRow {
  serviceName: string;
  fields: Record<string, string>;
  fieldOrder: string[];
  rawItemText: string;
  lastUsedTimestamp?: number;
  link?: { label: string; href: string };
  risk?: RiskInfo;
}

export interface TabDataset {
  rows: NormalizedRow[];
  source: string;
  note?: LocalizedText | null;
  comparable: boolean;
}

export type Dataset = Record<string, TabDataset>;

export interface TabAnalytics {
  total: number;
  highRisk: number;
  hasRisk: boolean;
  catList: { label: string; count: number }[];
}
