const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running\n");
});

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    console.log("📩 Received message:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Pastikan server mendengarkan semua IP
httpServer.listen(3001, "0.0.0.0", () => {
  console.log("✅ WebSocket server running on http://localhost:3001");
});
