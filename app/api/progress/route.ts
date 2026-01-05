import dbConnect from "@/lib/db";
import User from "@/models/User";
import { calculateProgress } from "@/lib/progress";
import notify from "@/lib/notify";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const testWeekParam = searchParams.get("testWeek");
  const enableTest = searchParams.get("test") === "1";


  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = verifyToken(token);
  const user = await User.findById(userId);

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const progress = calculateProgress(user.startDate);

  // ✅ تست فقط در dev
  const effectiveWeek =
    enableTest && testWeekParam
      ? Number(testWeekParam)
      : progress.currentWeek;


  // ✅ ارسال نوتیف فقط یک بار
  if (effectiveWeek >= 10) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, progressFinished: false },
      { $set: { progressFinished: true } },
      { new: true }
    );

    if (updatedUser) {
      await notify({
        userId: user._id.toString(),
        title: "🎉 پایان دوره ۱۰ هفته‌ای",
        message: "تبریک! دوره تمرینی شما با موفقیت به پایان رسید 💪🔥",
        meta: { action: "PROGRESS_FINISHED" },
      });
    }
  }

  return Response.json({
    currentWeek: effectiveWeek,
    percent: Math.min((effectiveWeek / 10) * 100, 100),
  });
}
