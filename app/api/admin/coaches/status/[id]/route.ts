import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = context.params; // ✔ روش صحیح گرفتن پارامتر
    const { status } = await req.json();

    if (!["active", "suspended", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await User.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating coach status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
