"use client";

import { ScheduleBoard } from "@/components/ScheduleBoard";

export default function BoardTwoPage() {
  return (
    <ScheduleBoard
      sections={[
        {
          departmentId: "2",
          title: "Женская консультация",
          days: ["mon", "tue", "wed"],
          showRoom: false,
        },
        {
          departmentId: "4",
          title: "Отделение участковой службы",
          days: ["mon", "tue", "wed"],
          showRoom: false,
        },
      ]}
    />
  );
}
