import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/log";
import { getCurrentUser } from "@/lib/getUser";
import notify from "@/lib/notify";

export async function PATCH(req: Request, context: any) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getCurrentUser();
    if (!user?.userId)
      return NextResponse.json({ error: "No user" }, { status: 401 });
    const coach = await User.findById(id);

    if (!coach)
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    const newStatus = coach.status === "active" ? "suspended" : "active";


    coach.status = newStatus;
    await coach.save();

    await logAdminAction({
      adminId: admin._id,
      targetUserId: id,
      action: "UPDATE_STATUS",
      description: `Status changed to ${newStatus}`,
    });

  await notify({
  userId: user.userId, // 👈 ادمینی که الان لاگین کرده
  title: "تغییر وضعیت مربی",
  message: `وضعیت مربی ${coach.name} به ${newStatus} تغییر کرد`,
  meta: {
    actorId: admin._id.toString(),
    actorName: admin.name,
    action: "UPDATE_COACH_STATUS",
    targetId: coach._id.toString(),
  },
});



    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
