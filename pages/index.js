import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/Chat.module.css"; // Import CSS untuk tampilan

const socket = io("http://localhost:3002"); // Ganti dengan URL backend

export default function Home() {
  const [username, setUsername] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    setMessages((prevMessages) => [...prevMessages, message]); // Tambahkan ke UI lokal
    setChatInput("");
  };

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <div className={styles.loginContainer}>
          <h1>Masuk ke WANGSAF ID Chat</h1>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={() => setIsLoggedIn(true)}
            className={styles.button}
          >
            Masuk
          </button>
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <h1 className={styles.header}>WANGSAF ID Chat</h1>
          <div className={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === username ? styles.myMessage : styles.otherMessage
                }
              >
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className={styles.input}
            />
            <button onClick={sendMessage} className={styles.button}>
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
