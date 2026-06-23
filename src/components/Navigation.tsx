"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/i18n/translations";
import { openPrivacyModal } from "./PrivacyModal";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ko", label: "KO" },
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
];

export default function Navigation() {
  const { locale, t, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-[#faf8f4]/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        <a
          href="#"
          className={`relative block transition-all duration-500 ${
            scrolled ? "h-9 w-32 md:h-11 md:w-40" : "h-9 w-28 md:h-10 md:w-32"
          }`}
          aria-label="Lethe home"
        >
          <Image
            src={scrolled ? "/brand/lethe-black-logo.png" : "/brand/lethe-white-logo.png"}
            alt="Lethe"
            fill
            priority
            className="object-contain object-left"
            sizes={scrolled ? "160px" : "128px"}
          />
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <button
            type="button"
            onClick={openPrivacyModal}
            className={`hidden min-h-[44px] items-center text-xs tracking-widest transition-colors md:flex ${
              scrolled ? "text-slate-500 hover:text-slate-800" : "text-white/62 hover:text-white"
            }`}
          >
            {t.nav.privacy}
          </button>

          {/* Language toggle */}
          <div className="flex items-center gap-1">
            {LOCALES.map((l, i) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`text-xs tracking-widest px-2 py-1 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  locale === l.code
                    ? scrolled
                      ? "text-slate-800 font-medium"
                      : "text-white font-medium"
                    : scrolled
                    ? "text-slate-400 hover:text-slate-600"
                    : "text-white/50 hover:text-white/80"
                } ${i < LOCALES.length - 1 ? (scrolled ? "border-r border-slate-200" : "border-r border-white/20") : ""}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#interview"
            className={`hidden md:flex items-center text-xs tracking-widest px-5 py-2.5 border transition-all duration-300 ${
              scrolled
                ? "border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white"
                : "border-white/70 text-white hover:bg-white/10"
            }`}
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
