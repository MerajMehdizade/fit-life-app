import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    userId = (decoded as any).userId;
  } catch {
    return NextResponse.json({ message: "توکن نامعتبر است" }, { status: 401 });
  }

  const body = await req.json(); // همه فیلدها اینجا هستن

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

  // ---- این مهمه ----
  // فقط فیلدهایی که ارسال شده آپدیت میشن
  user.profile = {
    ...user.profile, // حفظ اطلاعات قبلی
    ...body          // آپدیت فقط فیلدهای ارسال شده
  };

  await user.save();

  return NextResponse.json({
    message: "اطلاعات شما با موفقیت ذخیره شد",
    profile: user.profile,
  });
}
