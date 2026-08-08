import type { Locale } from "@/lib/i18n/types";

export type Localized = Record<Locale, string>;

export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type Department = {
  id: string;
  name: Localized;
};

export type Specialty = {
  id: string;
  name: Localized;
  departmentId: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialtyId: string;
  departmentId: string;
  room: string;
  onVacation?: boolean;
  note?: Localized;
  schedule: Partial<Record<WeekDay, string>>;
};

export type LegalDoc = {
  id: string;
  title: Localized;
  body: Localized;
};

export type NavZone =
  | "service"
  | "primary"
  | "women"
  | "special"
  | "diagnostic"
  | "prevention"
  | "therapy"
  | "admin";

export type NavLocation = {
  id: string;
  floor: number;
  zone: NavZone;
  name: Localized;
  room?: string;
  wing?: Localized;
  howTo: Localized;
};

export type AnnouncementSlide = {
  id: string;
  kind: "corruption" | "info" | "contact";
  title: Localized;
  body: Localized;
  phone?: string;
  phoneHint?: Localized;
  accent?: string;
  image?: string;
};

export type InfoSlide = {
  id: string;
  title: Localized;
  body: Localized;
  details?: { label: Localized; value: string }[];
  badge?: Localized;
  image?: string;
};

export type AppealType = "thank" | "complaint";

export type AppealPayload = {
  name: string;
  phone: string;
  departmentId: string;
  specialtyId: string;
  specialistId: string;
  text: string;
  type: AppealType;
  createdAt: string;
};
