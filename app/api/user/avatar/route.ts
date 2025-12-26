import sharp from "sharp";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("avatar") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const final = await sharp(buffer)
    .rotate()
    .resize(256, 256)
    .webp({ quality: 85 })
    .toBuffer();

  await connectDB();

  // 🔹 حذف آواتار قدیمی اگر موجود باشد
  if (user.avatar) {
    const key = user.avatar.split("/").slice(-1)[0];
    try {
      await fetch(`https://api.vercel.com/v1/blob/${key}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      });
    } catch (err) {
      console.warn("Failed to delete old avatar:", err);
    }
  }

  // 🔹 نام یکتا برای آواتار جدید
  const filename = `avatars/${user._id}-${Date.now()}.webp`;

  const blob = await put(filename, final, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  if (!blob?.url) return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });

  await User.findByIdAndUpdate(user._id, { $set: { avatar: blob.url } });

  return NextResponse.json({ success: true, avatar: blob.url });
}
