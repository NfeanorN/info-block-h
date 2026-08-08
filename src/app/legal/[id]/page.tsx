"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DocIcon } from "@/components/icons";
import { KioskShell } from "@/components/KioskShell";
import { getLegalDocById } from "@/lib/data/legal";
import { useI18n } from "@/lib/i18n/context";

export default function LegalDetailPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const doc = getLegalDocById(id);

  if (!doc) {
    return (
      <KioskShell title={t.legalHeading} backHref="/legal/" backLabel={t.back}>
        <p className="rounded-2xl bg-white px-5 py-8 text-center text-[var(--fg-muted)] shadow-sm">
          {t.legalEmpty}
        </p>
      </KioskShell>
    );
  }

  return (
    <KioskShell
      title={doc.title[locale]}
      subtitle={t.legalContent}
      backHref="/legal/"
      backLabel={t.back}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/legal/"
            className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-6 text-lg font-bold text-[var(--fg)] shadow-sm"
          >
            {t.back}
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-lg font-bold text-white shadow-md"
          >
            {t.backHome}
          </Link>
        </div>
      }
    >
      <article className="animate-fade-up rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
          <DocIcon />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg)]">
          {doc.title[locale]}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-[var(--fg-muted)]">
          {doc.body[locale]}
        </p>
      </article>
    </KioskShell>
  );
}
