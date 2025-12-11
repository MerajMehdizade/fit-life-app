"use client";

import SocketClient from "@/app/Components/SocketClient/SocketClient";

export default function ClientSocketsWrapper({ userId }: { userId: string }) {
  if (!userId) return null;
  return <SocketClient userId={userId} />;
}
