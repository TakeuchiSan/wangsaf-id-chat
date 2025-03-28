import { useEffect, useState } from "react";
import io from "socket.io-client";

// Hubungkan ke server WebSocket (sesuaikan dengan backend)
const socket = io("http://localhost:3001", { transports: ["websocket"] });

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Cek koneksi ke WebSocket server
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Ambil chat lama dari backend API
    fetch("/api/getChats")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // Listen pesan masuk
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!chatInput.trim() || !username.trim()) return;

    const message = { sender: username, message: chatInput };
    socket.emit("sendMessage", message);
    setChatInput("");
  };

  return (
    <div>
      <h1>WANGSAF ID Chat</h1>
      <p>Status: {isConnected ? "🟢 Online" : "🔴 Offline"}</p>
      
      <input
        type="text"
        placeholder="Masukkan username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />
      
      <button onClick={sendMessage} disabled={!isConnected}>Kirim</button>
    </div>
  );
}
