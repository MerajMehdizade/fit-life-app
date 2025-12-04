import dbConnect from "@/lib/db";
import User from "@/models/User";
import { coachGuard } from "@/lib/authGuard";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  await dbConnect();
  
  const coach = await coachGuard();
  
  const { id } = await context.params; // ⭐⭐ مهم ⭐⭐

  const student = await User.findOne({
    _id: id,
    assignedCoach: coach._id,
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 403 });
  }

  return NextResponse.json(student);
}
