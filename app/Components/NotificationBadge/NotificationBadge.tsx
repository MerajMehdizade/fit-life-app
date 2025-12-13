"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/pusherClient";
import { useUser } from "@/app/context/UserContext";

export default function NotificationBadge() {
  const { user, loading } = useUser();
  const [count, setCount] = useState(0);
  const fetchingRef = useRef(false);


  const fetchUnread = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const res = await fetch("/api/notifications/unread-count", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setCount(data.count || 0);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (loading || !user?.id) return;
    // initial sync
    fetchUnread();

    const channelName = `user-${user.id}`;
    const channel = pusherClient.subscribe(channelName);

    const sync = () => fetchUnread();

    channel.bind("new-notification", sync);
    channel.bind("notification-read", sync);

    // 👇 مهم: reconnect / resubscribe
    pusherClient.connection.bind("connected", sync);

    return () => {
      channel.unbind("new-notification", sync);
      channel.unbind("notification-read", sync);
      pusherClient.connection.unbind("connected", sync);
      pusherClient.unsubscribe(channelName);
    };
  }, [loading, user?.id]);

  if (!user || count === 0) {
    return (
      <div className="relative flex">
        <span className="cursor-pointer">🔔</span>
      </div>
    );
  }


  return (
    <div className="relative flex">
      <span className="cursor-pointer">🔔</span>
      <span className="bg-red-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
        {count}
      </span>
    </div>
  );
}
