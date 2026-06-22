"use client";

import { useLanguage } from "@/context/LanguageContext";
import FadeInWhenVisible from "./FadeInWhenVisible";

const INTERVIEW_FORM_URL = "#";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section id="interview" className="bg-[#faf8f4] py-32 md:py-48">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <FadeInWhenVisible>
          <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-8 block">
            {t.cta.label}
          </span>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={100}>
          <h2 className="font-display font-light text-4xl md:text-6xl text-slate-800 leading-[1.2] whitespace-pre-line mb-10">
            {t.cta.heading}
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={200}>
          <p className="text-base md:text-lg leading-8 text-slate-500 whitespace-pre-line mb-12">
            {t.cta.body}
          </p>
        </FadeInWhenVisible>

        {/* Perks */}
        <FadeInWhenVisible delay={280}>
          <ul className="flex flex-col items-center gap-3 mb-14">
            {t.cta.perks.map((perk, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-slate-500"
              >
                <span className="w-4 h-px bg-slate-300 shrink-0" />
                {perk}
                <span className="w-4 h-px bg-slate-300 shrink-0" />
              </li>
            ))}
          </ul>
        </FadeInWhenVisible>

        {/* CTA Button */}
        <FadeInWhenVisible delay={350}>
          <a
            href={INTERVIEW_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 border border-slate-700 text-slate-700 text-sm tracking-[0.15em] transition-all duration-400 hover:bg-slate-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-700 focus-visible:outline-offset-2"
          >
            {t.cta.button}
          </a>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={420}>
          <p className="mt-7 text-xs text-slate-400 tracking-wide">
            {t.cta.note}
          </p>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
