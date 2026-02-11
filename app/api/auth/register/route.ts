import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password, role } = body;

    /* ================= VALIDATION ================= */
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "همه فیلدهای ضروری را وارد کنید" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    /* ================= NORMALIZE ================= */
    const normalizedName = name.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    /* ================= ROLE ================= */
    const allowedRoles = ["student", "coach"];
    const finalRole = allowedRoles.includes(role) ? role : "student";

    /* ================= UNIQUENESS CHECK ================= */
    const existingUserByEmail = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    const existingUserByName = await User.findOne({
      name: normalizedName,
    });
    if (existingUserByName) {
      return NextResponse.json(
        { message: "این نام کاربری قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    /* ================= CREATE USER ================= */
    const hashedPassword = await hashPassword(password);

    let user;
    try {
      user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: finalRole,
      });
    } catch (error: any) {
      // unique index error (email یا name)
      if (error.code === 11000) {
        return NextResponse.json(
          { message: "نام کاربری یا ایمیل قبلاً استفاده شده است" },
          { status: 400 }
        );
      }
      throw error;
    }

    /* ================= TOKEN ================= */
    const token = signToken(user);

    const res = NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "ثبت نام با موفقیت انجام شد",
      },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
