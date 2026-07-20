import type { Metadata } from "next";
import CypressClient from "./CypressClient";

export const metadata: Metadata = {
  title: "내 개인정보, 어디에 얼마나 남아 있을까 — Lethe",
  description: "카카오·네이버 개인정보 현황 파일을 브라우저 안에서만 분석하는 도구입니다. 서버로 전송되지 않습니다.",
  robots: { index: false, follow: false },
};

export default function UnderstandingMeMyselfPage() {
  return <CypressClient />;
}
