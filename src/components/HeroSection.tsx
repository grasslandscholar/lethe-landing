"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden bg-[#0b1e29]">
      <Image
        src="/images/river-hero-poster.png"
        alt=""
        fill
        priority
        className="object-cover opacity-75"
        sizes="100vw"
      />
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/river-hero-poster.png"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      >
        <source src="/videos/lethe-river-hero.mov" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,30,0.28),rgba(7,20,30,0.46)_52%,rgba(7,20,30,0.76))]" />

      <div className="relative z-10 text-center text-white px-6 select-none">
        <h1
          className="font-display font-light tracking-[0.3em] text-7xl md:text-9xl mb-8 animate-fade-in-slow"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {t.hero.title}
        </h1>

        <p
          className="font-display font-light text-2xl md:text-4xl text-white/58 animate-fade-in-slow"
          style={{ animationDelay: "0.9s", opacity: 0 }}
        >
          {t.hero.sub1}
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-fade-in-slow" style={{ animationDelay: "2s", opacity: 0 }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
