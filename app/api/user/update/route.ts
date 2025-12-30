import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    userId = (decoded as any).userId;
  } catch {
    return NextResponse.json({ message: "توکن نامعتبر است" }, { status: 401 });
  }

  const body = await req.json();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

  // Merge کامل با مقادیر قبلی
  user.profile = { ...user.profile, ...body };

  // تبدیل numeric ها به Number
  const numericFields = [
    "age", "height", "weight",
    "currentWeight", "bodyFatPercentage",
    "waistCircumference", "chestCircumference", "armCircumference"
  ];
  numericFields.forEach(f => {
    if (user.profile[f] !== undefined && user.profile[f] !== null) {
      user.profile[f] = Number(user.profile[f]);
    }
  });

  // چک کامل بودن همه فیلدهای ضروری
  const requiredFields = [
    "age", "gender", "height", "weight",
    "primaryGoal", "currentWeight", "bodyFatPercentage",
    "waistCircumference", "chestCircumference", "armCircumference",
    "trainingLevel", "bodyGoalType", "workOutDays",
    "calorieTarget", "foodAllergies", "dietaryRstrictions", "dietPlanType"
  ];

  const isComplete = requiredFields.every(f => {
    const val = user.profile?.[f];
    if (val === undefined || val === null) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    return true;
  });

  user.profileCompleted = isComplete;

  await user.save();

  return NextResponse.json({
    message: "اطلاعات شما با موفقیت ذخیره شد",
    profile: user.profile,
    profileCompleted: user.profileCompleted
  });
}
