import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
} from "@/lib/admin/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    user?: string;
    password?: string;
  } | null;

  const user = body?.user?.trim() ?? "";
  const password = body?.password ?? "";

  if (!checkPassword(user, password)) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const token = await createSessionToken(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
