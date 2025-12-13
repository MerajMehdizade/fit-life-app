// app/pusherClient.ts
import Pusher from "pusher-js";

export const pusherClient = new Pusher("45d1734128e38d1b354b", {
  cluster: "ap2",
   enabledTransports: ["ws", "wss", "xhr_streaming", "xhr_polling"],
});
