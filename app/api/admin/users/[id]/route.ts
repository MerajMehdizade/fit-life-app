import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;   // این دقیقاً همون چیزیه که Next می‌خواد

  await dbConnect();

  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("token=")?.[1]?.split(";")?.[0];

  if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  await User.findByIdAndDelete(id);

  return NextResponse.json({ msg: "Deleted" });
}
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  await dbConnect();

  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("token=")?.[1]?.split(";")?.[0];

  if (!token) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin")
    return NextResponse.json({ msg: "Forbidden" }, { status: 403 });

  const data = await req.json();

  const user = await User.findByIdAndUpdate(id, data, { new: true });

  return NextResponse.json(user);
}
