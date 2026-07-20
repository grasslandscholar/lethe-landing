"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { openPrivacyModal } from "./PrivacyModal";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#07141e] text-white/42 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <div className="relative h-10 w-32 md:h-12 md:w-40">
            <Image
              src="/brand/textlogowW.svg"
              alt="Lethe"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <div className="flex items-center gap-6 text-xs tracking-wide">
            <button type="button" onClick={openPrivacyModal} className="transition-colors hover:text-white/75">
              {t.footer.privacy}
            </button>
            <a href="mailto:connect.lethe@gmail.com" className="transition-colors hover:text-white/75">
              {t.footer.contact}
            </a>
          </div>
          <p className="text-xs tracking-wide">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
