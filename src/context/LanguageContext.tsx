"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { translations, type Locale, type Translations } from "@/i18n/translations";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LOCALES: Locale[] = ["ko", "en", "ja"];
const STORAGE_KEY = "lethe-locale";

const listeners = new Set<() => void>();
let localeOverride: Locale | null = null;

function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALES.includes(value as Locale);
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return "ko";

  const urlLocale = new URLSearchParams(window.location.search).get("lang");
  if (isLocale(urlLocale)) return urlLocale;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;

  const lang = navigator.language.slice(0, 2).toLowerCase();
  if (lang === "ja") return "ja";
  if (lang === "en") return "en";
  return "ko";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("popstate", callback);
  queueMicrotask(callback);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("popstate", callback);
  };
}

function getClientSnapshot() {
  return localeOverride ?? detectLocale();
}

function getServerSnapshot(): Locale {
  return "ko";
}

function notifyLocaleChange() {
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localeOverride = next;
    localStorage.setItem(STORAGE_KEY, next);
    notifyLocaleChange();
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
