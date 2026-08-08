"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/Select";
import { getDoctors, getSpecialties, getSpecialtyById } from "@/lib/data/doctors";
import { useI18n } from "@/lib/i18n/context";
import type { WeekDay } from "@/lib/types";

const DAYS: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat"];

function currentWeekDay(): WeekDay | null {
  const js = new Date().getDay(); // 0 Sun .. 6 Sat
  const map: Record<number, WeekDay | null> = {
    0: null,
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };
  return map[js] ?? null;
}

export function ScheduleTable() {
  const { t, locale } = useI18n();
  const [specialtyId, setSpecialtyId] = useState("");
  const today = currentWeekDay();

  const specialtyOptions = useMemo(
    () => [
      { value: "", label: t.all },
      ...getSpecialties().map((s) => ({ value: s.id, label: s.name[locale] })),
    ],
    [locale, t.all],
  );

  const rows = useMemo(
    () => getDoctors(specialtyId ? { specialtyId } : undefined),
    [specialtyId],
  );

  const dayLabels: Record<WeekDay, string> = {
    mon: t.dayMon,
    tue: t.dayTue,
    wed: t.dayWed,
    thu: t.dayThu,
    fri: t.dayFri,
    sat: t.daySat,
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="max-w-md">
        <Select
          value={specialtyId}
          onChange={setSpecialtyId}
          options={specialtyOptions}
          placeholder={t.scheduleHint}
        />
      </div>

      <div className="flex-1 overflow-auto rounded-3xl border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
              <th className="sticky top-0 bg-[var(--bg)] px-4 py-4 text-xs font-bold uppercase tracking-wider text-[var(--fg-subtle)]">
                {t.scheduleSpecialty}
              </th>
              <th className="sticky top-0 bg-[var(--bg)] px-4 py-4 text-xs font-bold uppercase tracking-wider text-[var(--fg-subtle)]">
                {t.scheduleDoctor}
              </th>
              <th className="sticky top-0 bg-[var(--bg)] px-4 py-4 text-xs font-bold uppercase tracking-wider text-[var(--fg-subtle)]">
                {t.scheduleCabinet}
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className={`sticky top-0 px-3 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                    d === today
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "bg-[var(--bg)] text-[var(--fg-subtle)]"
                  }`}
                >
                  {dayLabels[d]}
                  {d === today && (
                    <span className="mt-0.5 block text-[10px] font-semibold normal-case tracking-normal">
                      {t.today}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[var(--fg-muted)]">
                  {t.scheduleEmpty}
                </td>
              </tr>
            )}
            {rows.map((doc) => {
              const specialty = getSpecialtyById(doc.specialtyId);
              return (
                <tr
                  key={doc.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--primary-light)]/40"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-[var(--fg)]">
                    {specialty?.name[locale] ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-base font-bold text-[var(--fg)]">{doc.name}</p>
                    {(doc.onVacation || doc.note) && (
                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          doc.onVacation
                            ? "bg-[var(--danger-light)] text-[var(--danger)]"
                            : "bg-[var(--accent-light)] text-[var(--accent)]"
                        }`}
                      >
                        {doc.onVacation ? t.vacation : doc.note?.[locale]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-base font-extrabold tabular-nums text-[var(--primary)]">
                    {doc.room}
                  </td>
                  {DAYS.map((d) => (
                    <td
                      key={d}
                      className={`px-2 py-4 text-center text-sm font-semibold tabular-nums ${
                        d === today ? "bg-[var(--primary-light)]/50 text-[var(--fg)]" : "text-[var(--fg-muted)]"
                      }`}
                    >
                      {doc.onVacation ? "—" : doc.schedule[d] || "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
