"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import FadeInWhenVisible from "./FadeInWhenVisible";
import { openPrivacyModal } from "./PrivacyModal";

const INTERVIEW_FORM_URLS = {
  ko: "https://forms.gle/eJyygJXEwKfLWgPR8",
  en: "https://forms.gle/rxVPZWnhXr2xQBgd8",
  ja: "https://forms.gle/nijRn2Tbdo7Ggb5u7",
} as const;

export default function CTASection() {
  const { locale, t } = useLanguage();
  const streamItems = t.cta.stream;
  const interviewFormUrl = INTERVIEW_FORM_URLS[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const activeItem = streamItems[activeIndex % streamItems.length];
  const isNote = "linkText" in activeItem;

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % streamItems.length);
    }, isNote ? 7600 : 4600);

    return () => window.clearTimeout(timeout);
  }, [isNote, isPaused, streamItems.length, activeIndex]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const pauseStream = () => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    setIsPaused(true);
  };

  const resumeStream = () => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  return (
    <section id="interview" className="relative overflow-hidden bg-[#0b1e29] text-white">
      <Image
        src="/images/river-poster.jpg"
        alt=""
        fill
        className="object-cover opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,30,0.94),rgba(7,20,30,0.74)_48%,rgba(7,20,30,0.88))]" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-44 grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-24 items-center">
        <div>
          <FadeInWhenVisible>
            <span className="text-[10px] tracking-[0.35em] uppercase text-white/45 mb-8 block">
              {t.cta.label}
            </span>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={100}>
            <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.14] whitespace-pre-line">
              {t.cta.heading}
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={200}>
            <p className="mt-9 text-base md:text-lg leading-8 text-white/62 whitespace-pre-line max-w-md">
              {t.cta.body}
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={300}>
            <a
              href={interviewFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex min-h-12 items-center justify-center bg-[#fbfaf7] px-9 py-4 text-sm tracking-[0.16em] text-slate-800 transition-all duration-300 hover:bg-white hover:shadow-[0_16px_44px_rgba(255,255,255,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            >
              {t.cta.button}
            </a>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={380}>
            <p className="mt-6 text-xs tracking-wide text-white/42">
              {t.cta.note}
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={460}>
            <div className="mt-10 max-w-md border-t border-white/12 pt-6">
              <p className="text-sm leading-7 text-white/64">
                {t.cta.transparency.heading}
              </p>
              <p className="mt-3 whitespace-pre-line text-xs leading-5 text-white/42">
                {t.cta.transparency.body}{" "}
                <button
                  type="button"
                  onClick={openPrivacyModal}
                  className="inline-flex text-white/58 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                >
                  {t.cta.transparency.button}
                </button>
              </p>
            </div>
          </FadeInWhenVisible>
        </div>

        <FadeInWhenVisible delay={160}>
          <div
            onMouseEnter={pauseStream}
            onMouseLeave={resumeStream}
            onFocus={pauseStream}
            onBlur={resumeStream}
            className="flex min-h-[22rem] items-center border border-white/12 bg-white/[0.06] p-8 md:min-h-[28rem] md:p-12 backdrop-blur-sm shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
          >
            <div
              key={`${activeItem.quote}-${activeIndex}`}
              className="w-full max-w-lg animate-voice-flow"
            >
              <div>
                <p className="whitespace-pre-line font-display text-4xl md:text-5xl font-light leading-[1.18] text-white/88">
                  {"link" in activeItem ? activeItem.quote : `“${activeItem.quote}”`}
                </p>
                <p className="mt-8 whitespace-pre-line text-base leading-8 text-white/56">
                  {activeItem.insight}
                </p>
                {"linkText" in activeItem ? (
                  <a
                    href="#story"
                    className="group mt-3 inline-flex items-center text-base leading-8 text-white/58 transition-all duration-300 hover:text-white/82 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                  >
                    <span className="border-b border-transparent transition-colors duration-300 group-hover:border-white/45">
                      {activeItem.linkText}
                    </span>
                    <span className="ml-2 translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      →
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
