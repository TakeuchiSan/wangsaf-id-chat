const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001; // Gunakan port dari environment atau 3001
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let chatHistory = []; // Simpan riwayat chat sementara

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Kirim riwayat chat saat user bergabung
  socket.emit("chatHistory", chatHistory);

  // Tangani pesan yang dikirim user
  socket.on("sendMessage", (data) => {
    console.log(`Pesan dari ${data.sender}: ${data.message}`);
    chatHistory.push(data);
    io.emit("receiveMessage", data); // Kirim pesan ke semua client
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Jalankan server WebSocket
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("Server error:", err.message);
});
