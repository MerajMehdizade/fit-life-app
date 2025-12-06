import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    // فقط ادمین اجازه دسترسی دارد
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coaches = await User.find({ role: "coach" }).select(
      "_id name email status"
    );

    return NextResponse.json(coaches);
  } catch (err) {
    console.error("Error loading coaches:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
