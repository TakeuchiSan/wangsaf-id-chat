import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Saat user connect, ambil chat lama dari server
  useEffect(() => {
    fetch("/api/getChats")
      .then((res) => res.json())
      .then((data) => setMessages(data));

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

    // Kirim pesan ke WebSocket
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
