export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import notify from "@/lib/notify";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { userId, title, message } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    await notify({
      userId,
      title,
      message,
      meta: {
        actorId: admin._id,
        actorName: admin.name,
        action: "ADMIN_SEND_MESSAGE",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
