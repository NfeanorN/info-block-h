"use client";

import Image from "next/image";
import Link from "next/link";
import { DocIcon } from "@/components/icons";
import { KioskShell } from "@/components/KioskShell";
import { getLegalDocs } from "@/lib/data/legal";
import { npaQrLinks, siteQrLinks, type SiteQrLink } from "@/lib/data/siteQrLinks";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

function QrSection({
  heading,
  hint,
  items,
  locale,
}: {
  heading: string;
  hint?: string;
  items: SiteQrLink[];
  locale: Locale;
}) {
  return (
    <section className="mb-8 animate-fade-up">
      <h2 className="text-lg font-extrabold tracking-tight text-[var(--fg)]">{heading}</h2>
      {hint && <p className="mt-0.5 text-sm font-semibold text-[var(--fg-subtle)]">{hint}</p>}
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm"
          >
            <Image
              src={item.image}
              alt={item.title[locale]}
              width={112}
              height={112}
              className="h-28 w-28 shrink-0 rounded-xl border-2 border-[var(--primary)]/40 bg-white p-1"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-base font-extrabold leading-snug text-[var(--fg)]">
                {item.title[locale]}
              </span>
              {item.lead && (
                <span className="mt-1 block text-sm leading-snug text-[var(--fg-muted)]">
                  {item.lead[locale]}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LegalPage() {
  const { t, locale } = useI18n();
  const docs = getLegalDocs();

  return (
    <KioskShell title={t.legalHeading} subtitle={t.legalHint}>
      <QrSection heading={t.legalQrHeading} items={siteQrLinks} locale={locale} />
      <QrSection
        heading={t.legalNpaHeading}
        hint={t.legalQrHeading}
        items={npaQrLinks}
        locale={locale}
      />

      <h2 className="mb-3 text-lg font-extrabold tracking-tight text-[var(--fg)]">
        {t.legalDocsHeading}
      </h2>
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
