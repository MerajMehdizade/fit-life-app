import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { coachGuard } from "@/lib/authGuard";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const coach = await coachGuard();
  const { weight, bodyFat } = await req.json();

  const student = await User.findOne({
    _id: params.id,
    assignedCoach: coach._id,
  });

  if (!student) {
    return NextResponse.json({ message: "Not Allowed" }, { status: 403 });
  }

  student.profile.progressHistory.push({
    date: new Date(),
    weight,
    bodyFat,
  });

  await student.save();

  return NextResponse.json({ message: "Progress added" });
}
