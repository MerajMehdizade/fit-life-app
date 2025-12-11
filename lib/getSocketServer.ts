import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export default function getSocketServer() {
  if (!io) {
    throw new Error("❌ Socket.io server is not initialized yet!");
  }
  return io;
}

export function setSocketServer(server: IOServer) {
  io = server;
}
