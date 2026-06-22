"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import FadeInWhenVisible from "./FadeInWhenVisible";

const FEATURE_IMAGES = [
  { src: "/images/feature-1.jpg", alt: "Scattered accounts visualization" },
  { src: "/images/feature-2.jpg", alt: "Account cleanup" },
  { src: "/images/feature-3.jpg", alt: "Data connections" },
];

export default function ServiceIntroSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#faf8f4]">
      {/* Intro */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <FadeInWhenVisible>
          <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-6 block">
            {t.service.label}
          </span>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={100}>
          <h2 className="font-display font-light text-4xl md:text-6xl text-slate-800 leading-[1.2] whitespace-pre-line max-w-2xl">
            {t.service.intro.heading}
          </h2>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={200}>
          <p className="mt-10 text-base md:text-lg leading-8 text-slate-500 max-w-xl whitespace-pre-line">
            {t.service.intro.body}
          </p>
        </FadeInWhenVisible>
      </div>

      {/* Alternating feature rows */}
      <div className="border-t border-stone-200">
        {t.service.features.map((feature, i) => {
          const img = FEATURE_IMAGES[i];
          const isEven = i % 2 === 0;

          return (
            <div
              key={i}
              className={`max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32 flex flex-col ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-20 ${
                i < t.service.features.length - 1 ? "border-b border-stone-200" : ""
              }`}
            >
              {/* Text */}
              <div className="flex-1">
                <FadeInWhenVisible>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-6 block">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-light text-3xl md:text-5xl text-slate-800 leading-[1.25] whitespace-pre-line mb-7">
                    {feature.heading}
                  </h3>
                  <p className="text-base md:text-lg leading-8 text-slate-500 max-w-md">
                    {feature.body}
                  </p>
                </FadeInWhenVisible>
              </div>

              {/* Image */}
              <div className="flex-1 w-full">
                <FadeInWhenVisible delay={150}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
