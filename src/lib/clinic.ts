import type { Localized } from "@/lib/types";

/** КГП на ПХВ «Городская поликлиника №25», Алматы */
export const clinic = {
  shortName: {
    ru: "ГП №25",
    kk: "№25 ҚЕ",
  } satisfies Localized,
  fullName: {
    ru: "Городская поликлиника №25",
    kk: "№25 қалалық емхана",
  } satisfies Localized,
  address: {
    ru: "г. Алматы, мкр. Дархан, ул. Халифа Алтай 24/1",
    kk: "Алматы қ., Дархан мкр., Халифа Алтай к-сі 24/1",
  } satisfies Localized,
  district: {
    ru: "Алатауский район",
    kk: "Алатау ауданы",
  } satisfies Localized,
  bin: "990840000101",
  callCenter: "310-00-25",
  callMobile: "8 775 020 43 04",
  patientSupport: "385-36-85",
  patientSupportAlt: "318-75-28",
  patientSupportRoom: "304",
  corruptionHotline: "1494",
  hours: {
    ru: "Ежедневно 08:00–20:00 (принцип «Поликлиника без очереди»). Регистратура 08:00–20:00.",
    kk: "Күн сайын 08:00–20:00 («Кезексіз емхана» қағидаты). Тіркеу 08:00–20:00.",
  } satisfies Localized,
  email: "gkkpgp25@mail.ru",
  website: "https://www.gkp25.kz",
  chiefDoctor: {
    ru: "Тұрсұн Әкім Хазретәліұлы",
    kk: "Тұрсұн Әкім Хазретәліұлы",
  } satisfies Localized,
};
