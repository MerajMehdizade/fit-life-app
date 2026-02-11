import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const token = (await cookies()).get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "توکن وجود ندارد" }, { status: 401 });
  try {
    const decoded: any = verifyToken(token);
    const userId = decoded?.userId ?? decoded?.id ?? decoded?._id;
    if (!userId) {
      return NextResponse.json({ message: "توکن معتبر ولی شناسهٔ کاربر یافت نشد" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    
    if (!user)
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      profile: user.profile,
    });
  } catch (err) {
    return NextResponse.json({ message: "توکن نامعتبر است" }, { status: 401 });
  }
}