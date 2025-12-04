// lib/authGuard.ts
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * خواندن توکن از cookie (همخوان با همه API ها)
 */
async function getToken() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value || null;
  } catch {
    return null;
  }
}

/**
 * گارد عمومی: هر کاربر لاگین کرده را چک می‌کند
 */
export async function authGuard() {
  await dbConnect();

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized: token missing" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch {
    return NextResponse.json({ message: "Unauthorized: invalid token" }, { status: 401 });
  }

  const userId = decoded?.id ?? decoded?._id ?? decoded?.userId ?? null;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized: invalid payload" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized: user not found" }, { status: 401 });
  }

  return user;
}

/**
 * گارد مخصوص Admin
 */
export async function adminGuard() {
  const user = await authGuard();

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: admin only" }, { status: 403 });
  }

  return user; // برای دسترسی به اطلاعات ادمین
}

/**
 * گارد مخصوص Coach
 */
export async function coachGuard() {
  const user = await authGuard();

  if (user.role !== "coach" && user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: coach or admin only" }, { status: 403 });
  }

  return user;
}

/**
 * گارد مخصوص Student
 */
export async function studentGuard() {
  const user = await authGuard();

  if (user.role !== "student" && user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: student or admin only" }, { status: 403 });
  }

  return user;
}
