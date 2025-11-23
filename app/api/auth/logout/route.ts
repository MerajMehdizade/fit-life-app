import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "خروج با موفقیت انجام شد" });
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res;
}
