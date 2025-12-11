// /lib/socket.ts
import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function setSocketInstance(instance: IOServer) {
  io = instance;
}

export function getSocketInstance() {
  return io;
}
