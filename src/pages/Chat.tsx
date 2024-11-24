import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
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
  timestamp?: any;
}

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const currentUser = auth.currentUser;

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join("_");
  };

  const chatId = getChatId(currentUser?.uid || "", userId || "");

  useEffect(() => {
    const chatRef = collection(db, "chats", chatId, "messages");
    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.sender || "Unknown",
          text: data.text || "",
          timestamp: data.timestamp ? data.timestamp.toDate() : null,
        };
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    if (!currentUser) {
      console.log("No user logged in");
      return;
    }

    const chatRef = collection(db, "chats", chatId, "messages");
    await addDoc(chatRef, {
      sender: currentUser.email,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container-wrapper">
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
    </div>
  );
};

export default Chat;