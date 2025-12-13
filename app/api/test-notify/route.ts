import { getCurrentUser } from "@/lib/getUser";
import notify from "@/lib/notify";

export async function GET() {
  const user = await getCurrentUser();

  if (!user?.userId)
    return Response.json({ error: "no user" }, { status: 401 });
  
  await notify({
    userId: user.userId, // 👈 دقیقاً همونی که فرانت subscribe کرده
    title: "سلام!",
    message: "این یک تست realtime جدید هست 🎉",
  });
  
  return Response.json({ ok: true });
}
