import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json();

    if (!["active", "suspended", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await User.findByIdAndUpdate(params.id, { status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating coach status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
