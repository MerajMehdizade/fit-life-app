import Notification from "@/models/Notification";
import { pusherServer } from "./pusher";

export default async function notify({ userId, title, message }: any) {
  const doc = await Notification.create({
    userId,
    title,
    message,
  });

  // ارسال realtime
  await pusherServer.trigger(`user-${userId}`, "new-notification", {
    _id: doc._id,
    title: doc.title,
    message: doc.message,
    isRead: doc.isRead,
    createdAt: doc.createdAt,
  });

  return doc;
}
