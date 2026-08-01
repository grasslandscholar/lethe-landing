"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { trackAnalysisCtaClicked } from "./LandingAnalytics";

export default function FloatingProductCTA() {
  const { t } = useLanguage();
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHasPassedHero(window.scrollY > window.innerHeight * 0.72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const questionTarget = document.querySelector('[data-product-cta="question"]');
    const detailTarget = document.querySelector('[data-product-cta="detail"]');
    const targets = [questionTarget, detailTarget].filter(
      (target): target is Element => target !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const kind = entry.target.getAttribute("data-product-cta");
          if (kind === "question") setQuestionVisible(entry.isIntersecting);
          if (kind === "detail") setDetailVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: "-18% 0px -22% 0px",
        threshold: 0.18,
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const visible = hasPassedHero && !detailVisible;
  const expanded = questionVisible;

  return (
    <a
      href="/notes/understanding-me-myself"
      onClick={() => trackAnalysisCtaClicked("floating")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-6 right-5 z-40 hidden h-12 items-center overflow-hidden border border-slate-300/70 bg-[#fbfaf7]/88 text-[11px] tracking-[0.16em] text-slate-700 shadow-[0_16px_42px_rgba(35,48,58,0.12)] backdrop-blur-md transition-all duration-700 md:inline-flex ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      } ${
        expanded ? "w-[214px] px-5" : "w-12 px-3 hover:w-[214px] hover:px-5 focus-visible:w-[214px] focus-visible:px-5"
      } hover:border-slate-500 hover:bg-[#fbfaf7] hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-700 focus-visible:outline-offset-4`}
    >
      <span className="relative block h-5 w-6 shrink-0">
        <Image
          src="/brand/markonlyB.svg"
          alt=""
          fill
          className="object-contain"
          sizes="24px"
        />
      </span>
      <span
        className={`ml-3 whitespace-nowrap transition-all duration-500 ${
          expanded
            ? "max-w-44 opacity-100"
            : "max-w-0 opacity-0 group-hover:max-w-44 group-hover:opacity-100 group-focus-visible:max-w-44 group-focus-visible:opacity-100"
        }`}
      >
        {t.productCta.floating}
      </span>
    </a>
  );
}
