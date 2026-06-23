"use client";

import { useLanguage } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PrivacyModal from "@/components/PrivacyModal";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const INTERVIEW_FORM_URLS = {
  ko: "https://forms.gle/eJyygJXEwKfLWgPR8",
  en: "https://forms.gle/rxVPZWnhXr2xQBgd8",
  ja: "https://forms.gle/nijRn2Tbdo7Ggb5u7",
} as const;

export default function NoteClient() {
  const { locale, t } = useLanguage();
  const note = t.note01;
  const interviewFormUrl = INTERVIEW_FORM_URLS[locale];

  return (
    <>
      <Navigation forceScrolled />
      <main className="min-h-screen bg-[#faf8f4] text-[#2c3e50]">
        {/* Article header */}
        <div className="max-w-2xl mx-auto px-6 md:px-8 pt-36 md:pt-44 pb-16">
          <FadeInWhenVisible>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#7f8c8d]">
              {note.label}
            </span>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={80}>
            <h1 className="mt-8 font-display font-light text-5xl md:text-7xl leading-[1.1] text-[#2c3e50] whitespace-pre-line">
              {note.title}
            </h1>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={180}>
            <p className="mt-10 text-base md:text-lg leading-8 text-[#7f8c8d] max-w-prose whitespace-pre-line">
              {note.intro}
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <div className="border-t border-[#e8e0d5]" />
        </div>

        {/* Article body */}
        <article className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-24 space-y-16">
          {note.sections.map((section, i) => (
            <FadeInWhenVisible key={i} delay={i * 40}>
              <section className="space-y-6">
                {section.heading && (
                  <h2 className="font-display font-light text-3xl md:text-4xl leading-snug text-[#2c3e50] whitespace-pre-line">
                    {section.heading}
                  </h2>
                )}
                {section.body.map((paragraph, j) => (
                  <p key={j} className="text-base md:text-lg leading-[1.95] text-[#2c3e50]">
                    {paragraph}
                  </p>
                ))}
              </section>
            </FadeInWhenVisible>
          ))}
        </article>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <div className="border-t border-[#e8e0d5]" />
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto px-6 md:px-8 py-24 md:py-32">
          <FadeInWhenVisible>
            <p className="font-display font-light text-3xl md:text-4xl leading-snug text-[#2c3e50] whitespace-pre-line">
              {note.cta.heading}
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={100}>
            <a
              href={interviewFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-12 items-center justify-center bg-[#2c3e50] px-9 py-4 text-sm tracking-[0.16em] text-[#faf8f4] transition-all duration-300 hover:bg-[#1a2a38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2c3e50] focus-visible:outline-offset-4"
            >
              {note.cta.button}
            </a>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={160}>
            <p className="mt-6 text-xs tracking-wide text-[#7f8c8d]">{note.cta.note}</p>
          </FadeInWhenVisible>
        </div>
      </main>
      <Footer />
      <PrivacyModal />
    </>
  );
}
