import type { AppealPayload } from "@/lib/types";

const STORAGE_KEY = "infomat-appeals";

export function submitAppeal(payload: Omit<AppealPayload, "createdAt">): AppealPayload {
  const full: AppealPayload = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: AppealPayload[] = raw ? (JSON.parse(raw) as AppealPayload[]) : [];
      list.unshift(full);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
    } catch {
    }
  }

  return full;
}

export function getAppeals(): AppealPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppealPayload[]) : [];
  } catch {
    return [];
  }
}
