import type { ChatMessage } from "../../types/chat";

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          padding: "10px 12px",
          borderRadius: 12,
          background: isUser ? "#1f2937" : "#e5e7eb",
          color: isUser ? "white" : "black",
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}
