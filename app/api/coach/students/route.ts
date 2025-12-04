import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { coachGuard } from "@/lib/authGuard";

export async function GET() {
  await dbConnect();
  
  const coach = await coachGuard(); 

  const students = await User.find({ assignedCoach: coach._id });

  return NextResponse.json(students);
}
