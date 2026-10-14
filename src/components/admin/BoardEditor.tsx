"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDepartments, getSpecialties } from "@/lib/data/doctors";
import { BOARD_STORAGE_KEY } from "@/lib/data/boardConstants";
import type { Doctor, WeekDay } from "@/lib/types";

const DAYS: WeekDay[] = ["mon", "tue", "wed", "thu", "fri"];
const DAY_LABELS: Record<WeekDay, string> = {
  mon: "ПН",
  tue: "ВТ",
  wed: "СР",
  thu: "ЧТ",
  fri: "ПТ",
  sat: "СБ",
};

type BoardConfig = {
  id: "1" | "2";
  title: string;
  departmentIds: string[];
};

const BOARDS: Record<"1" | "2", BoardConfig> = {
  "1": {
    id: "1",
    title: "Табло 1 · Женская + Специалисты",
    departmentIds: ["2", "3"],
  },
  "2": {
    id: "2",
    title: "Табло 2 · Женская + Профилактика + Участковые",
    departmentIds: ["2", "5", "4"],
  },
};

function emptyDoctor(departmentId: string, specialtyId: string): Doctor {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    specialtyId,
    departmentId,
    room: "",
    onVacation: false,
    note: { ru: "", kk: "" },
    schedule: { mon: "–", tue: "–", wed: "–", thu: "–", fri: "–" },
  };
}

function normalizeTime(value: string): string {
  const v = value.trim();
  if (!v || v === "-" || v === "–" || v.toLowerCase() === "нет") return "–";
  const compact = v.replace(/\s+/g, "");
  const m = compact.match(/^(\d{1,2})[:.]?(\d{2})?[–\-—](\d{1,2})[:.]?(\d{2})?$/);
  if (!m) return v;
  const h1 = m[1].padStart(2, "0");
  const m1 = (m[2] ?? "00").padStart(2, "0");
  const h2 = m[3].padStart(2, "0");
  const m2 = (m[4] ?? "00").padStart(2, "0");
  return `${h1}:${m1}–${h2}:${m2}`;
}

export function BoardEditor({ boardId }: { boardId: "1" | "2" }) {
  const board = BOARDS[boardId];
  const router = useRouter();
  const departments = useMemo(() => getDepartments(), []);
  const allSpecialties = useMemo(() => getSpecialties(), []);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [deptTab, setDeptTab] = useState(board.departmentIds[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/board-schedule/", { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { doctors: Doctor[] };
      setDoctors(data.doctors);
      try {
        localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data.doctors));
      } catch {
        /* ignore */
      }
      setDirty(false);
    } catch {
      try {
        const raw = localStorage.getItem(BOARD_STORAGE_KEY);
        if (raw) {
          setDoctors(JSON.parse(raw) as Doctor[]);
          setError("Сервер недоступен — показан локальный кэш");
        } else {
          setError("Не удалось загрузить расписание");
        }
      } catch {
        setError("Не удалось загрузить расписание");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => doctors.filter((d) => d.departmentId === deptTab),
    [doctors, deptTab],
  );

  const specsForDept = useMemo(
    () => allSpecialties.filter((s) => s.departmentId === deptTab),
    [allSpecialties, deptTab],
  );

  function patchDoctor(id: string, patch: Partial<Doctor>) {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    setDirty(true);
    setMessage(null);
  }

  function patchSchedule(id: string, day: WeekDay, value: string) {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, schedule: { ...d.schedule, [day]: value } }
          : d,
      ),
    );
    setDirty(true);
    setMessage(null);
  }

  function addDoctor() {
    const specialtyId = specsForDept[0]?.id ?? "";
    setDoctors((prev) => [...prev, emptyDoctor(deptTab, specialtyId)]);
    setDirty(true);
    setMessage(null);
  }

  function removeDoctor(id: string) {
    if (!confirm("Удалить эту строку?")) return;
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    setDirty(true);
    setMessage(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const cleaned = doctors.map((d) => ({
      ...d,
      name: d.name.trim(),
      room: d.room.trim() || "–",
      schedule: Object.fromEntries(
        DAYS.map((day) => [day, normalizeTime(d.schedule[day] ?? "–")]),
      ) as Doctor["schedule"],
    }));

    try {
      const res = await fetch("/api/board-schedule/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctors: cleaned }),
      });
      if (res.status === 401) {
        router.replace("/admin/login/?next=/admin/board/" + boardId + "/");
        return;
      }
      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { doctors: Doctor[] };
      setDoctors(data.doctors);
      try {
        localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data.doctors));
      } catch {
        /* ignore */
      }
      setDirty(false);
      setMessage("Сохранено. Табло обновятся при следующей перезагрузке (до ~1 мин).");
    } catch {
      setError("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  async function resetSeed() {
    if (!confirm("Сбросить всё к исходным данным из almamed?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/board-schedule/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      if (res.status === 401) {
        router.replace("/admin/login/");
        return;
      }
      if (!res.ok) throw new Error("reset failed");
      const data = (await res.json()) as { doctors: Doctor[] };
      setDoctors(data.doctors);
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data.doctors));
      setDirty(false);
      setMessage("Сброшено к исходным данным");
    } catch {
      setError("Сброс не удался");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.replace("/admin/login/");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ doctors }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gp25-board-${boardId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          doctors?: Doctor[];
        };
        if (!Array.isArray(parsed.doctors)) throw new Error("bad");
        setDoctors(parsed.doctors);
        setDirty(true);
        setMessage("Импорт загружен — нажмите «Сохранить»");
      } catch {
        setError("Неверный JSON-файл");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/admin/" className="text-sm font-bold text-teal-700">
            ← Админ
          </Link>
          <h1 className="text-lg font-extrabold">{board.title}</h1>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href={`/board/${boardId}/`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              Открыть табло
            </a>
            <button
              type="button"
              onClick={exportJson}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              Экспорт
            </button>
            <label className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
              Импорт
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={resetSeed}
              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
            >
              Сброс
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-extrabold text-white disabled:opacity-50"
            >
              {saving ? "Сохранение…" : dirty ? "Сохранить*" : "Сохранено"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-wrap gap-2">
          {board.departmentIds.map((id) => {
            const dep = departments.find((d) => d.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setDeptTab(id)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold ${
                  deptTab === id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 shadow-sm"
                }`}
              >
                {dep?.name.ru ?? id}
              </button>
            );
          })}
        </div>

        {message && (
          <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-8 text-slate-500">Загрузка…</p>
        ) : (
          <div className="mt-5 space-y-4">
            {visible.length === 0 && (
              <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-semibold text-slate-500">
                Пока никого нет. Добавьте специалистов — блок появится на табло
                между соседними отделениями.
              </p>
            )}
            {visible.map((doc) => (
              <article
                key={doc.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="grid gap-3 md:grid-cols-12">
                  <label className="md:col-span-2 text-xs font-bold text-slate-500">
                    Каб.
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                      value={doc.room}
                      onChange={(e) => patchDoctor(doc.id, { room: e.target.value })}
                    />
                  </label>
                  <label className="md:col-span-3 text-xs font-bold text-slate-500">
                    Специалист
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                      value={doc.specialtyId}
                      onChange={(e) =>
                        patchDoctor(doc.id, { specialtyId: e.target.value })
                      }
                    >
                      {specsForDept.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name.ru}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-4 text-xs font-bold text-slate-500">
                    ФИО
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                      value={doc.name}
                      onChange={(e) => patchDoctor(doc.id, { name: e.target.value })}
                    />
                  </label>
                  <label className="md:col-span-2 text-xs font-bold text-slate-500">
                    Пометка
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
                      value={doc.note?.ru ?? ""}
                      onChange={(e) =>
                        patchDoctor(doc.id, {
                          note: { ru: e.target.value, kk: e.target.value },
                        })
                      }
                      placeholder="ВЗРОСЛЫЙ…"
                    />
                  </label>
                  <div className="md:col-span-1 flex items-end justify-between gap-2 md:flex-col md:items-stretch">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <input
                        type="checkbox"
                        checked={Boolean(doc.onVacation)}
                        onChange={(e) =>
                          patchDoctor(doc.id, { onVacation: e.target.checked })
                        }
                      />
                      Отпуск
                    </label>
                    <button
                      type="button"
                      onClick={() => removeDoctor(doc.id)}
                      className="rounded-xl bg-red-50 px-2 py-2 text-xs font-bold text-red-700"
                    >
                      Удал.
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {DAYS.map((day) => (
                    <label key={day} className="text-xs font-bold text-slate-500">
                      {DAY_LABELS[day]}
                      <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm font-semibold"
                        value={doc.schedule[day] ?? "–"}
                        onChange={(e) => patchSchedule(doc.id, day, e.target.value)}
                        onBlur={(e) =>
                          patchSchedule(doc.id, day, normalizeTime(e.target.value))
                        }
                        placeholder="09:00–15:00"
                      />
                    </label>
                  ))}
                </div>
              </article>
            ))}

            <button
              type="button"
              onClick={addDoctor}
              className="w-full rounded-3xl border-2 border-dashed border-slate-300 bg-white py-4 text-sm font-extrabold text-slate-600 hover:border-teal-500 hover:text-teal-700"
            >
              + Добавить врача
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
