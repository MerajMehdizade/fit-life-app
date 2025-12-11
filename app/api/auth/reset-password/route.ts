import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() } // معتبر باشد
    });

    if (!user)
      return NextResponse.json({ message: "توکن نامعتبر یا منقضی شده" }, { status: 400 });

    // ذخیره رمز جدید
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "خطا در تغییر رمز عبور" }, { status: 500 });
  }
}
