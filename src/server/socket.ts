const { Server: SocketIOServer } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const socketServer = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socketServer.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    // Broadcast the message to all connected clients
    socketServer.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
