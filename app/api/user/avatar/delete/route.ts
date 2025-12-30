// app/api/user/avatar/delete/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/getUser";

export const runtime = "nodejs";

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // یوزر واقعی از دیتابیس بگیریم
    const user = await User.findById(currentUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isLocal = process.env.NODE_ENV === "development";

    if (isLocal) {
      // حذف فایل از پوشه public/uploads در حالت توسعه
      const filename = user.avatar?.split("/").pop();
      if (filename) {
        const filePath = path.join(process.cwd(), "public/uploads", filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.warn("Failed to delete local file:", err);
        }
      }
    } else {
      // حذف از Vercel Blob
      if (user.avatar) {
        const key = user.avatar.split("/").slice(-1)[0];
        try {
          await fetch(`https://api.vercel.com/v1/blob/${key}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            },
          });
        } catch (err) {
          console.warn("Failed to delete Vercel blob:", err);
        }
      }
    }

    // مقدار avatar را در دیتابیس خالی کن
    user.avatar = "";
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
