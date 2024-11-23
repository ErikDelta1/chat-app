import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/chat.css";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp?: any; // Optional timestamp for ordering
}

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const chatRef = collection(db, "chats", userId || "", "messages");
    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.sender || "Unknown",
          text: data.text || "",
          timestamp: data.timestamp || null,
        };
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [userId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const chatRef = collection(db, "chats", userId || "", "messages");
    await addDoc(chatRef, {
      sender: "CurrentUser", // Replace with actual user name
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;