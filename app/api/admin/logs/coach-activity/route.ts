import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LoginLog from "@/models/LoginLog";
import AuditLog from "@/models/AuditLog";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط مربیان
    const coaches = await User.find({ role: "coach" })
      .select("name email role students lastLogin");

    // ساخت نتایج
    const results = [];

    for (const coach of coaches) {
      const coachId = coach._id;

      // تعداد شاگردان
      const studentCount = coach.students?.length || 0;

      // تعداد لاگ‌های ورود
      const loginCount = await LoginLog.countDocuments({ userId: coachId });

      // تعداد عملیات ثبت‌شده در AuditLog
      const actionCount = await AuditLog.countDocuments({ adminId: coachId });

      results.push({
        coachId,
        name: coach.name,
        email: coach.email,
        studentCount,
        loginCount,
        actionCount,
        lastLogin: coach.lastLogin || null,
      });
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("COACH ACTIVITY API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
