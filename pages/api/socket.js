import { Server } from "socket.io";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Ketika user mengirim pesan
      socket.on("sendMessage", (message) => {
        console.log("Message received:", message);

        // Simpan pesan ke database (JSON)
        saveChat(message);

        // Kirim pesan ke semua user
        io.emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

// Fungsi menyimpan chat ke JSON
function saveChat(message) {
  const filePath = path.join(process.cwd(), "database", "chats.json");

  let chatData = [];
  if (fs.existsSync(filePath)) {
    chatData = JSON.parse(fs.readFileSync(filePath));
  }

  chatData.push({ sender: message.sender, message: message.message, timestamp: new Date() });
  fs.writeFileSync(filePath, JSON.stringify(chatData, null, 2));
}
