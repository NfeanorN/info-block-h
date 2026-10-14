import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";
import {
  getStoredDoctors,
  resetStoredDoctors,
  setStoredDoctors,
} from "@/lib/data/boardStore";
import type { Doctor } from "@/lib/types";

export async function GET() {
  return NextResponse.json({
    doctors: getStoredDoctors(),
    updatedAt: Date.now(),
  });
}

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    doctors?: Doctor[];
    reset?: boolean;
  } | null;

  if (body?.reset) {
    const doctors = resetStoredDoctors();
    return NextResponse.json({ ok: true, doctors });
  }

  if (!Array.isArray(body?.doctors)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  setStoredDoctors(body.doctors);
  return NextResponse.json({ ok: true, doctors: getStoredDoctors() });
}
