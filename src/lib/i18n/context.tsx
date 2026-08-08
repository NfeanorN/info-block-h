"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "./types";
import { translations } from "./translations";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)[Locale];
  localeTag: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "infomat-locale";
const DEFAULT_LOCALE: Locale = "kk";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    const next = saved === "ru" || saved === "kk" ? saved : DEFAULT_LOCALE;
    setLocaleState(next);
    document.documentElement.lang = next === "kk" ? "kk" : "ru";
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "kk" ? "kk" : "ru";
  }, []);

  const t = translations[locale];

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      localeTag: locale === "kk" ? "kk-KZ" : "ru-RU",
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
