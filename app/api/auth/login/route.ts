import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: "ایمیل یا رمز عبور نادرست است." }, { status: 400 });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return NextResponse.json({ message: "ایمیل یا رمز عبور نادرست است." }, { status: 400 });

  const token = signToken(user._id);
  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email },
    message: "ورود موفقیت‌آمیز بود",
  });

  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
