import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/getUser";

export const runtime = "nodejs";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const isLocal = process.env.NODE_ENV === "development";
    if (isLocal) {
      const filename = user.avatar?.split("/").pop();
      if (filename) {
        const filePath = path.join(process.cwd(), "public/uploads", filename);
        try { await fs.unlink(filePath); } catch {}
      }
    } else {
      // حذف از Vercel Blob
      if (user.avatar) {
        const key = user.avatar.split("/").slice(-1)[0];
        try {
          await fetch(`https://api.vercel.com/v1/blob/${key}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
            }
          });
        } catch {}
      }
    }

    await User.findByIdAndUpdate(user._id, { avatar: "" });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
