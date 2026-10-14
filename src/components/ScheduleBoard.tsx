"use client";

import { useEffect, useMemo, useState } from "react";
import { getDoctors, getSpecialtyById } from "@/lib/data/doctors";
import { BOARD_STORAGE_KEY } from "@/lib/data/boardConstants";
import type { Doctor, WeekDay } from "@/lib/types";

export type BoardSection = {
  departmentId: string;
  title: string;
  days: WeekDay[];
  showRoom: boolean;
};

type Props = {
  sections: BoardSection[];
  refreshMs?: number;
};

const DAY_LABELS: Record<WeekDay, string> = {
  mon: "ПН",
  tue: "ВТ",
  wed: "СР",
  thu: "ЧТ",
  fri: "ПТ",
  sat: "СБ",
};

function currentWeekDay(): WeekDay | null {
  const map: Record<number, WeekDay | null> = {
    0: null,
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };
  return map[new Date().getDay()] ?? null;
}

function TimeCell({ value }: { value: string }) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
  if (!match) return <>{value}</>;
  return (
    <>
      {match[1]}
      <sup>{match[2]}</sup>–{match[3]}
      <sup>{match[4]}</sup>
    </>
  );
}

function doctorsForSection(
  all: Doctor[] | null,
  departmentId: string,
): Doctor[] {
  if (all?.length) {
    return all.filter((d) => d.departmentId === departmentId);
  }
  return getDoctors({ departmentId });
}

export function ScheduleBoard({ sections, refreshMs = 60_000 }: Props) {
  const today = currentWeekDay();
  const [liveDoctors, setLiveDoctors] = useState<Doctor[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/board-schedule/", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { doctors: Doctor[] };
        if (cancelled || !Array.isArray(data.doctors)) return;
        setLiveDoctors(data.doctors);
        try {
          localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data.doctors));
        } catch {
          /* ignore */
        }
      } catch {
        try {
          const raw = localStorage.getItem(BOARD_STORAGE_KEY);
          if (raw && !cancelled) {
            setLiveDoctors(JSON.parse(raw) as Doctor[]);
          }
        } catch {
          /* keep seed via getDoctors */
        }
      }
    }

    void load();
    const id = window.setInterval(() => {
      void load();
    }, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [refreshMs]);

  const sectionDoctors = useMemo(
    () =>
      sections
        .map((section) => ({
          section,
          doctors: doctorsForSection(liveDoctors, section.departmentId),
        }))
        .filter(({ doctors }) => doctors.length > 0),
    [sections, liveDoctors],
  );

  return (
    <div className="schedule-board">
      {sectionDoctors.map(({ section, doctors }) => (
        <section
          key={section.departmentId + section.title}
          className="schedule-board-section"
        >
          <h2 className="schedule-board-banner">{section.title}</h2>

          <table className="schedule-board-table">
            <thead>
              <tr>
                {section.showRoom && <th className="schedule-board-room">КАБ.</th>}
                <th className="schedule-board-spec">СПЕЦИАЛИСТ</th>
                <th className="schedule-board-name-col">ФИО ВРАЧА</th>
                {section.days.map((day) => (
                  <th
                    key={day}
                    className={`schedule-board-day${day === today ? " is-today" : ""}`}
                  >
                    {DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => {
                const specialty = getSpecialtyById(doctor.specialtyId);
                const extras = [doctor.note?.ru, doctor.onVacation ? "ОТПУСК" : null]
                  .filter(Boolean)
                  .join(" ");
                const name = extras
                  ? `${doctor.name} ${extras}`.trim()
                  : doctor.name;

                return (
                  <tr
                    key={doctor.id}
                    className={index % 2 === 1 ? "is-even" : undefined}
                  >
                    {section.showRoom && (
                      <td className="schedule-board-room">
                        {doctor.room && doctor.room !== "0" ? doctor.room : "–"}
                      </td>
                    )}
                    <td className="schedule-board-spec">
                      {specialty?.name.ru ?? "–"}
                    </td>
                    <td className="schedule-board-name">{name}</td>
                    {section.days.map((day) => {
                      const slot = doctor.schedule[day] || "–";
                      return (
                        <td
                          key={day}
                          className={`schedule-board-day${day === today ? " is-today" : ""}${
                            doctor.onVacation ? " is-vacation" : ""
                          }`}
                        >
                          {slot.includes(":") ? <TimeCell value={slot} /> : slot}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
