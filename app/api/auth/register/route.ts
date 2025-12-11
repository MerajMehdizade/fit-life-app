import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, password, role } = await req.json();

  // اگر نقش نیامده بود، پیش‌فرض student
  const allowedRoles = ["student", "coach"];
  const finalRole = allowedRoles.includes(role) ? role : "student";

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json(
      { message: "این ایمیل قبلاً ثبت شده است" },
      { status: 400 }
    );

  const hashedPassword = await hashPassword(password);

  // ذخیره نقش کاربر انتخاب‌شده
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: finalRole,
  });

  const token = signToken(user);

  const res = NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "ثبت نام با موفقیت انجام شد",
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
