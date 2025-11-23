import { NextResponse } from "next/server";
import { serialize } from "cookie";

export const setTokenCookie = (res: NextResponse, token: string) => {
  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 روز
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.headers.set("Set-Cookie", cookie);
};

export const removeTokenCookie = (res: NextResponse) => {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: -1,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.headers.set("Set-Cookie", cookie);
};
