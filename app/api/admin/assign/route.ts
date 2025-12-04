import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";

export async function POST(req: Request) {
   console.log("API called!");  // اضافه کردن این خط
  await dbConnect();
  await adminGuard();

  const { studentId, coachId } = await req.json();

  if (!studentId || !coachId) {
    return NextResponse.json({ message: "Missing studentId or coachId" }, { status: 400 });
  }

  const student = await User.findById(studentId);
  const coach = await User.findById(coachId);

  if (!student || !coach) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (coach.role !== "coach") {
    return NextResponse.json({ message: "This user is not a coach" }, { status: 400 });
  }

  // 1. دانشجو را به مربی اختصاص بده
  student.assignedCoach = coachId;
  await student.save();
  // 2. بررسی و ایجاد students در coach
  if (!Array.isArray(coach.students)) {
    coach.students = []; // اگر students خالی باشد، یک آرایه جدید بساز
  }

  // 3. اضافه کردن دانشجو به لیست مربی
  if (!coach.students.includes(studentId)) {
    coach.students.push(studentId);
  }

  await coach.save();

  return NextResponse.json({
    message: "Student successfully assigned to coach",
  });
}
