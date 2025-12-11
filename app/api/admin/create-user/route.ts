import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, verifyToken } from "@/lib/auth";
import { logAdminAction } from "@/lib/log";

export async function POST(req: Request) {
  try {
    await dbConnect();

    let token = "";
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    } catch {}

    if (!token) {
      const cookie = req.headers.get("cookie") || "";
      token = cookie.split("token=")?.[1]?.split(";")?.[0] || "";
    }

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id || decoded?.userId;

    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const adminUser = await User.findById(userId);
    if (!adminUser || adminUser.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { name, email, password, role = "coach" } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json({ message: "Email exists" }, { status: 400 });

    const hashed = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    await logAdminAction({
      adminId: adminUser._id,
      targetUserId: newUser._id,
      action: "CREATE_USER",
      description: `ساخت کاربر جدید با نقش ${role}`,
    });


    return NextResponse.json({
      message: "User created",
      user: {
        id: newUser._id,
        name,
        email,
        role,
      },
    });

  } catch (err) {
    console.error("create-user error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
