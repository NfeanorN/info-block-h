"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export type SelectOption = {
  value: string;
  label: string;
  meta?: string;
  disabled?: boolean;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = "",
  disabled = false,
}: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointer(e: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col gap-2 ${open ? "z-50" : "z-0"}`}
    >
      {label && (
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {label}
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex w-full min-h-16 items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/25 disabled:opacity-50 ${
          open
            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/15"
            : "border-[var(--border)] hover:border-[var(--border-strong)]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-sm font-extrabold text-[var(--primary)]">
              {selected.label.trim().charAt(0).toUpperCase()}
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <span
              className={`truncate text-lg font-semibold ${
                selected ? "text-[var(--fg)]" : "text-[var(--fg-subtle)]"
              }`}
            >
              {selected?.label ?? (placeholder || t.selectPlaceholder)}
            </span>
            {selected?.meta && (
              <span className="truncate text-sm font-medium text-[var(--fg-muted)]">
                {selected.meta}
              </span>
            )}
          </span>
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-[var(--fg-subtle)] transition-transform duration-200 ${
            open ? "rotate-180 text-[var(--primary)]" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-80 overflow-auto rounded-2xl border border-[var(--border)] bg-white py-1 shadow-[0_12px_32px_rgba(12,26,46,0.12)] animate-fade-in"
        >
          {options.length === 0 && (
            <li className="px-5 py-5 text-sm font-semibold text-[var(--fg-muted)]">
              {t.selectPlaceholder}
            </li>
          )}
          {options.map((opt, index) => {
            const isActive = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isActive}
                className={
                  index < options.length - 1
                    ? "border-b border-[var(--border)]/70"
                    : ""
                }
              >
                <button
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full min-h-[60px] items-center gap-3 px-4 py-3.5 text-left transition disabled:opacity-40 ${
                    isActive
                      ? "bg-[var(--primary-light)]"
                      : "bg-white hover:bg-[var(--bg)] active:bg-[var(--primary-light)]/60"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg)] text-[var(--fg-muted)]"
                    }`}
                  >
                    {opt.label.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-base font-bold ${
                        isActive ? "text-[var(--primary)]" : "text-[var(--fg)]"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.meta && (
                      <span className="mt-0.5 block truncate text-sm font-medium text-[var(--fg-muted)]">
                        {opt.meta}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <svg
                      className="h-5 w-5 shrink-0 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
