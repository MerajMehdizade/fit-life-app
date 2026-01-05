"use client";

import { useEffect, useRef } from "react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ⬅️ بیرون از useEffect
  const handleNewNotification = (data: any) => {
    audioRef.current?.play().catch(() => { });
    onNewNotification?.(data);
  };
useEffect(() => {
  if (!userId) return;

  const channelName = `user-${userId}`;
  const channel = pusherClient.subscribe(channelName);

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
    pusherClient.unsubscribe(channelName);
  };
}, [userId]);
  return null;
}
