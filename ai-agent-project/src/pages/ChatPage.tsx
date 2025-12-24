import { useEffect, useMemo, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import type { ChatMessage } from "../types/chat";
import { sendUserMessage, subscribeToMessages } from "../lib/chatRepo";

export default function ChatPage() {
  // For now: fixed chatId (later you can generate per user)
  const chatId = useMemo(() => "demo-chat", []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    return () => unsub();
  }, [chatId]);

  async function handleSend(text: string) {
    try {
      setSending(true);
      await sendUserMessage(chatId, text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "30px auto", padding: "0 12px" }}>
      <h2 style={{ marginBottom: 8 }}>Billing AI Agent</h2>
      <p style={{ marginTop: 0, color: "#6b7280" }}>
        Send a message like “Pay my bill for subscriber 1001 for 2024-10 amount 100”.
      </p>

      <ChatWindow messages={messages} />
      <div style={{ marginTop: 12 }}>
        <MessageInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
}
