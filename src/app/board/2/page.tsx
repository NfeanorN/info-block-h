"use client";

import { ScheduleBoard } from "@/components/ScheduleBoard";

export default function BoardTwoPage() {
  return (
    <ScheduleBoard
      sections={[
        {
          departmentId: "2",
          title: "Женская консультация",
          days: ["mon", "tue", "wed", "thu", "fri"],
          showRoom: true,
        },
        {
          departmentId: "4",
          title: "Отделение участковой службы",
          days: ["mon", "tue", "wed", "thu", "fri"],
          showRoom: true,
        },
      ]}
    />
  );
}
