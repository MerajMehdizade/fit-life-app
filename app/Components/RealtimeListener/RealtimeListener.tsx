"use client";

import { useEffect } from "react";
import { pusherClient } from "@/app/pusherClient";

export default function RealtimeListener({
  userId,
  onNewNotification,
  onReadNotification,
}: {
  userId: string;
  onNewNotification?: (n: any) => void;
  onReadNotification?: (id: string) => void;
}) {
  useEffect(() => {
    if (!userId) return;

    const channelName = `user-${userId}`;

    const channel =
      pusherClient.channel(channelName) ??
      pusherClient.subscribe(channelName);

    const handleNew = (data: any) => {
      onNewNotification?.(data);
    };

    const handleRead = (data: any) => {
      onReadNotification?.(data.id);
    };

    channel.bind("new-notification", handleNew);
    channel.bind("notification-read", handleRead);

    return () => {
      channel.unbind("new-notification", handleNew);
      channel.unbind("notification-read", handleRead);
      // ❌ unsubscribe نکن
    };
  }, [userId]);

  return null;
}
