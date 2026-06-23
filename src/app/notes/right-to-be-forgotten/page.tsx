import type { Metadata } from "next";
import NoteClient from "./NoteClient";

export const metadata: Metadata = {
  title: "정말 나는 잊힐 권리를 가지고 있는가 — Lethe Note 01",
  description:
    "문득 든 생각에 계정을 삭제해 보기로 했습니다. 그리고, 생각보다 긴 여정이 시작되었습니다.",
  openGraph: {
    title: "정말 나는 잊힐 권리를 가지고 있는가",
    description: "문득 든 생각에 계정을 삭제해 보기로 했습니다.",
    type: "article",
  },
};

export default function RightToBeForgottenPage() {
  return <NoteClient />;
}
