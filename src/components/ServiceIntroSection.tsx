"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Translations } from "@/i18n/translations";
import FadeInWhenVisible from "./FadeInWhenVisible";

function NoteTerm({
  term,
  title,
  children,
}: {
  term: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      <span
        tabIndex={0}
        className="cursor-help border-b border-dotted border-slate-300 pb-0.5 outline-none transition-colors hover:border-slate-500 focus-visible:border-slate-500"
      >
        {term}
      </span>
      <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-3 w-72 translate-y-1 border border-stone-200 bg-[#fffdf8] p-4 text-left text-[11px] leading-5 text-slate-500 opacity-0 shadow-[0_18px_45px_rgba(35,48,58,0.12)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <span className="mb-2 block font-display text-base font-light text-slate-800">
          {title}
        </span>
        {children}
      </span>
    </span>
  );
}

type TooltipCopy = {
  intro: readonly string[];
  whyTitle: string;
  why: readonly string[];
};

function TooltipContent({ content }: { content: TooltipCopy }) {
  return (
    <>
      {content.intro.map((paragraph) => (
        <span key={paragraph} className="mt-2 block first:mt-0">
          {paragraph}
        </span>
      ))}
      <span className="mt-3 block text-slate-700">{content.whyTitle}</span>
      {content.why.map((paragraph) => (
        <span key={paragraph} className="mt-2 block">
          {paragraph}
        </span>
      ))}
    </>
  );
}

function MiniDashboard({
  index,
  visuals,
}: {
  index: number;
  visuals: Translations["service"]["visuals"];
}) {
  if (index === 0) {
    return (
      <div className="space-y-3">
        {visuals.check.services.map((name, i) => (
          <div key={name} className="flex items-center justify-between border border-slate-200 bg-white/75 px-4 py-3">
            <span className="text-sm text-slate-700">{name}</span>
            <span className="text-xs text-slate-400">{i === 0 ? visuals.check.recent : visuals.check.needsCheck}</span>
          </div>
        ))}
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="w-full border border-slate-200 bg-white/90 p-5 shadow-[0_16px_40px_rgba(35,48,58,0.08)] md:p-7">
        <div className="grid gap-5 md:grid-cols-[0.38fr_0.62fr] md:items-center">
          <div className="flex min-h-32 flex-col justify-center border-b border-slate-200 pb-5 text-center md:border-b-0 md:border-r md:pb-0 md:pr-7">
            <p className="text-xs text-slate-500">{visuals.understand.status}</p>
            <div className="mt-2 flex items-end justify-center gap-1">
              <span className="font-display text-7xl font-light leading-none text-slate-800">87</span>
              <span className="pb-1 text-sm text-slate-500">{visuals.understand.scoreUnit}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center gap-3 py-2.5 text-xs text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#f0dac7]" />
              <span>{visuals.understand.inactive}</span>
            </div>
            <div className="flex items-center gap-3 py-2.5 text-xs text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#e8dcc6]" />
              <span>
                <NoteTerm term={visuals.understand.adProfile.term} title={visuals.understand.adProfile.title}>
                  <TooltipContent content={visuals.understand.adProfile} />
                </NoteTerm>
                {visuals.understand.adProfile.suffix}
              </span>
            </div>
            <div className="flex items-center gap-3 py-2.5 text-xs text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#8fb1b9]" />
              <span>
                <NoteTerm term={visuals.understand.location.term} title={visuals.understand.location.title}>
                  <TooltipContent content={visuals.understand.location} />
                </NoteTerm>
                {visuals.understand.location.suffix}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="space-y-5">
        <div className="h-px bg-slate-200" />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>요청 접수</span>
          <span>확인 중</span>
          <span>답변 대기</span>
          <span>완료</span>
        </div>
        <div className="relative h-2 bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-2/3 bg-[#558b4a]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 items-center gap-6 border border-slate-200 bg-white/75 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-300">
          <span className="absolute -top-px left-1/2 h-1.5 w-6 -translate-x-1/2 bg-white" />
          <p className="font-display text-3xl font-light text-slate-800">
            23<span className="ml-1 text-sm text-slate-500">{visuals.organize.unit}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-600">{visuals.organize.keep}</p>
      </div>

      <div className="flex flex-col items-center border-l border-slate-200 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-300">
          <span className="absolute -top-px left-1/2 h-1.5 w-5 -translate-x-1/2 bg-white" />
          <p className="font-display text-2xl font-light text-slate-800">
            5<span className="ml-1 text-xs text-slate-500">{visuals.organize.unit}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-600">{visuals.organize.release}</p>
      </div>
    </div>
  );
}

export default function ServiceIntroSection() {
  const { t } = useLanguage();

  return (
    <section id="story" className="bg-[#fbfaf7]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <FadeInWhenVisible>
          <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-8 block">
            01 / {t.story.label}
          </span>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-20 items-start">
          <FadeInWhenVisible delay={80}>
            <h2 className="font-display font-light text-4xl md:text-6xl text-slate-800 leading-[1.14] whitespace-pre-line">
              {t.story.heading}
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={160}>
            <p className="text-base md:text-lg leading-8 md:leading-9 text-slate-500 whitespace-pre-line max-w-xl">
              {t.story.body}
            </p>
          </FadeInWhenVisible>
        </div>
      </div>

      <div className="border-y border-stone-200 bg-[#f6f3ed]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 grid gap-12 md:grid-cols-[1fr_1.5fr] items-center">
          <FadeInWhenVisible>
            <p className="font-display text-2xl md:text-3xl text-slate-700">
              {t.story.evidenceIntro}
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-2 divide-x divide-stone-300">
            {t.story.evidence.map((item, i) => (
              <FadeInWhenVisible key={item.label} delay={i * 120}>
                <div className="px-6 md:px-12 text-center">
                  <p className="font-display text-7xl md:text-8xl font-light text-slate-800">
                    {item.value}
                    <span className="ml-2 text-2xl md:text-3xl text-slate-500">{item.unit}</span>
                  </p>
                  <p className="mt-3 text-sm md:text-base text-slate-500">{item.label}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#0b1e29] text-white">
        <Image
          src="/images/feature-1.jpg"
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,30,0.88),rgba(7,20,30,0.58))]" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <FadeInWhenVisible>
            <p className="text-sm md:text-base tracking-[0.18em] text-white/55">
              {t.story.questionLabel}
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={140}>
            <h2 className="font-display font-light text-4xl md:text-7xl leading-[1.16] whitespace-pre-line">
              {t.story.question}
            </h2>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-[1fr_0.9fr] gap-14 md:gap-24 items-center">
        <FadeInWhenVisible>
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-8 block">
              02 / {t.story.beginning.kicker}
            </span>
            <h2 className="font-display font-light text-4xl md:text-6xl text-slate-800 leading-[1.16] whitespace-pre-line">
              {t.story.beginning.heading}
            </h2>
            <p className="mt-9 max-w-md text-lg leading-8 text-slate-500 md:ml-14 md:mt-10 md:text-xl">
              {t.story.beginning.body}
            </p>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={160}>
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
            <Image
              src="/images/river-beginning.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </FadeInWhenVisible>
      </div>

      <div className="border-t border-stone-200 bg-[#f7f5f0]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-40">
          <FadeInWhenVisible>
            <span className="text-[10px] tracking-[0.35em] uppercase text-fog mb-8 block">
              03 / {t.service.label}
            </span>
            <h2 className="font-display font-light text-4xl md:text-6xl text-slate-800 leading-[1.16] whitespace-pre-line max-w-3xl">
              {t.service.intro.heading}
            </h2>
            <p className="mt-8 text-base md:text-lg leading-8 text-slate-500 max-w-2xl">
              {t.service.intro.body}
            </p>
          </FadeInWhenVisible>

          <div className="mt-20 divide-y divide-stone-300 border-y border-stone-300">
            {t.service.features.map((feature, i) => (
              <div key={feature.heading} className="grid md:grid-cols-[0.35fr_0.65fr_1fr] gap-8 md:gap-12 py-12 md:py-16 items-center">
                <FadeInWhenVisible>
                  <span className="font-display text-4xl text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={80}>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl font-light text-slate-800">
                      {feature.heading}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-slate-500">
                      {feature.body}
                    </p>
                  </div>
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={160}>
                  <div className="bg-white/55 p-5 md:p-7 shadow-[0_18px_48px_rgba(35,48,58,0.08)]">
                    <MiniDashboard index={i === 2 ? 3 : i} visuals={t.service.visuals} />
                  </div>
                </FadeInWhenVisible>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
