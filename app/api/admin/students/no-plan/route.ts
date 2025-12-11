import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/log";

export async function GET() {
  try {
    await dbConnect();
    const admin = await verifyAdmin();

    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const students = await User.find({
      role: "student",
      $or: [{ trainingPlan: null }, { dietPlan: null }],
    })
      .select("_id name email assignedCoach trainingPlan dietPlan")
      .populate("assignedCoach", "name email");

    const formatted = students.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      coach: s.assignedCoach
        ? {
            id: s.assignedCoach._id,
            name: s.assignedCoach.name,
            email: s.assignedCoach.email,
          }
        : null,
      hasTrainingPlan: !!s.trainingPlan,
      hasDietPlan: !!s.dietPlan,
      status:
        !s.trainingPlan && !s.dietPlan
          ? "بدون هر دو برنامه"
          : !s.trainingPlan
          ? "بدون برنامه تمرینی"
          : "بدون برنامه غذایی",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("ERR:", err);
    return NextResponse.json(
      { message: "خطا در دریافت دانشجویان بدون برنامه" },
      { status: 500 }
    );
  }
}
