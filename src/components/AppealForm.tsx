"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FrownIcon, HomeIcon, SmileIcon } from "@/components/icons";
import {
  VirtualKeyboard,
  type KeyboardField,
} from "@/components/VirtualKeyboard";
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

const fieldClass =
  "min-h-16 rounded-2xl border border-[var(--border)] bg-white px-5 text-lg font-semibold shadow-sm outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15 cursor-pointer";

const fieldActiveClass =
  "border-[var(--primary)]/50 ring-2 ring-[var(--primary)]/20";

const FIELD_ORDER: KeyboardField[] = ["name", "phone", "text"];

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
  const [activeField, setActiveField] = useState<KeyboardField | null>(null);

  useEffect(() => {
    if (!activeField) return;
    const el = document.querySelector<HTMLElement>(
      `[data-kb-field="${activeField}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeField]);

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
    setActiveField(null);
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
    setActiveField(null);
  }

  function applyKeyboardInput(char: string) {
    if (!activeField) return;
    if (activeField === "name") {
      setName((prev) => prev + char);
      return;
    }
    if (activeField === "text") {
      setText((prev) => prev + char);
      return;
    }
    setPhone((prev) => formatKzPhone(prev + char));
  }

  function applyKeyboardBackspace() {
    if (!activeField) return;
    if (activeField === "name") {
      setName((prev) => prev.slice(0, -1));
      return;
    }
    if (activeField === "text") {
      setText((prev) => prev.slice(0, -1));
      return;
    }
    setPhone((prev) => {
      const next = formatKzPhone(prev.slice(0, -1));
      return next.length < 2 ? "+7" : next;
    });
  }

  function focusNextField() {
    if (!activeField) return;
    if (activeField === "text") {
      setText((prev) => prev + "\n");
      return;
    }
    const idx = FIELD_ORDER.indexOf(activeField);
    const next = FIELD_ORDER[idx + 1];
    if (next) setActiveField(next);
    else setActiveField(null);
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
    <div
      className={`mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 animate-fade-up ${
        activeField ? "pb-[22rem]" : ""
      }`}
    >
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.appealName}
          </span>
          <input
            data-kb-field="name"
            value={name}
            readOnly
            inputMode="none"
            onFocus={() => setActiveField("name")}
            onClick={() => setActiveField("name")}
            placeholder={t.appealName}
            className={`${fieldClass} ${
              activeField === "name" ? fieldActiveClass : ""
            }`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.appealPhone}
          </span>
          <input
            data-kb-field="phone"
            value={phone}
            readOnly
            inputMode="none"
            onFocus={() => {
              if (!phone) setPhone("+7");
              setActiveField("phone");
            }}
            onClick={() => setActiveField("phone")}
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            className={`${fieldClass} tabular-nums ${
              activeField === "phone" ? fieldActiveClass : ""
            }`}
          />
        </label>
      </div>

      <Select
        value={departmentId}
        onChange={(v) => {
          setActiveField(null);
          setDepartmentId(v);
          resetCascade("dept");
        }}
        options={deptOptions}
        placeholder={t.appealDepartment}
      />

      <Select
        value={specialtyId}
        onChange={(v) => {
          setActiveField(null);
          setSpecialtyId(v);
          resetCascade("spec");
        }}
        options={specialtyOptions}
        placeholder={t.appealSpecialty}
        disabled={!departmentId}
      />

      <Select
        value={specialistId}
        onChange={(v) => {
          setActiveField(null);
          setSpecialistId(v);
        }}
        options={specialistOptions}
        placeholder={t.appealSpecialist}
        disabled={!specialtyId}
      />

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {t.appealText}
        </span>
        <textarea
          data-kb-field="text"
          value={text}
          readOnly
          inputMode="none"
          onFocus={() => setActiveField("text")}
          onClick={() => setActiveField("text")}
          placeholder={t.appealText}
          rows={5}
          className={`min-h-36 resize-none rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-lg font-semibold shadow-sm outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15 cursor-pointer ${
            activeField === "text" ? fieldActiveClass : ""
          }`}
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

      {activeField && (
        <VirtualKeyboard
          field={activeField}
          labels={{
            space: t.kbSpace,
            save: t.kbSave,
            lang: t.kbLang,
          }}
          onInput={applyKeyboardInput}
          onBackspace={applyKeyboardBackspace}
          onEnter={focusNextField}
          onSave={() => setActiveField(null)}
          onClose={() => setActiveField(null)}
        />
      )}
    </div>
  );
}
