import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import type { ChatMessage } from "../types/chat";
import { sendUserMessage, subscribeToMessages } from "../lib/chatRepo";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ChatPage() {
  const chatId = useMemo(() => "demo-chat", []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const greetingSentRef = useRef(false);


  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    return () => unsub();
  }, [chatId]);

 useEffect(() => {
  if (greetingSentRef.current) return;

  if (messages.length > 0) {
    greetingSentRef.current = true;
    return;
  }

  greetingSentRef.current = true;

  const sendGreeting = async () => {
    await addDoc(
      collection(db, "chats", chatId, "messages"),
      {
        role: "assistant",
        text:
          "Hello! How can I assist you today?\n\n" +
          "• Check bill\n" +
          "(Check bill for January 2024)\n" +
          "• View bill details\n" +
          "(View bill details for March 2025)\n" + 
          "• Pay a bill\n" +
          "(Pay bill for October 2024)",
        createdAt: serverTimestamp(),
      }
    );
  };

  sendGreeting();
}, [chatId, messages.length]);





  async function handleSend(text: string) {
    try {
      setSending(true);
      await sendUserMessage(chatId, text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-container">
      <div className="chat-box">
        <div className="chat-header">
          <h2>Billing AI Agent</h2>
        </div>
        <ChatWindow messages={messages} />
        <div className="chat-input">
          <MessageInput onSend={handleSend} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
