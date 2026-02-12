import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
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

  const user = await User.findById(userId).lean() as any;

  if (!user)
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || "",
      profile: user.profile ?? {},
      uiPreferences: user.uiPreferences ?? {},
    },
  });
}
