"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/app/pusherClient";

export default function NotificationBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState(0);

  const fetchUnread = async () => {
    const res = await fetch("/api/notifications/unread-count");
    const data = await res.json();
    setCount(data.count || 0);
  };

  useEffect(() => {
    if (!userId) return;

    fetchUnread();

    const channel = pusherClient.subscribe(`user-${userId}`);

    // پیام جدید
    channel.bind("new-notification", () => {
      setCount((prev) => prev + 1);
    });

    // پیام خوانده شد
    channel.bind("notification-read", () => {
      setCount((prev) => Math.max(prev - 1, 0));
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  return (
    <div className="relative flex">
      <span className="cursor-pointer">🔔</span>
      {count > 0 && (
        <span className=" bg-red-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
