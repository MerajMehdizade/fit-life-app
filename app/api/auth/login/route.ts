import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";
import { logLogin } from "@/lib/log";

export async function POST(req: Request) {

  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ message: "ایمیل یا رمز عبور نادرست است." }, { status: 400 });

  const isMatch = await comparePassword(password, user.password);
  await logLogin({
    user,
    ip: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "",
  });
  if (!isMatch)
    return NextResponse.json({ message: "ایمیل یا رمز عبور نادرست است." }, { status: 400 });

  const token = signToken(user);

  const res = NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "ورود موفقیت‌آمیز بود",
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });


  return res;
}
