import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getCuratorToken } from "./store";

const COOKIE = "hambalyo_curator";

export function expectedPassphrase() {
  return process.env.CURATOR_PASSPHRASE || "hambalyo";
}

export function passphraseMatches(input: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expectedPassphrase()).digest();
  return timingSafeEqual(left, right);
}

export async function curatorAuthed() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return Boolean(token && token === getCuratorToken());
}

export async function setCuratorCookie() {
  const jar = await cookies();
  jar.set(COOKIE, getCuratorToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearCuratorCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export { COOKIE };
