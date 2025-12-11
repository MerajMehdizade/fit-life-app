import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";
import { logAdminAction } from "@/lib/log";

export async function POST(req: Request, context: any) {
  await dbConnect();

  const admin = await adminGuard(); // ⬅️ باید admin را برگرداند
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = context.params;
  const { permissions } = await req.json();

  if (!Array.isArray(permissions)) {
    return NextResponse.json(
      { error: "Invalid permissions format" },
      { status: 400 }
    );
  }

  const coach = await User.findById(id);

  if (!coach || coach.role !== "coach") {
    return NextResponse.json({ error: "Coach not found" }, { status: 404 });
  }

  coach.permissions = permissions;
  await coach.save();

  // 📌 ثبت لاگ
  await logAdminAction({
    adminId: admin._id,
    targetUserId: coach._id,
    action: "UPDATE_COACH_PERMISSIONS",
    description: `Permissions updated: ${permissions.join(", ")}`,
  });


  return NextResponse.json({ message: "Permissions updated" });
}
