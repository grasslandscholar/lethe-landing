"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const PRIVACY_EVENT = "lethe:open-privacy";

export function openPrivacyModal() {
  window.dispatchEvent(new Event(PRIVACY_EVENT));
}

export default function PrivacyModal() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"easy" | "detail">("easy");

  useEffect(() => {
    const openModal = () => {
      setTab("easy");
      setOpen(true);
    };

    window.addEventListener(PRIVACY_EVENT, openModal);
    return () => window.removeEventListener(PRIVACY_EVENT, openModal);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#07141e]/72 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden border border-stone-200 bg-[#fbfaf7] text-slate-800 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between gap-6 border-b border-stone-200 px-6 py-6 md:px-8">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-slate-400">
              {t.privacy.subtitle}
            </p>
            <h2 id="privacy-modal-title" className="mt-3 font-display text-3xl font-light leading-tight md:text-4xl">
              {t.privacy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-11 min-w-11 text-sm tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-700"
          >
            {t.privacy.close}
          </button>
        </div>

        <div className="border-b border-stone-200 px-6 pt-5 md:px-8">
          <div className="flex gap-2">
            {[
              { id: "easy" as const, label: t.privacy.easyTab },
              { id: "detail" as const, label: t.privacy.detailTab },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`border-b px-3 pb-4 text-sm transition-colors ${
                  tab === item.id
                    ? "border-slate-700 text-slate-800"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-6 py-7 md:px-8">
          {tab === "easy" ? (
            <div className="space-y-6 text-sm leading-7 text-slate-600">
              {t.privacy.easy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <section>
                <h3 className="text-xs tracking-[0.22em] text-slate-400">
                  {t.privacy.easy.collectedTitle}
                </h3>
                <ul className="mt-3 space-y-2">
                  {t.privacy.easy.collected.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>

              {t.privacy.easy.after.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <section className="border-t border-stone-200 pt-5">
                <h3 className="text-xs tracking-[0.22em] text-slate-400">
                  {t.privacy.easy.contactTitle}
                </h3>
                <a className="mt-2 inline-flex text-slate-700 hover:text-slate-950" href={`mailto:${t.privacy.easy.contact}`}>
                  {t.privacy.easy.contact}
                </a>
              </section>
            </div>
          ) : (
            <div className="space-y-7 text-sm leading-7 text-slate-600">
              <div>
                <h3 className="font-display text-2xl font-light text-slate-800">
                  {t.privacy.detail.heading}
                </h3>
                <p className="mt-2 text-xs text-slate-400">{t.privacy.detail.updated}</p>
              </div>

              {t.privacy.detail.sections.map((section) => (
                <section key={section.title} className="border-t border-stone-200 pt-5">
                  <h4 className="text-xs tracking-[0.22em] text-slate-400">
                    {section.title}
                  </h4>
                  {"body" in section ? <p className="mt-3">{section.body}</p> : null}
                  {"items" in section ? (
                    <ul className="mt-3 space-y-2">
                      {section.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <section className="border-t border-stone-200 pt-5">
                <h4 className="text-xs tracking-[0.22em] text-slate-400">
                  {t.privacy.detail.contactTitle}
                </h4>
                <a className="mt-2 inline-flex text-slate-700 hover:text-slate-950" href={`mailto:${t.privacy.detail.contact}`}>
                  {t.privacy.detail.contact}
                </a>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
