"use client";

import Link from "next/link";
import { DocIcon } from "@/components/icons";
import { KioskShell } from "@/components/KioskShell";
import { getLegalDocs } from "@/lib/data/legal";
import { useI18n } from "@/lib/i18n/context";

export default function LegalPage() {
  const { t, locale } = useI18n();
  const docs = getLegalDocs();

  return (
    <KioskShell title={t.legalHeading} subtitle={t.legalHint}>
      <ul className="flex flex-col gap-3 animate-fade-up">
        {docs.map((doc, i) => (
          <li key={doc.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
            <Link
              href={`/legal/${doc.id}/`}
              className="flex min-h-20 items-center gap-4 rounded-2xl border border-[var(--border)] bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-md active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                <DocIcon />
              </span>
              <span className="min-w-0 flex-1 text-lg font-bold leading-snug text-[var(--fg)]">
                {doc.title[locale]}
              </span>
              <span className="shrink-0 text-sm font-bold text-[var(--accent)]">
                {t.more}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </KioskShell>
  );
}
