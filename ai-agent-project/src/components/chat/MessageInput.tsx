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
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #d1d5db",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          cursor: "pointer",
        }}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
