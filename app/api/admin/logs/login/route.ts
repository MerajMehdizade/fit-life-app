import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LoginLog from "@/models/LoginLog";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role");
    const userId = searchParams.get("userId");
    const ip = searchParams.get("ip");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};

    if (role) query.role = role;
    if (userId) query.userId = userId;
    if (ip) query.ip = ip;

    // تاریخ‌ها
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

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
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("LOGIN LOG API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
