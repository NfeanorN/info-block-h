"use client";

import { AppealForm } from "@/components/AppealForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

export default function AppealPage() {
  const { t } = useI18n();

  return (
    <div className="kiosk-bg flex min-h-screen flex-col">
      <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-6 sm:px-10">
        <div className="animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
            {t.clinicName}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
            {t.appealHeading}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[var(--fg-muted)]">
            {t.appealHint}
          </p>
        </div>
        <LanguageSwitcher className="shrink-0" />
      </header>
      <main className="flex flex-1 flex-col px-6 py-4 sm:px-10">
        <AppealForm />
      </main>
    </div>
  );
}
