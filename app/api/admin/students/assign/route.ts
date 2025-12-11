import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { adminGuard } from "@/lib/authGuard";
import { logAdminAction } from "@/lib/log";

export async function POST(req: Request) {
  await dbConnect();

  const admin = await adminGuard(); // ⬅️ باید admin را برگرداند
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { studentId, coachId } = await req.json();

  if (!studentId || !coachId) {
    return NextResponse.json(
      { message: "Missing studentId or coachId" },
      { status: 400 }
    );
  }

  const student = await User.findById(studentId);
  const coach = await User.findById(coachId);

  if (!student || !coach) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (coach.role !== "coach") {
    return NextResponse.json({ message: "This user is not a coach" }, { status: 400 });
  }

  student.assignedCoach = coachId;
  await student.save();

  if (!Array.isArray(coach.students)) {
    coach.students = [];
  }

  if (!coach.students.includes(studentId)) {
    coach.students.push(studentId);
  }

  await coach.save();

  // 📌 ثبت لاگ
  await logAdminAction({
    adminId: admin._id,
    targetUserId: student._id,
    action: "ASSIGN_STUDENT_TO_COACH",
    description: `Student assigned to coach ${coach.name}`,
  });


  return NextResponse.json({
    message: "Student successfully assigned to coach",
  });
}
