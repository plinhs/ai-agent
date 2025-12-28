import { useState } from "react";

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  async function handleSend() {
    const t = text.trim();
    if (!t) return;
    setText("");
    await onSend(t);
  }

  return (
    <div className="input-container">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        className="message-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        className="send-button"
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
