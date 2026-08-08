"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatClockDate, formatClockTime } from "@/lib/i18n/datetime";

type Props = {
  variant?: "light" | "dark";
};

export function Clock({ variant = "light" }: Props) {
  const { locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);
  const dark = variant === "dark";

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div
        className={`h-12 w-36 rounded-2xl ${dark ? "bg-white/10" : "bg-white/50"}`}
      />
    );
  }

  const time = formatClockTime(now);
  const date = formatClockDate(now, locale);

  return (
    <div
      className={`rounded-2xl border px-4 py-2 text-right backdrop-blur ${
        dark
          ? "border-white/20 bg-white/12 shadow-none"
          : "border-[var(--border)] bg-white/80 shadow-sm"
      }`}
    >
      <p
        className={`text-2xl font-extrabold leading-none tabular-nums tracking-tight ${
          dark ? "text-white" : "text-[var(--fg)]"
        }`}
      >
        {time}
      </p>
      <p
        className={`mt-1 text-xs font-semibold ${
          dark ? "text-white/70" : "text-[var(--fg-muted)]"
        }`}
      >
        {date}
      </p>
    </div>
  );
}
