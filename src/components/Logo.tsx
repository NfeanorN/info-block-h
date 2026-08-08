"use client";

import Link from "next/link";
import { ApplePulseMark } from "@/components/ApplePulseMark";
import { useI18n } from "@/lib/i18n/context";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
};

export function Logo({ size = "lg", showText = true }: Props) {
  const { t } = useI18n();
  const sizes = {
    sm: { apple: 32, text: "text-lg" },
    md: { apple: 44, text: "text-xl" },
    lg: { apple: 56, text: "text-2xl" },
    xl: { apple: 72, text: "text-3xl" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <span className="inline-flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md transition group-hover:scale-105">
        <ApplePulseMark size={s.apple} />
      </span>
      {showText && (
        <span className="leading-tight">
          <span className={`block font-extrabold tracking-tight text-[var(--fg)] ${s.text}`}>
            {t.clinicName}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            {t.appName}
          </span>
        </span>
      )}
    </Link>
  );
}
