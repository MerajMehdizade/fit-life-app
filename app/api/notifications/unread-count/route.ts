import Notification from "@/models/Notification";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.userId) return Response.json({ count: 0 });

  const count = await Notification.countDocuments({
    userId: user.userId,
    isRead: false,
  });

  return Response.json({ count });
}
