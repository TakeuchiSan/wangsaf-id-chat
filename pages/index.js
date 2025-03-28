import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { username, text: message }]);
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>WANGSAF ID Chat</h2>
      <input
        type="text"
        placeholder="Masukkan username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <div style={{ border: "1px solid #ddd", padding: "10px", height: "300px", overflowY: "auto", background: "#f9f9f9" }}>
        {chat.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", padding: "8px", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ width: "18%", padding: "8px", marginLeft: "2%", background: "#25D366", color: "#fff", border: "none", cursor: "pointer" }}>
        Kirim
      </button>
    </div>
  );
}
