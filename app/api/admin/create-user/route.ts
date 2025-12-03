import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();


  try {
    // دریافت کوکی امن از helper next/headers
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return NextResponse.json({ message: "Unauthorized: token missing" }, { status: 401 });
    }


    // اعتبارسنجی توکن
    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized: invalid token" }, { status: 401 });
    }


    // گرفتن آی‌دی از payload (پشتیبانی از _id یا id)
    const userId = decoded?.id ?? decoded?._id ?? decoded?.userId ?? null;
    if (!userId) return NextResponse.json({ message: "Unauthorized: invalid payload" }, { status: 401 });


    // بررسی نقش کاربر فعلی
    const currentUser = await User.findById(userId);
    if (!currentUser) return NextResponse.json({ message: "Unauthorized: user not found" }, { status: 401 });
    if (currentUser.role !== "admin")
      return NextResponse.json({ message: "Forbidden: admin only" }, { status: 403 });
    const body = await req.json();
    const { name, email, password, role = "coach" } = body;


    if (!name || !email || !password) {
      return NextResponse.json({ message: "name, email and password are required" }, { status: 400 });
    }


    // جلوگیری از ساخت کاربر تکراری
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ message: "Email already exists" }, { status: 400 });


    // معتبرسازی نقش (فقط نقش‌های مشخص)
    const allowedRoles = new Set(["student", "coach", "admin"]);
    const normalizedRole = allowedRoles.has(role) ? role : "coach";


    const hashed = await hashPassword(password);


    const user = await User.create({
      name,
      email,
      password: hashed,
      role: normalizedRole,
    }); return NextResponse.json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error("/api/admin/create-us er error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}