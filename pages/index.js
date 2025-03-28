import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://your-socket-server.com"); // Ganti dengan server WebSocket-mu

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const chatData = { username, text: message };
      socket.emit("chatMessage", chatData);
      setMessages((prev) => [...prev, chatData]); // Tambahkan ke daftar chat
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>WANGSAF ID Chat</h1>
      <input
        type="text"
        placeholder="Masukkan username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.username === username ? "self" : "other"}`}
          >
            <strong>{msg.username}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Kirim</button>
      <style jsx>{`
        .chat-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 10px;
          text-align: center;
        }
        .chat-box {
          height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        .chat-bubble {
          max-width: 70%;
          padding: 10px;
          margin: 5px;
          border-radius: 10px;
        }
        .self {
          align-self: flex-end;
          background-color: #007bff;
          color: white;
        }
        .other {
          align-self: flex-start;
          background-color: #e0e0e0;
          color: black;
        }
      `}</style>
    </div>
  );
}
