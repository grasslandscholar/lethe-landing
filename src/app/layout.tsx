import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lethe — 디지털 흔적을 고요하게 정리하다",
  description:
    "Lethe는 흩어진 계정과 개인정보를 추적하고, 위험도를 분석하며, 깔끔하게 정리할 수 있도록 돕는 디지털 개인정보 대시보드입니다.",
  openGraph: {
    title: "Lethe — 디지털 흔적을 고요하게 정리하다",
    description: "흩어진 계정과 개인정보를 한눈에. 인터뷰에 참여해주세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
