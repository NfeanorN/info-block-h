import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { Doctor } from "@/lib/types";
import { doctors as seedDoctors } from "@/lib/data/clinicData.generated";
import { BOARD_STORAGE_KEY } from "@/lib/data/boardConstants";

export { BOARD_STORAGE_KEY };

declare global {
  // eslint-disable-next-line no-var
  var __gp25BoardDoctors: Doctor[] | undefined;
}

function persistPath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "gp25-board-doctors.json");
  }
  return path.join(process.cwd(), "data", "board-doctors.json");
}

function readFromDisk(): Doctor[] | null {
  try {
    const file = persistPath();
    if (!existsSync(file)) return null;
    const raw = readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as { doctors?: Doctor[] };
    if (!Array.isArray(parsed.doctors) || !parsed.doctors.length) return null;
    return parsed.doctors;
  } catch {
    return null;
  }
}

function writeToDisk(list: Doctor[]): void {
  try {
    const file = persistPath();
    const dir = path.dirname(file);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(file, JSON.stringify({ doctors: list, updatedAt: Date.now() }), "utf8");
  } catch {
    // ignore — memory still holds data for this process
  }
}

export function getSeedDoctors(): Doctor[] {
  return structuredClone(seedDoctors);
}

export function getStoredDoctors(): Doctor[] {
  if (globalThis.__gp25BoardDoctors?.length) {
    return structuredClone(globalThis.__gp25BoardDoctors);
  }
  const fromDisk = readFromDisk();
  if (fromDisk?.length) {
    globalThis.__gp25BoardDoctors = structuredClone(fromDisk);
    return structuredClone(fromDisk);
  }
  return getSeedDoctors();
}

export function setStoredDoctors(list: Doctor[]): void {
  globalThis.__gp25BoardDoctors = structuredClone(list);
  writeToDisk(list);
}

export function resetStoredDoctors(): Doctor[] {
  const seed = getSeedDoctors();
  globalThis.__gp25BoardDoctors = structuredClone(seed);
  writeToDisk(seed);
  return seed;
}
