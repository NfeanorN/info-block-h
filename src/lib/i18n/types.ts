export type Locale = "ru" | "kk";

export type TranslationKey = keyof typeof import("./translations").translations.ru;
