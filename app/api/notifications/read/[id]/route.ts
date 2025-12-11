import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ← مشکل همین بود

    await dbConnect();

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // realtime update
    await pusherServer.trigger(
      `user-${updated.userId}`,
      "notification-read",
      { id: updated._id }
    );

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
