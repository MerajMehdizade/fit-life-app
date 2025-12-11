"use client";

import SocketClient from "@/app/Components/SocketClient/SocketClient";

export default function SocketWrapper({ userId }: { userId: string }) {
  return <SocketClient userId={userId} />;
}
