import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lethe — 고요히 흘려보내다",
  description:
    "계정 삭제와 개인정보 정리 경험에서 시작된 Lethe의 초기 사용자 인터뷰 모집 랜딩페이지입니다.",
  openGraph: {
    title: "Lethe — 고요히 흘려보내다",
    description: "당신의 디지털 흔적 정리 경험을 들려주세요.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lethe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
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
