import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { coachGuard } from "@/lib/authGuard";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  // گارد مربی
  const coach = await coachGuard();
  
  // دریافت داده‌ها از body
  const { weight, bodyFat } = await req.json();

  // پیدا کردن دانشجو بر اساس ID و مربی
  const student = await User.findOne({
    _id: params.id, // اینجا هیچ نیاز به await نیست
    assignedCoach: coach._id,
  });

  if (!student) {
    return NextResponse.json({ message: "Not Allowed" }, { status: 403 });
  }

  // ثبت پیشرفت جدید
  student.profile.progressHistory.push({
    date: new Date(),
    weight,
    bodyFat,
  });

  // ذخیره اطلاعات در دیتابیس
  await student.save();

  return NextResponse.json({ message: "Progress added" });
}
