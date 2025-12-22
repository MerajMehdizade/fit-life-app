// /api/notifications/read-all.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export async function PATCH() {
  try {
    await dbConnect();

    const res = await Notification.updateMany(
      { isRead: false }, // فقط نوتیفیکیشن‌های خوانده نشده
      { isRead: true }
    );

    return NextResponse.json({ success: true, modifiedCount: res.modifiedCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
