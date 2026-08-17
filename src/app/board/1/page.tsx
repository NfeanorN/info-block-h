"use client";

import { ScheduleBoard } from "@/components/ScheduleBoard";

export default function BoardOnePage() {
  return (
    <ScheduleBoard
      sections={[
        {
          departmentId: "2",
          title: "Женская консультация",
          days: ["mon", "tue"],
          showRoom: true,
        },
        {
          departmentId: "3",
          title: "Отделение специализированной помощи",
          days: ["mon", "tue", "wed", "thu", "fri"],
          showRoom: true,
        },
      ]}
    />
  );
}
