import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const admin = await verifyAdmin();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const students = await User.find({ role: "student" })
      .select("_id name email status assignedCoach trainingPlan dietPlan")
      .populate("assignedCoach", "name");

    const formatted = students.map((s: any) => ({
      _id: s._id.toString(),
      name: s.name,
      email: s.email,
      status: s.status,
      coachName: s.assignedCoach?.name || "بدون مربی",
      plansCount:
        (s.trainingPlan ? 1 : 0) +
        (s.dietPlan ? 1 : 0),
    }));

    return NextResponse.json({ students: formatted });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
