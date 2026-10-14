"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [user, setUser] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Ошибка входа");
        return;
      }
      const next = search.get("next") || "/admin/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          ГП №25 · Admin
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Вход</h1>
        <p className="mt-2 text-sm text-slate-500">
          Редактирование табло расписания (board/1 и board/2).
        </p>

        <label className="mt-6 block text-sm font-bold text-slate-700">
          Логин
          <input
            className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-teal-600"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="mt-4 block text-sm font-bold text-slate-700">
          Пароль
          <input
            type="password"
            className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-teal-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-teal-700 px-5 text-base font-extrabold text-white disabled:opacity-60"
        >
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
