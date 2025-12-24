import type { ChatMessage } from "../../types/chat";
import MessageBubble from "./MsgBubble";

export default function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        height: 520,
        overflowY: "auto",
        background: "white",
      }}
    >
      {messages.length === 0 ? (
        <div style={{ color: "#6b7280" }}>No messages yet.</div>
      ) : (
        messages.map((m) => <MessageBubble key={m.id} msg={m} />)
      )}
    </div>
  );
}
