"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [showSub2, setShowSub2] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSub2(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/river-poster.jpg"
      >
        {/* Video source to be replaced with actual river footage */}
        <source src="/videos/river.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay — soft, not dark/threatening */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

      {/* Hero text */}
      <div className="relative z-10 text-center text-white px-6 select-none">
        <h1
          className="font-display font-light tracking-[0.3em] text-7xl md:text-9xl mb-6 animate-fade-in-slow"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {t.hero.title}
        </h1>

        <p
          className="font-display font-light text-xl md:text-2xl tracking-[0.15em] text-white/85 animate-fade-in-slow"
          style={{ animationDelay: "0.9s", opacity: 0 }}
        >
          {t.hero.sub1}
        </p>

        <p
          className={`font-display font-light text-xl md:text-2xl tracking-[0.15em] text-white/65 mt-2 transition-opacity duration-[1800ms] ease-in-out ${
            showSub2 ? "opacity-100" : "opacity-0"
          }`}
        >
          {t.hero.sub2}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-fade-in-slow" style={{ animationDelay: "2s", opacity: 0 }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
