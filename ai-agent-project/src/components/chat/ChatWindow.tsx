import type { ChatMessage } from "../../types/chat";
import MessageBubble from "./MsgBubble";
import "../../App.css";

export default function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="chat-window"
    >
      {messages.length === 0 ? (
        <div className="empty-state">No messages yet.</div>
      ) : (
        messages.map((m) => <MessageBubble key={m.id} msg={m} />)
      )}
    </div>
  );
}
