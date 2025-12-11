const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join("user:" + userId);
    console.log("🏠 User joined room:", userId);
  });

  socket.on("send-notification", (data) => {
    io.to("user:" + data.userId).emit("notification", data);
    console.log("📤 Notification sent:", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

console.log("🔥 Socket.io server running on http://localhost:3001");
