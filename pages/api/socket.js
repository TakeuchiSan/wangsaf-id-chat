const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message); // Kirim pesan ke semua pengguna
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.listen(3001); // Jalankan WebSocket di port 3001
console.log("WebSocket berjalan di port 3001");
