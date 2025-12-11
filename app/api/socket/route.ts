import { NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { setSocketServer } from "@/lib/getSocketServer";

let io: IOServer | null = null;

export async function GET() {
  if (!io) {
    io = new IOServer(3001, {
      cors: {
        origin: "*",
      },
    });

    setSocketServer(io);

    io.on("connection", (socket) => {
      console.log("Socket connected →", socket.id);

      socket.on("join-room", (userId) => {
        socket.join("user:" + userId);
        console.log("Joined room user:", userId);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected →", socket.id);
      });
    });

    console.log("🔥 Socket.io server started on port 3001");
  }

  return NextResponse.json({ ok: true });
}
