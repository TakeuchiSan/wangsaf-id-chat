import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Pastikan WebSocket berjalan

export default function Home() {
  const [username, setUsername] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (chatInput.trim() === "") return;

    const message = { sender: username, message: chatInput };
    socket.emit("sendMessage", message);
    setChatInput("");
  };

  return (
    <div>
      <h1>WANGSAF ID Chat</h1>
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
      <button onClick={sendMessage}>Kirim</button>
    </div>
  );
}
