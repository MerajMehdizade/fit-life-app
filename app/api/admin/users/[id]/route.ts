import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { logAdminAction } from "@/lib/log";

//==========================
//  دریافت Token مطمئن
//==========================
async function getToken(req: Request) {
  // try cookie header
  const raw = req.headers.get("cookie") || "";
  let token = raw.split("token=")?.[1]?.split(";")?.[0] || "";

  // try bearer
  if (!token) {
    const auth = req.headers.get("authorization") || "";
    if (auth.toLowerCase().startsWith("bearer "))
      token = auth.split(" ")[1].trim();
  }

  return token;
}

//==========================
//  DELETE - حذف کاربر
//==========================
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await dbConnect();

  const { id } = await ctx.params;
  const token = await getToken(req);

  if (!token)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  // decode
  const payload = verifyToken(token);
  const adminId = payload?.userId || payload?.id || payload?._id;

  if (!adminId || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  // delete
  const deletedUser = await User.findByIdAndDelete(id);

  if (deletedUser) {
    // ثبت لاگ
    await logAdminAction({
      adminId,
      targetUserId: id,
      action: "DELETE_USER",
      description: `حذف کاربر ${deletedUser.name} (${deletedUser.email})`,
    });

  }

  return NextResponse.json({ msg: "Deleted" });
}


//==========================
//  PUT - ویرایش کاربر
//==========================
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await dbConnect();

  const { id } = await ctx.params;
  const token = await getToken(req);

  if (!token)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  // decode
  const payload = verifyToken(token);
  const adminId = payload?.userId || payload?.id || payload?._id;

  if (!adminId || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  const data = await req.json();

  // قبل از ویرایش، اطلاعات قدیمی بگیر
  const oldUser = await User.findById(id);
  if (!oldUser)
    return NextResponse.json({ msg: "User not found" }, { status: 404 });

  // آپدیت
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

  if (updatedUser) {
    // ثبت لاگ
    await logAdminAction({
      adminId,
      targetUserId: id,
      action: "UPDATE_USER",
      description: `ویرایش اطلاعات کاربر: 
        نام: ${oldUser.name} → ${updatedUser.name}
        ایمیل: ${oldUser.email} → ${updatedUser.email}`,
    });

  }

  return NextResponse.json(updatedUser);
}
