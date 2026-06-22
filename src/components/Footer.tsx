"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2c3e50] text-white/40 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-display tracking-[0.25em] text-white/80 text-lg font-light">
            LETHE
          </span>
          <span className="text-xs tracking-wide hidden md:block">
            {t.footer.tagline}
          </span>
        </div>
        <p className="text-xs tracking-wide">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
