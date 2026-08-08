"use client";

import Image from "next/image";
import { ApplePulseMark } from "@/components/ApplePulseMark";
import { Clock } from "@/components/Clock";
import { HomePanels } from "@/components/HomePanels";
import { HomeTile } from "@/components/HomeTile";
import {
  AppealIcon,
  LegalIcon,
  NavIcon,
  ScheduleIcon,
} from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { clinic } from "@/lib/clinic";
import { useI18n } from "@/lib/i18n/context";

export default function HomePage() {
  const { t, locale } = useI18n();

  const tiles = [
    {
      href: "/navigation/",
      title: t.navShort,
      hint: t.navHint,
      color: "#0f766e",
      soft: "rgba(15, 118, 110, 0.18)",
      icon: <NavIcon />,
    },
    {
      href: "/schedule/",
      title: t.scheduleShort,
      hint: t.scheduleDesc,
      color: "#1d6fd8",
      soft: "rgba(29, 111, 216, 0.16)",
      icon: <ScheduleIcon />,
    },
    {
      href: "/legal/",
      title: t.legalShort,
      hint: t.legalDesc,
      color: "#0b7a75",
      soft: "rgba(11, 122, 117, 0.16)",
      icon: <LegalIcon />,
    },
    {
      href: "/appeal/",
      title: t.appealShort,
      hint: t.appealDesc,
      color: "#b45309",
      soft: "rgba(180, 83, 9, 0.14)",
      icon: <AppealIcon />,
    },
  ];

  return (
    <div className="home-skin home-skin-split min-h-screen">
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[220px] overflow-hidden lg:block lg:min-h-screen">
          <Image
            src="/brand/hero-doctor.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "72% center" }}
            sizes="45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#eef4f6]" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-md backdrop-blur">
              <ApplePulseMark size={40} />
              <div>
                <p className="text-lg font-extrabold text-[var(--fg)]">{t.clinicName}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  {t.homeBrandLine}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7">
          <header className="flex items-center justify-between gap-3 animate-fade-up">
            <div className="lg:hidden">
              <Logo size="md" />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <Clock />
            </div>
          </header>

          <div className="mt-6 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary)]">
              {t.homeBrandLine}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[var(--fg)] sm:text-5xl">
              {t.homeWelcome}
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--fg-muted)]">
              {t.clinicFullName}. {t.homeSubtitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="home-meta-chip">
                <span>{locale === "kk" ? "Мекенжай" : "Адрес"}</span>
                <strong>{t.clinicAddress}</strong>
              </div>
              <a
                href={`tel:${clinic.callCenter.replace(/-/g, "")}`}
                className="home-meta-chip home-meta-chip-accent"
              >
                <span>{locale === "kk" ? "Call-орталық" : "Call-центр"}</span>
                <strong>{clinic.callCenter}</strong>
              </a>
              <div className="home-meta-chip">
                <span>{locale === "kk" ? "Уақыт" : "Режим"}</span>
                <strong>08:00–20:00</strong>
              </div>
            </div>
          </div>

          <section className="mt-5 flex-1">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-extrabold tracking-tight text-[var(--fg)]">
                {t.homeMenuLabel}
              </h2>
              <p className="text-sm font-semibold text-[var(--fg-subtle)]">{t.homeTap}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
              {tiles.map((tile, i) => (
                <HomeTile
                  key={tile.href}
                  {...tile}
                  action={t.homeTap}
                  delayMs={80 + i * 50}
                />
              ))}
            </div>
          </section>

          <div className="mt-5 pb-4">
            <HomePanels />
          </div>
        </div>
      </div>
    </div>
  );
}
