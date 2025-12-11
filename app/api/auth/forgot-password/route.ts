import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import User from "@/models/User";
import connectDB from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "کاربری با این ایمیل یافت نشد" }, { status: 404 });

    // ساخت توکن
    const resetToken = crypto.randomBytes(32).toString("hex");

    // هش ذخیره می‌کنیم نه خود توکن
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 دقیقه
    await user.save();

    const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // ارسال ایمیل
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "بازیابی رمز عبور",
      html: `
        <p>برای بازیابی رمز عبور روی لینک زیر کلیک کنید:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
        <br/><br/>
        <p>این لینک تا 15 دقیقه معتبر است.</p>
      `
    });

    return NextResponse.json({ message: "ایمیل ارسال شد" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "خطا در ارسال ایمیل" }, { status: 500 });
  }
}
