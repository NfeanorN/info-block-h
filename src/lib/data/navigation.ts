import { navLocations } from "./mock";
import type { NavLocation, NavZone } from "@/lib/types";

export const NAV_ZONES: NavZone[] = [
  "service",
  "primary",
  "women",
  "special",
  "diagnostic",
  "prevention",
  "therapy",
  "admin",
];

export function getNavLocations(floor?: number): NavLocation[] {
  if (floor == null) return navLocations;
  return navLocations.filter((l) => l.floor === floor);
}

export function getFloors(): number[] {
  return [...new Set(navLocations.map((l) => l.floor))].sort((a, b) => a - b);
}

export function searchNavLocations(query: string): NavLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return navLocations;
  return navLocations.filter(
    (l) =>
      l.name.ru.toLowerCase().includes(q) ||
      l.name.kk.toLowerCase().includes(q) ||
      (l.room?.toLowerCase().includes(q) ?? false) ||
      (l.wing?.ru.toLowerCase().includes(q) ?? false) ||
      (l.wing?.kk.toLowerCase().includes(q) ?? false) ||
      l.howTo.ru.toLowerCase().includes(q) ||
      l.howTo.kk.toLowerCase().includes(q),
  );
}

export function filterNavLocations(opts: {
  query?: string;
  floor?: number | "all";
  zone?: NavZone | "all";
}): NavLocation[] {
  let list = opts.query ? searchNavLocations(opts.query) : navLocations;
  if (opts.floor != null && opts.floor !== "all") {
    list = list.filter((l) => l.floor === opts.floor);
  }
  if (opts.zone != null && opts.zone !== "all") {
    list = list.filter((l) => l.zone === opts.zone);
  }
  return list;
}
