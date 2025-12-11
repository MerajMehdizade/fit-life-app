import Notification from "@/models/Notification";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ notifications });
}
