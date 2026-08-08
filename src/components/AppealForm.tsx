"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FrownIcon, HomeIcon, SmileIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { submitAppeal } from "@/lib/data/appeals";
import {
  getDepartments,
  getDoctors,
  getSpecialties,
} from "@/lib/data/doctors";
import { useI18n } from "@/lib/i18n/context";
import { formatKzPhone, isCompleteKzPhone } from "@/lib/phone";
import type { AppealType } from "@/lib/types";

export function AppealForm() {
  const { t, locale } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [departmentId, setDepartmentId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [specialistId, setSpecialistId] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<AppealType | null>(null);

  const deptOptions = useMemo(
    () => getDepartments().map((d) => ({ value: d.id, label: d.name[locale] })),
    [locale],
  );

  const specialtyOptions = useMemo(
    () =>
      getSpecialties(departmentId || undefined).map((s) => ({
        value: s.id,
        label: s.name[locale],
      })),
    [departmentId, locale],
  );

  const specialistOptions = useMemo(
    () =>
      getDoctors({
        departmentId: departmentId || undefined,
        specialtyId: specialtyId || undefined,
      }).map((d) => ({
        value: d.id,
        label: d.name,
        meta: d.onVacation
          ? t.vacation
          : d.note
            ? d.note[locale]
            : `${t.room} ${d.room}`,
        disabled: d.onVacation,
      })),
    [departmentId, specialtyId, locale, t.room, t.vacation],
  );

  function resetCascade(level: "dept" | "spec" | "doc") {
    if (level === "dept") {
      setSpecialtyId("");
      setSpecialistId("");
    } else if (level === "spec") {
      setSpecialistId("");
    }
  }

  function validate() {
    if (
      !name.trim() ||
      !isCompleteKzPhone(phone) ||
      !departmentId ||
      !specialtyId ||
      !specialistId ||
      !text.trim()
    ) {
      setError(t.appealError);
      return false;
    }
    setError(null);
    return true;
  }

  function onSubmit(type: AppealType) {
    if (!validate()) return;
    submitAppeal({
      name: name.trim(),
      phone: phone.trim(),
      departmentId,
      specialtyId,
      specialistId,
      text: text.trim(),
      type,
    });
    setDone(type);
  }

  function startAgain() {
    setName("");
    setPhone("+7");
    setDepartmentId("");
    setSpecialtyId("");
    setSpecialistId("");
    setText("");
    setError(null);
    setDone(null);
  }

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center animate-fade-up">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-md ${
            done === "thank" ? "bg-[var(--success)]" : "bg-[var(--accent)]"
          }`}
        >
          {done === "thank" ? <SmileIcon /> : <FrownIcon />}
        </div>
        <p className="mt-6 max-w-md text-center text-2xl font-extrabold text-[var(--fg)]">
          {done === "thank" ? t.appealSuccessThank : t.appealSuccessComplain}
        </p>
        <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="xl" fullWidth onClick={startAgain}>
            {t.appealAgain}
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-lg font-bold text-white shadow-md"
          >
            <HomeIcon />
            {t.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 animate-fade-up">
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.appealName}
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.appealName}
            className="min-h-16 rounded-2xl border border-[var(--border)] bg-white px-5 text-lg font-semibold shadow-sm outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.appealPhone}
          </span>
          <input
            value={phone}
            onChange={(e) => setPhone(formatKzPhone(e.target.value))}
            onFocus={() => {
              if (!phone) setPhone("+7");
            }}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            autoComplete="tel"
            className="min-h-16 rounded-2xl border border-[var(--border)] bg-white px-5 text-lg font-semibold tabular-nums shadow-sm outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15"
          />
        </label>
      </div>

      <Select
        value={departmentId}
        onChange={(v) => {
          setDepartmentId(v);
          resetCascade("dept");
        }}
        options={deptOptions}
        placeholder={t.appealDepartment}
      />

      <Select
        value={specialtyId}
        onChange={(v) => {
          setSpecialtyId(v);
          resetCascade("spec");
        }}
        options={specialtyOptions}
        placeholder={t.appealSpecialty}
        disabled={!departmentId}
      />

      <Select
        value={specialistId}
        onChange={setSpecialistId}
        options={specialistOptions}
        placeholder={t.appealSpecialist}
        disabled={!specialtyId}
      />

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {t.appealText}
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.appealText}
          rows={5}
          className="min-h-36 resize-none rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-lg font-semibold shadow-sm outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15"
        />
      </label>

      {error && (
        <p className="rounded-2xl bg-[var(--danger-light)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="mt-auto grid gap-3 pt-2 sm:grid-cols-3">
        <Link
          href="/"
          className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
        >
          <HomeIcon />
          {t.backHome}
        </Link>
        <Button
          type="button"
          variant="success"
          size="xl"
          fullWidth
          onClick={() => onSubmit("thank")}
        >
          <SmileIcon />
          {t.appealThank}
        </Button>
        <Button
          type="button"
          variant="danger"
          size="xl"
          fullWidth
          onClick={() => onSubmit("complaint")}
        >
          <FrownIcon />
          {t.appealComplain}
        </Button>
      </div>
    </div>
  );
}
