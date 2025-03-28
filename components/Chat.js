import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/Chat.module.css";

const socket = io("http://localhost:3001");

export default function Chat() {
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
    setChatInput("");
  };

  return (
    <div className={styles.chatContainer}>
      {!isLoggedIn ? (
        <div className={styles.loginContainer}>
          <h1 className={styles.chatTitle}>Masukkan Username</h1>
          <input
            type="text"
            className={styles.usernameInput}
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className={styles.sendButton} onClick={() => setIsLoggedIn(true)}>
            Masuk
          </button>
        </div>
      ) : (
        <div className={styles.chatBox}>
          <h1 className={styles.chatTitle}>WANGSAF ID Chat</h1>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.sender === username ? styles.sent : styles.received}`}
              >
                <div className={styles.messageBubble}>
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Ketik pesan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className={styles.sendButton} onClick={sendMessage}>Kirim</button>
          </div>
        </div>
      )}
    </div>
  );
}
