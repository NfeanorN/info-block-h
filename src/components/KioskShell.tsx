"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showLang?: boolean;
  footer?: React.ReactNode;
};

export function KioskShell({
  title,
  subtitle,
  children,
  backHref = "/",
  backLabel,
  showLang = true,
  footer,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="kiosk-bg flex min-h-screen flex-col">
      <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-6 sm:px-10">
        <div className="min-w-0 animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
            {t.clinicName}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-base text-[var(--fg-muted)]">{subtitle}</p>
          )}
        </div>
        {showLang && <LanguageSwitcher className="shrink-0" />}
      </header>

      <main className="flex flex-1 flex-col px-6 py-4 sm:px-10">{children}</main>

      <footer className="px-6 pb-8 pt-2 sm:px-10">
        {footer ?? (
          <Link
            href={backHref}
            className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent)] px-6 text-lg font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:w-auto sm:min-w-[280px]"
          >
            <HomeIcon />
            {backLabel ?? t.backHome}
          </Link>
        )}
      </footer>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
