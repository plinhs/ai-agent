import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { ChatMessage } from "../types/chat";

export function messagesCol(chatId: string) {
  return collection(db, "chats", chatId, "messages");
}

export async function sendUserMessage(chatId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(messagesCol(chatId), {
    role: "user",
    text: trimmed,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(
  chatId: string,
  onChange: (messages: ChatMessage[]) => void
) {
  const q = query(messagesCol(chatId), orderBy("createdAt", "asc"));

  return onSnapshot(q, (snap) => {
    const msgs: ChatMessage[] = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        role: data.role,
        text: data.text,
        createdAt: data.createdAt ?? null,
      };
    });
    onChange(msgs);
  });
}
