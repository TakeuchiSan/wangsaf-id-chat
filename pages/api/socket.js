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

  socket.on("sendMessage", (data) => {
    chatHistory.push(data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Jalankan server WebSocket di port 3001
httpServer.listen(3001, () => {
  console.log("WebSocket server running on http://localhost:3001");
});
