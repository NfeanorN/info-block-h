import type { Locale } from "./types";

const WEEKDAYS: Record<Locale, string[]> = {
  kk: ["жек", "дүй", "сей", "сәр", "бей", "жұм", "сен"],
  ru: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
};

const MONTHS: Record<Locale, string[]> = {
  kk: [
    "қаң",
    "ақп",
    "нау",
    "сәу",
    "мам",
    "мау",
    "шіл",
    "там",
    "қыр",
    "қаз",
    "қар",
    "жел",
  ],
  ru: [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ],
};

export function formatClockTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function formatClockDate(date: Date, locale: Locale): string {
  const weekday = WEEKDAYS[locale][date.getDay()];
  const day = date.getDate();
  const month = MONTHS[locale][date.getMonth()];
  return `${weekday}, ${day} ${month}`;
}
