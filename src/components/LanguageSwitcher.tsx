"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

type Props = {
  className?: string;
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ className = "", variant = "light" }: Props) {
  const { locale, setLocale } = useI18n();
  const dark = variant === "dark";

  const langs: { id: Locale; short: string; full: string }[] = [
    { id: "kk", short: "ҚАЗ", full: "Қазақша" },
    { id: "ru", short: "РУС", full: "Русский" },
  ];

  const activeIndex = langs.findIndex((l) => l.id === locale);

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative inline-grid grid-cols-2 gap-1 rounded-2xl border p-1 ${
        dark
          ? "border-white/20 bg-white/10"
          : "border-[var(--border)] bg-[var(--bg)]"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-xl shadow-sm transition-[left] duration-300 ease-out ${
          dark ? "bg-white" : "bg-[var(--primary)]"
        }`}
        style={{
          left: activeIndex === 0 ? 4 : "calc(50% + 2px)",
        }}
      />

      {langs.map((lang) => {
        const active = locale === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => setLocale(lang.id)}
            aria-pressed={active}
            className={`relative z-10 flex min-h-12 min-w-[5.5rem] flex-col items-center justify-center rounded-xl px-3 py-1.5 transition ${
              active
                ? dark
                  ? "text-[var(--fg)]"
                  : "text-white"
                : dark
                  ? "text-white/65 hover:text-white"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            <span className="text-[11px] font-extrabold tracking-[0.14em]">
              {lang.short}
            </span>
            <span
              className={`text-[10px] font-semibold leading-none ${
                active
                  ? dark
                    ? "text-[var(--fg-muted)]"
                    : "text-white/85"
                  : "opacity-80"
              }`}
            >
              {lang.full}
            </span>
          </button>
        );
      })}
    </div>
  );
}
