const COOKIE = "gp25_admin";

function secret() {
  return process.env.ADMIN_SECRET || "gp25-infomat-secret-change-me";
}

export function adminCredentials() {
  return {
    user: process.env.ADMIN_USER || "admin",
    password: process.env.ADMIN_PASSWORD || "gp25board",
  };
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toHex(sig);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12h
  const payload = `${username}.${exp}`;
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!username || !Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${username}.${exp}`;
  const expected = await hmacHex(payload);
  return timingSafeEqualHex(sig, expected);
}

export function checkPassword(user: string, password: string): boolean {
  const creds = adminCredentials();
  return user === creds.user && password === creds.password;
}

export { COOKIE as ADMIN_COOKIE };
