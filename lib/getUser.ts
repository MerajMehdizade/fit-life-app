import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await dbConnect();
    const user = await User.findById(decoded.userId).select(
      "role profileCompleted status"
    );

    if (!user || user.status !== "active") return null;

    return {
      userId: user._id.toString(),
      role: user.role,
      profileCompleted: user.profileCompleted,
    };
  } catch {
    return null;
  }
}
