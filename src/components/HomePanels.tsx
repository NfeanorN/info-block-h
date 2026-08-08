"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Carousel } from "@/components/Carousel";
import {
  getAnnouncementSlides,
  getCorruptionSlide,
  getInfoSlides,
} from "@/lib/data/announcements";
import { useI18n } from "@/lib/i18n/context";

type FeedItem = {
  id: string;
  title: string;
  body: string;
  phone?: string;
  meta?: string;
  image?: string;
  accent: string;
};

export function HomePanels() {
  const { t, locale } = useI18n();
  const corruption = getCorruptionSlide();
  const announcements = getAnnouncementSlides();
  const info = getInfoSlides();

  const feed = useMemo<FeedItem[]>(() => {
    const a = announcements.map((slide) => ({
      id: slide.id,
      title: slide.title[locale],
      body: slide.body[locale],
      phone: slide.phone,
      meta: slide.phoneHint?.[locale],
      image: slide.image,
      accent: slide.accent ?? "#0b7a75",
    }));
    const i = info.map((slide) => ({
      id: slide.id,
      title: slide.title[locale],
      body: slide.body[locale],
      meta: slide.badge?.[locale],
      image: slide.image,
      accent: "#1d6fd8",
    }));
    return [...a, ...i];
  }, [announcements, info, locale]);

  return (
    <div className="space-y-4 animate-fade-up" style={{ animationDelay: "220ms" }}>
      {/* Сыбайлас жемқорлық — всегда отдельно и заметно */}
      <section className="corruption-banner relative overflow-hidden rounded-[28px] shadow-[var(--shadow-lg)]">
        <div className="absolute inset-0">
          <Image
            src={corruption.image ?? "/brand/feed/anticor.png"}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062a2c]/95 via-[#0b4f52]/88 to-[#0b7a75]/45" />
        </div>

        <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-stretch sm:p-6">
          <div className="flex min-h-[120px] w-full shrink-0 flex-col justify-between rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:w-44">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
              {t.corruptionBadge}
            </span>
            <span className="text-5xl font-extrabold tracking-tight text-white tabular-nums">
              {corruption.phone}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100/90">
              {t.corruptionTitle}
            </p>
            <h3 className="mt-1.5 text-2xl font-extrabold leading-snug tracking-tight">
              {corruption.title[locale]}
            </h3>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-white/85">
              {corruption.body[locale]}
            </p>
            <p className="mt-3 text-sm font-bold text-teal-100">
              {t.corruptionDuty}
            </p>
          </div>
        </div>
      </section>

      {/* Остальные объявления — с картинками */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--fg)]">
            {t.homeFeedLabel}
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.announcements}
          </p>
        </div>

        <Carousel count={feed.length} intervalMs={7000}>
          {(index) => {
            const item = feed[index];
            return (
              <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
                <div className="grid sm:grid-cols-[1.05fr_1.2fr]">
                  <div className="relative min-h-[160px] sm:min-h-[200px]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 280px"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(145deg, ${item.accent}, #10233f)`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/10" />
                    {item.phone && (
                      <div className="absolute bottom-3 left-3 rounded-2xl bg-white/95 px-3.5 py-2 shadow-sm backdrop-blur">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-subtle)]">
                          {item.meta}
                        </p>
                        <p className="text-2xl font-extrabold tabular-nums text-[var(--fg)]">
                          {item.phone}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center p-5 sm:p-6">
                    {item.meta && !item.phone && (
                      <span className="mb-2 inline-flex w-fit rounded-xl bg-[var(--primary-light)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
                        {item.meta}
                      </span>
                    )}
                    <h3 className="text-xl font-extrabold leading-snug text-[var(--fg)] sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-[var(--fg-muted)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          }}
        </Carousel>
      </section>
    </div>
  );
}
