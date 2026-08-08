"use client";

import { useMemo, useState } from "react";
import { PinIcon } from "@/components/icons";
import { KioskShell } from "@/components/KioskShell";
import { clinic } from "@/lib/clinic";
import { filterNavLocations, getFloors, NAV_ZONES } from "@/lib/data/navigation";
import { useI18n } from "@/lib/i18n/context";
import type { NavZone } from "@/lib/types";

export default function NavigationPage() {
  const { t, locale } = useI18n();
  const floors = getFloors();
  const [floor, setFloor] = useState<number | "all">("all");
  const [zone, setZone] = useState<NavZone | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const zoneLabels: Record<NavZone | "all", string> = {
    all: t.navZoneAll,
    service: t.navZoneService,
    primary: t.navZonePrimary,
    women: t.navZoneWomen,
    special: t.navZoneSpecial,
    diagnostic: t.navZoneDiagnostic,
    prevention: t.navZonePrevention,
    therapy: t.navZoneTherapy,
    admin: t.navZoneAdmin,
  };

  const locations = useMemo(
    () => filterNavLocations({ query, floor, zone }),
    [floor, zone, query],
  );

  return (
    <KioskShell title={t.navigationHeading} subtitle={t.navigationHint}>
      <div className="mb-4 rounded-3xl border border-[var(--border)] bg-white/90 p-4 shadow-sm animate-fade-up sm:p-5">
        <p className="text-lg font-extrabold text-[var(--fg)]">{t.clinicFullName}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--fg-muted)]">
          {clinic.address[locale]} · {clinic.district[locale]}
        </p>
        <p className="mt-2 text-sm font-bold text-[var(--primary)]">
          {t.clinicCall} · {clinic.callMobile}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 animate-fade-up">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="min-h-14 w-full rounded-2xl border border-[var(--border)] bg-white px-5 text-lg font-semibold shadow-sm outline-none focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/15"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFloor("all")}
            className={`min-h-12 rounded-2xl px-4 text-sm font-bold transition ${
              floor === "all"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-[var(--border)] bg-white text-[var(--fg-muted)]"
            }`}
          >
            {t.all}
          </button>
          {floors.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFloor(f)}
              className={`min-h-12 rounded-2xl px-4 text-sm font-bold transition ${
                floor === f
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--fg-muted)]"
              }`}
            >
              {t.floor} {f}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setZone("all")}
            className={`min-h-12 rounded-2xl px-4 text-sm font-bold transition ${
              zone === "all"
                ? "bg-[var(--fg)] text-white shadow-sm"
                : "border border-[var(--border)] bg-white text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
            }`}
          >
            {zoneLabels.all}
          </button>
          {NAV_ZONES.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZone(z)}
              className={`min-h-12 rounded-2xl px-4 text-sm font-bold transition ${
                zone === z
                  ? "bg-[var(--fg)] text-white shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
              }`}
            >
              {zoneLabels[z]}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {locations.length === 0 && (
          <li className="rounded-2xl bg-white px-5 py-10 text-center text-[var(--fg-muted)] shadow-sm">
            {t.navigationEmpty}
          </li>
        )}
        {locations.map((loc, i) => {
          const open = openId === loc.id;
          return (
            <li key={loc.id} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : loc.id)}
                className="flex w-full flex-col rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-left shadow-sm transition hover:border-[var(--primary)]/30 hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <PinIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold leading-snug text-[var(--fg)]">
                      {loc.name[locale]}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-[var(--fg-muted)]">
                      <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-[var(--primary)]">
                        {t.floor} {loc.floor}
                      </span>
                      {loc.room && (
                        <span>
                          {t.room} {loc.room}
                        </span>
                      )}
                      {loc.wing && (
                        <span>
                          · {loc.wing[locale]}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[var(--accent)]">
                    {t.howToGet}
                  </span>
                </span>
                {open && (
                  <span className="mt-4 rounded-xl bg-[var(--bg)] px-4 py-3 text-base leading-relaxed text-[var(--fg-muted)] animate-fade-in">
                    {loc.howTo[locale]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </KioskShell>
  );
}
