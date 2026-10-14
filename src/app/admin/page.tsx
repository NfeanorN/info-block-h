"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.replace("/admin/login/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0f172a] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300/80">
              ГП №25 · Admin
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">Панель редактирования</h1>
            <p className="mt-2 text-sm text-slate-300">
              Меняйте расписание врачей на ТВ-табло. Сохранения применяются сразу.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/5"
          >
            Выйти
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/board/1/"
            className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Табло 1
            </p>
            <h2 className="mt-2 text-xl font-extrabold">Женская + Специалисты</h2>
            <p className="mt-2 text-sm text-slate-500">/board/1/</p>
          </Link>

          <Link
            href="/admin/board/2/"
            className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Табло 2
            </p>
            <h2 className="mt-2 text-xl font-extrabold">
              Женская + Профилактика + Участковые
            </h2>
            <p className="mt-2 text-sm text-slate-500">/board/2/</p>
          </Link>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-slate-400">
          Логин по умолчанию: <code className="text-teal-300">admin</code> /{" "}
          <code className="text-teal-300">gp25board</code>. Можно сменить через{" "}
          <code className="text-slate-300">ADMIN_USER</code>,{" "}
          <code className="text-slate-300">ADMIN_PASSWORD</code>,{" "}
          <code className="text-slate-300">ADMIN_SECRET</code> в Vercel.
        </p>
      </div>
    </main>
  );
}
