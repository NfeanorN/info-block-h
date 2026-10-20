"use client";

import { useEffect, useState } from "react";
import type { WeekDay } from "@/lib/types";

const CLINIC_TIME_ZONE = "Asia/Almaty";

const WEEKDAY_BY_SHORT: Record<string, WeekDay | null> = {
  Sun: null,
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

function clinicWeekDay(): WeekDay | null {
  const short = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: CLINIC_TIME_ZONE,
  }).format(new Date());
  return WEEKDAY_BY_SHORT[short] ?? null;
}

/**
 * Current clinic weekday, computed only in the browser (never baked into the
 * prerendered HTML) and re-checked every minute so it rolls over at midnight.
 */
export function useToday(): WeekDay | null {
  const [today, setToday] = useState<WeekDay | null>(null);

  useEffect(() => {
    const update = () => setToday(clinicWeekDay());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return today;
}
