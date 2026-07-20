// Curated service-name -> support-email lookup for the delete flow. Intentionally empty for now —
// this data can't be derived from the uploaded Kakao/Naver exports and has to be hand-curated by the
// team over time (seeded from "이것도 삭제하고 싶어요" request volume). Until an entry exists here,
// every service shows the "request" state rather than the mailto state.
export const SERVICE_EMAIL_MAP: Record<string, string> = {};
