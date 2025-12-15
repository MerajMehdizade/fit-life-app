export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import User from "@/models/User";
import notify from "@/lib/notify";

export async function POST(req: Request) {
  await dbConnect();

  const admin = await verifyAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, title, message } = await req.json();

  const targetUser = await User.findById(userId);
  if (!targetUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await notify({
    userId,
    title,
    message,
    meta: {
      actorId: admin._id.toString(),
      actorName: admin.name,
      action: "ADMIN_MESSAGE",
      targetId: userId,
    },
  });

  return NextResponse.json({ success: true });
}
