const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let chatHistory = []; // Simpan pesan sementara

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("chatHistory", chatHistory);

  socket.on("sendMessage", (data) => {
    chatHistory.push(data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ WebSocket server running on http://localhost:${PORT}`);
});
