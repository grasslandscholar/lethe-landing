import type { LocalizedText, NormalizedRow } from "./types";

export const NAVER_SCOPE_LABEL: Record<string, string> = {
  ESVR: "전자서명검증결과(이름)",
  EKYC_SIGNED_DATA: "인증서, 서명값(기본 정보)",
  EKYC_MID: "이용자 식별자",
  MID: "이용자 고유 식별자(기본 정보)",
  NAVERID: "네이버아이디",
  EKYC_CI: "연계정보(CI)",
  CI: "암호화된 동일인 식별정보(CI)",
  MOBILE: "휴대전화번호",
  NAME: "이름",
  REALNM: "실명여부",
  NAVEREMAIL: "이메일",
  EMAIL: "이메일",
  NICKNAME: "별명",
  PROFILEIMAGE: "프로필사진",
  GENDER: "성별",
  BIRTHDAY: "생년월일",
  BIRTHDATE: "생일",
  AGE: "연령대",
  BIRTHYEAR: "출생연도",
  PAYMEMBERNO: "네이버페이회원번호",
};

export type CategoryId = "kakao" | "kakao_collect" | "kakao_collect_extra" | "kakao_provider" | "naver" | "generic";

export interface ParsedCategory {
  id: CategoryId;
  rows: NormalizedRow[];
  source: string;
  note?: LocalizedText | null;
  mergeDedupe?: boolean;
}

interface KakaoThirdPartyDetail {
  items?: string;
  purpose?: string;
}

interface KakaoPrivacyInfoThird {
  serviceName: string;
  thirdParty?: { name?: string; link?: string };
  details?: KakaoThirdPartyDetail[];
}

interface KakaoPartsItem {
  text?: string;
}

interface KakaoPrivacyInfoCollect {
  serviceName: string;
  items?: {
    requiredParts?: KakaoPartsItem[];
    optionalParts?: KakaoPartsItem[];
    defaultParts?: KakaoPartsItem[];
  };
}

interface KakaoThirdPartyExtra {
  serviceName: string;
  items: string;
  purpose: string;
}

interface KakaoPrivacyInfoProvider {
  provider?: { name?: string }[];
  details?: string;
}

interface KakaoCtx {
  page: string;
  privacyInfos?: unknown[];
  thirdParty?: unknown[];
}

interface NaverToken {
  consumer_name: string;
  consumer_type?: string;
  consumer_url?: { pcWeb?: string; mobileWeb?: string; android?: string; ios?: string };
  allowed_profile_scope_list?: { allowedScopeList?: { required?: boolean; profileScopeCode?: string }[] };
  token_reg_timestamp?: number;
}

interface NaverJson {
  token_list: NaverToken[];
  limit?: number;
}

interface HarEntry {
  request?: { url?: string };
  response?: { content?: { text?: string; encoding?: string } };
}

interface HarFile {
  log?: { entries?: HarEntry[] };
}

function isNaverJson(value: unknown): value is NaverJson {
  return typeof value === "object" && value !== null && Array.isArray((value as { token_list?: unknown }).token_list);
}

function isHarFile(value: unknown): value is HarFile {
  const log = (value as { log?: unknown } | null)?.log;
  return typeof value === "object" && value !== null && Array.isArray((log as { entries?: unknown } | undefined)?.entries);
}

function safeLink(href: string | undefined, label: string): { label: string; href: string } | undefined {
  if (!href) return undefined;
  if (!/^https?:\/\//i.test(href)) return undefined;
  return { label, href };
}

function row(
  serviceName: string,
  fields: Record<string, string>,
  rawItemText: string,
  extras?: { lastUsedTimestamp?: number; link?: { label: string; href: string } }
): NormalizedRow {
  return {
    serviceName,
    fields,
    fieldOrder: Object.keys(fields),
    rawItemText,
    lastUsedTimestamp: extras?.lastUsedTimestamp,
    link: extras?.link,
  };
}

function parseKakaoNextData(ctx: KakaoCtx, filename: string): ParsedCategory[] {
  const results: ParsedCategory[] = [];

  if (ctx.page === "privacyInfoForThird") {
    const rows = (ctx.privacyInfos as KakaoPrivacyInfoThird[] | undefined ?? []).map((x) => {
      const itemText = (x.details || []).map((d) => d.items).filter(Boolean).join(" · ");
      const purpose = (x.details || []).map((d) => d.purpose).filter(Boolean).join(" · ");
      const providerName = x.thirdParty?.name || "";
      return row(
        x.serviceName,
        { 제공받는곳: providerName, 제공항목: itemText, 제공목적: purpose },
        itemText,
        { link: safeLink(x.thirdParty?.link, providerName) }
      );
    });
    results.push({ id: "kakao", rows, source: filename });
  } else if (ctx.page === "privacyInfo") {
    const rows = (ctx.privacyInfos as KakaoPrivacyInfoCollect[] | undefined ?? []).map((x) => {
      const req = (x.items?.requiredParts || []).map((p) => p.text).filter(Boolean).join(" · ");
      const opt = (x.items?.optionalParts || []).map((p) => p.text).filter(Boolean).join(" · ");
      const def = (x.items?.defaultParts || []).map((p) => p.text).filter(Boolean).join(" · ");
      const fields: Record<string, string> = {};
      if (req) fields["[필수] 수집항목"] = req;
      if (opt) fields["[선택] 수집항목"] = opt;
      if (def) fields["자동 수집항목"] = def;
      return row(x.serviceName, fields, [req, opt, def].join(" · "));
    });
    results.push({ id: "kakao_collect", rows, source: filename });

    const thirdPartyExtra = ctx.thirdParty as KakaoThirdPartyExtra[] | undefined;
    if (Array.isArray(thirdPartyExtra) && thirdPartyExtra.length) {
      const extraRows = thirdPartyExtra.map((x) => row(x.serviceName, { 항목: x.items, 목적: x.purpose }, `${x.items} ${x.purpose}`));
      results.push({
        id: "kakao_collect_extra",
        rows: extraRows,
        source: filename,
        note: {
          ko: "이 섹션은 \"수집 및 이용\" 탭 안에서 발견된 별도 데이터입니다. 화면상 정확히 어떤 항목에 대응하는지 아직 검증 전입니다.",
          en: "This section is separate data found within the \"Collection & Use\" tab. Its exact on-screen mapping hasn't been verified yet.",
          ja: "このセクションは「収集及び利用」タブ内で見つかった別データです。画面上どの項目に対応するかはまだ検証前です。",
        },
      });
    }
  } else if (ctx.page === "privacyInfoForProvider") {
    const rows = (ctx.privacyInfos as KakaoPrivacyInfoProvider[] | undefined ?? []).map((x) =>
      row((x.provider || []).map((p) => p.name).join(", "), { 위탁업무: x.details || "" }, "")
    );
    results.push({ id: "kakao_provider", rows, source: filename });
  }

  return results;
}

function parseNaverJson(json: NaverJson, filename: string): ParsedCategory {
  const rows: NormalizedRow[] = json.token_list.map((t) => {
    const url = t.consumer_url?.pcWeb || t.consumer_url?.mobileWeb || t.consumer_url?.android || t.consumer_url?.ios || "";
    const scopes = (t.allowed_profile_scope_list?.allowedScopeList || [])
      .map((s) => `${s.required ? "[필수] " : "[선택] "}${(s.profileScopeCode && NAVER_SCOPE_LABEL[s.profileScopeCode]) || s.profileScopeCode}`)
      .join(" · ");
    const date = t.token_reg_timestamp ? new Date(t.token_reg_timestamp * 1000).toLocaleDateString("ko-KR") : "";
    return row(
      t.consumer_name,
      { "최근 이용일": date, "이용 정보": scopes || "없음", 유형: t.consumer_type || "" },
      scopes,
      {
        lastUsedTimestamp: t.token_reg_timestamp ? t.token_reg_timestamp * 1000 : undefined,
        link: safeLink(url, url),
      }
    );
  });
  return {
    id: "naver",
    rows,
    source: filename,
    mergeDedupe: true,
    note:
      json.limit && json.limit <= json.token_list.length
        ? {
            ko: `이 응답은 최대 ${json.limit}건까지만 포함합니다. 서비스가 더 있다면 "더보기"를 눌러 다음 페이지 응답도 함께 넣어주세요.`,
            en: `This response includes up to ${json.limit} entries. If there are more services, click "load more" and add the next page's response too.`,
            ja: `この応答には最大${json.limit}件までしか含まれません。サービスがさらにある場合は「もっと見る」を押して次ページの応答も追加してください。`,
          }
        : null,
  };
}

function parseHar(har: HarFile, filename: string): ParsedCategory[] {
  const matches = (har.log?.entries || []).filter((e) => /tokens\/refinedScopeInfo/.test(e.request?.url || ""));
  if (!matches.length) {
    return [
      {
        id: "naver",
        rows: [],
        source: filename,
        note: {
          ko: "HAR 파일 안에서 refinedScopeInfo 요청을 찾지 못했습니다. Network 탭에서 연결된 서비스 페이지를 새로고침한 뒤 다시 내보내주세요.",
          en: "Couldn't find a refinedScopeInfo request in this HAR file. Refresh the connected-services page in the Network tab and export again.",
          ja: "HARファイル内でrefinedScopeInfoリクエストが見つかりませんでした。Networkタブで連携サービスページを再読み込みしてから再度書き出してください。",
        },
      },
    ];
  }
  const results: ParsedCategory[] = [];
  for (const entry of matches) {
    let text = entry.response?.content?.text;
    if (!text) continue;
    if (entry.response?.content?.encoding === "base64") {
      try {
        text = atob(text);
      } catch {
        continue;
      }
    }
    try {
      const json: unknown = JSON.parse(text);
      if (isNaverJson(json)) results.push(parseNaverJson(json, filename));
    } catch {
      // ignore unparseable entries, stay resilient
    }
  }
  return results;
}

const TABLE_CATS: { pattern: RegExp; id: CategoryId }[] = [
  { pattern: /수집/, id: "kakao_collect" },
  { pattern: /제\s*3\s*자/, id: "kakao" },
  { pattern: /위탁/, id: "kakao_provider" },
];

function parseGenericTable(doc: Document, filename: string): ParsedCategory[] {
  const tables = doc.querySelectorAll("table");
  const results: ParsedCategory[] = [];
  tables.forEach((table) => {
    const headers = [...table.querySelectorAll("thead th")].map((th) => (th.textContent || "").replace(/\s+/g, " ").trim());
    if (!headers.length) return;
    const rows: NormalizedRow[] = [...table.querySelectorAll("tbody tr")].map((tr) => {
      const cells = [...tr.querySelectorAll("td")];
      const fields: Record<string, string> = {};
      headers.forEach((h, i) => {
        fields[h || `컬럼${i + 1}`] = cells[i] ? (cells[i].textContent || "").replace(/\s+/g, " ").trim() : "";
      });
      const serviceName = fields[headers[0]] || "";
      return row(serviceName, fields, Object.values(fields).join(" "));
    });
    if (!rows.length) return;
    const headerText = headers.join("");
    const matchedCat = TABLE_CATS.find((c) => c.pattern.test(headerText));
    results.push({
      id: matchedCat?.id ?? "generic",
      rows,
      source: filename,
      note: {
        ko: "폴백 테이블 파싱을 사용했습니다 — rowspan 등 복잡한 표 구조에서 일부 항목이 누락될 수 있습니다.",
        en: "Used fallback table parsing — some entries may be missing from complex table structures (e.g. rowspan).",
        ja: "フォールバックのテーブル解析を使用しました — rowspanなど複雑な表構造では一部項目が欠落する可能性があります。",
      },
    });
  });
  return results;
}

export function parseFile(text: string, filename: string): ParsedCategory[] {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const json: unknown = JSON.parse(trimmed);
      if (isNaverJson(json)) return [parseNaverJson(json, filename)];
      if (isHarFile(json)) return parseHar(json, filename);
    } catch {
      // fall through to HTML parsing
    }
  }

  const doc = new DOMParser().parseFromString(text, "text/html");
  const nextDataEl = doc.getElementById("__NEXT_DATA__");
  if (nextDataEl) {
    try {
      const data = JSON.parse(nextDataEl.textContent || "{}");
      const ctx = data?.props?.pageProps?.pageContext?.context as KakaoCtx | undefined;
      if (ctx && ctx.privacyInfos) return parseKakaoNextData(ctx, filename);
    } catch {
      // fall through to table fallback
    }
  }
  return parseGenericTable(doc, filename);
}
