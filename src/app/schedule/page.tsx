"use client";

import { KioskShell } from "@/components/KioskShell";
import { ScheduleTable } from "@/components/ScheduleTable";
import { useI18n } from "@/lib/i18n/context";

export default function SchedulePage() {
  const { t } = useI18n();

  return (
    <KioskShell title={t.scheduleHeading} subtitle={t.scheduleHint}>
      <ScheduleTable />
    </KioskShell>
  );
}
