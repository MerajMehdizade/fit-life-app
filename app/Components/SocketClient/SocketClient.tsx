"use client";

import { useEffect } from "react";
import { pusherClient } from "@/app/pusherClient";

export default function SocketClient({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;

    pusherClient.subscribe(`user-${userId}`);

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  return null;
}
