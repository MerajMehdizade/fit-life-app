import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { studentGuard } from "@/lib/authGuard";

export async function GET() {
  await dbConnect();

  const student = await studentGuard(); // دانشجو فعلی

  // Populate برنامه تمرینی و رژیم
  const user = await User.findById(student._id).select("trainingPlan dietPlan");

  return NextResponse.json({
    trainingPlan: user.trainingPlan || null,
    dietPlan: user.dietPlan || null,
  });
}
