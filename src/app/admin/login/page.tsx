import { Suspense } from "react";
import AdminLoginPage from "./LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0f172a]" />}>
      <AdminLoginPage />
    </Suspense>
  );
}
