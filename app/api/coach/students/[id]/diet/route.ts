import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { coachGuard } from "@/lib/authGuard";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const coach = await coachGuard();

  const { id } = await context.params;

  const body = await req.json();
  const { diet } = body;

  const student = await User.findOne({
    _id: id,
    assignedCoach: coach._id,
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 403 });
  }

  student.dietPlan = diet;
  await student.save();


  return NextResponse.json({ message: "Diet plan updated" });
}
