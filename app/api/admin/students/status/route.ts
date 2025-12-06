import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  await dbConnect();

  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const students = await User.find({ role: "student" })
    .select("name email coach status plans")
    .populate("coach", "name")
    .populate("plans", "_id");

  const formatted = students.map((s: any) => ({
    _id: s._id,
    name: s.name,
    email: s.email,
    status: s.status,
    coachName: s.coach?.name || null,
    plansCount: s.plans?.length || 0,
  }));

  return NextResponse.json({ students: formatted });
}
