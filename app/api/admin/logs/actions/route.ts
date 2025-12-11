import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const action = searchParams.get("action");
    const adminId = searchParams.get("adminId");
    const targetUserId = searchParams.get("targetUserId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};

    if (action) query.action = action;
    if (adminId) query.adminId = adminId;
    if (targetUserId) query.targetUserId = targetUserId;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

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
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("AUDIT LOG API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
