"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Carousel } from "@/components/Carousel";
import {
  getAnnouncementSlides,
  getCorruptionSlide,
  getInfoSlides,
} from "@/lib/data/announcements";
import { feedExtrasById } from "@/lib/data/feedExtras";
import { useI18n } from "@/lib/i18n/context";

type FeedItem = {
  id: string;
  title: string;
  lead: string;
  points: string[];
  phone?: string;
  meta?: string;
  accent: string;
};

const CARD_HEIGHT = "h-[300px]";

export function HomePanels() {
  const { t, locale } = useI18n();
  const corruption = getCorruptionSlide();
  const announcements = getAnnouncementSlides();
  const info = getInfoSlides();

  const feed = useMemo<FeedItem[]>(() => {
    const contacts = announcements.map((slide) => {
      const extra = feedExtrasById[slide.id];
      return {
        id: slide.id,
        title: slide.title[locale],
        lead: extra?.lead[locale] ?? slide.body[locale],
        points: (extra?.points ?? []).map((p) => p[locale]),
        phone: slide.phone,
        meta: slide.phoneHint?.[locale],
        accent: extra?.accent ?? slide.accent ?? "#0b7a75",
      };
    });

    const topics = info.map((slide) => {
      const extra = feedExtrasById[slide.id];
      return {
        id: slide.id,
        title: slide.title[locale],
        lead: extra?.lead[locale] ?? slide.body[locale],
        points: (extra?.points ?? []).map((p) => p[locale]),
        meta: slide.badge?.[locale],
        accent: extra?.accent ?? "#1d6fd8",
      };
    });

    return [...contacts, ...topics];
  }, [announcements, info, locale]);

  return (
    <div className="space-y-4 animate-fade-up" style={{ animationDelay: "220ms" }}>
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

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--fg)]">
            {t.homeFeedLabel}
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {t.announcements}
          </p>
        </div>

        <Carousel count={feed.length} intervalMs={8000}>
          {(index) => {
            const item = feed[index];

            return (
              <article
                className={`relative ${CARD_HEIGHT} overflow-hidden rounded-[28px] border-2 border-[var(--border-strong)] bg-white shadow-[var(--shadow-md)]`}
                style={{
                  background: `linear-gradient(145deg, ${item.accent}10 0%, #ffffff 40%, #ffffff 100%)`,
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ background: item.accent }}
                  aria-hidden
                />

                <div className="flex h-full flex-col px-5 py-4 sm:px-7 sm:py-5">
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {item.meta && !item.phone && (
                      <span
                        className="inline-flex max-w-full truncate rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wide"
                        style={{
                          background: `${item.accent}18`,
                          color: item.accent,
                        }}
                      >
                        {item.meta}
                      </span>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                      {index + 1} / {feed.length}
                    </span>
                  </div>

                  <h3 className="mt-2 shrink-0 text-xl font-extrabold leading-snug tracking-tight text-[var(--fg)] sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 shrink-0 text-sm leading-snug text-[var(--fg-muted)] sm:text-base">
                    {item.lead}
                  </p>

                  {item.phone && (
                    <p
                      className="mt-2 shrink-0 text-4xl font-extrabold tabular-nums tracking-tight"
                      style={{ color: item.accent }}
                    >
                      {item.phone}
                    </p>
                  )}

                  <ul className="mt-3 grid min-h-0 flex-1 auto-rows-fr content-start gap-2 overflow-hidden sm:grid-cols-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex min-h-[2.75rem] items-start gap-2.5 rounded-2xl border-2 bg-white px-3.5 py-2.5 text-sm font-semibold leading-snug text-[var(--fg)]"
                        style={{
                          borderColor: `${item.accent}55`,
                          boxShadow: `0 1px 0 ${item.accent}14`,
                        }}
                      >
                        <span
                          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: item.accent }}
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          }}
        </Carousel>
      </section>
    </div>
  );
}
