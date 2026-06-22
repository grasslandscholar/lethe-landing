"use client";

import { useLanguage } from "@/context/LanguageContext";
import FadeInWhenVisible from "./FadeInWhenVisible";

export default function VisionSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#2c3e50] text-white py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
        <FadeInWhenVisible>
          <span className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-10 block">
            {t.vision.label}
          </span>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={100}>
          <h2 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[1.2] whitespace-pre-line mx-auto max-w-3xl">
            {t.vision.heading}
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={250}>
          <p className="mt-12 text-lg md:text-xl font-light tracking-wide text-white/55">
            {t.vision.body}
          </p>
        </FadeInWhenVisible>

        {/* Decorative line */}
        <FadeInWhenVisible delay={350}>
          <div className="mt-16 w-px h-20 bg-gradient-to-b from-white/30 to-transparent mx-auto" />
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
