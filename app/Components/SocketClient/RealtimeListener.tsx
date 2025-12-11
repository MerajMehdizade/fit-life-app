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

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-notification", (data: any) => {
      onNewNotification?.(data);
    });

    channel.bind("notification-read", (data: any) => {
      onReadNotification?.(data.id);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  return null;
}
