// lib/pusher.ts
import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: "2089633",
  key: "45d1734128e38d1b354b",
  secret: "00c06037ab5076291a18",
  cluster: "ap2",
  useTLS: true,
});
