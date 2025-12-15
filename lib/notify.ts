import Notification from "@/models/Notification";
import { pusherServer } from "./pusher";

type NotifyInput = {
  userId: string;
  title: string;
  message: string;
  meta?: {
    actorId?: string;
    actorName?: string;
    action?: string;
    targetId?: string;
  };
};

export default async function notify({
  userId,
  title,
  message,
  meta,
}: NotifyInput) {
  const doc = await Notification.create({
    userId,
    title,
    message,
    meta,
  });

  // realtime
  await pusherServer.trigger(`user-${userId}`, "new-notification", {
    _id: doc._id,
    title: doc.title,
    message: doc.message,
    isRead: doc.isRead,
    createdAt: doc.createdAt,
    meta: doc.meta,
  });

  return doc;
}
