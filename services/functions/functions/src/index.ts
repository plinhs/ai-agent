import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2/options";

admin.initializeApp();
setGlobalOptions({ region: "europe-west3" }); // region doesn't matter for emulator, ok to keep

export const onUserMessageCreated = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data() as { role?: string; text?: string };
    if (data.role !== "user") return; // prevents infinite loop

    const chatId = event.params.chatId;

    await admin.firestore()
      .collection("chats").doc(chatId)
      .collection("messages")
      .add({
        role: "assistant",
        text:
          `Got it: "${data.text ?? ""}". ` +
          `Next: parse intent (LLM) and call API Gateway.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }
);
