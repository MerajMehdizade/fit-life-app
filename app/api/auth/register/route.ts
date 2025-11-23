import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json({ message: "این ایمیل قبلاً ثبت شده است" }, { status: 400 });

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = signToken(user._id);

  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email },
    message: "ثبت نام با موفقیت انجام شد",
  });

  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });

  return res;
}
