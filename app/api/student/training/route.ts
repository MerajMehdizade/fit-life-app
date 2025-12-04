import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { studentGuard } from "@/lib/authGuard";

export async function GET() {
  await dbConnect();

  const student = await studentGuard();

  return NextResponse.json({
    plan: student.profile.trainingPlan || null,
  });
}
