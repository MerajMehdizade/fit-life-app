import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/log";

export async function PATCH(req: Request, context: any) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coach = await User.findById(id);

    if (!coach)
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    const newStatus = coach.status === "active" ? "suspended" : "active";

    coach.status = newStatus;
    await coach.save();

    // 🟢 ثبت لاگ ادمین — نسخه کاملاً درست
    await logAdminAction({
      adminId: admin._id,
      targetUserId: id,
      action: "UPDATE_STATUS",
      description: `Status changed to ${newStatus}`,
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
