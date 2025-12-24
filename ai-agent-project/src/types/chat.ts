import type { Timestamp } from "firebase/firestore";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: Timestamp | null;
};
