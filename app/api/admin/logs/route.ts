/** app/api/admin/logs/route.ts */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import LoginLog from "@/models/LoginLog";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "login"; // audit | login | coachActivity
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    if (type === "audit") {
      const action = searchParams.get("action");
      const query: any = {};
      if (action) query.action = action;

      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("adminId", "name email role")
          .populate("targetUserId", "name email role"),
        AuditLog.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        data: logs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      });
    }

    if (type === "login") {
      const ip = searchParams.get("ip");
      const query: any = {};
      if (role) query.role = role;
      if (ip) query.ip = ip;

      const [logs, total] = await Promise.all([
        LoginLog.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("userId", "name email role"),
        LoginLog.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        data: logs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      });
    }

    if (type === "coachActivity") {
      const coaches = await User.find({ role: "coach" }).select("name email students lastLogin");
      const results = [];

      for (const coach of coaches) {
        const coachId = coach._id;
        const studentCount = coach.students?.length || 0;
        const loginCount = await LoginLog.countDocuments({ userId: coachId });
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

      return NextResponse.json({ success: true, data: results });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("LOG API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
