export const runtime = "nodejs";

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

    const student = await User.findById(id);
    if (!student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const newStatus =
      student.status === "active" ? "suspended" : "active";

    student.status = newStatus;
    await student.save();

    await logAdminAction({
      adminId: admin._id,
      targetUserId: student._id,
      action: "UPDATE_STUDENT_STATUS",
      description: `Status changed to ${newStatus}`,
    });

 await notify({
  userId: user.userId, // 👈 ادمینی که الان لاگین کرده
  title: "تغییر وضعیت دانشجو",
  message: `وضعیت دانشجو ${student.name} به ${newStatus} تغییر کرد`,
  meta: {
    actorId: admin._id.toString(),
    actorName: admin.name,
    action: "UPDATE_STUDENT_STATUS",
    targetId: student._id.toString(),
  },
});



    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("PATCH STUDENT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
