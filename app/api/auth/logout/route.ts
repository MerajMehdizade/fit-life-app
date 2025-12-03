import { NextResponse } from "next/server";
import { removeTokenCookie, removeTokenCookieHeader } from "@/lib/cookies";

export async function POST() {

  const res = NextResponse.json({ message: "Logged out" });
  removeTokenCookie(res);
  const headerCookie = removeTokenCookieHeader();
  if (headerCookie) {
    res.headers.set("Set-Cookie", headerCookie);
  }
  return res;
}
