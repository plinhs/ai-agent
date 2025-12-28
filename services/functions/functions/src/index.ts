import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { FieldValue } from "firebase-admin/firestore";
import axios from "axios";

admin.initializeApp();
setGlobalOptions({ region: "europe-west3" });

const DEFAULT_SUBSCRIBER = 10;

function detectIntent(text: string): "query" | "detailed" | "pay" | null {
  const t = text.toLowerCase();

  if (t.includes("detail")) return "detailed";
  if (t.includes("pay")) return "pay";
  if (t.includes("check") || t.includes("bill")) return "query";

  return null;
}
function formatMonth(iso: string) {
  const [year, month] = iso.split("-");
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  return `${names[Number(month) - 1]} ${year}`;
}


function parseMonth(text: string): string | null {
  const t = text.toLowerCase();

  const monthMap: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  

  for (const m in monthMap) {
    if (t.includes(m)) {
      const year = t.match(/\b(20\d{2})\b/)?.[1] || "2025";
      return `${year}-${monthMap[m]}`;
    }
  }

  const iso = t.match(/\b(20\d{2}-\d{2})\b/)?.[1];
  return iso || null;
}

export const onUserMessageCreated = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data() as {
      role?: string;
      text?: string;
    };

    if (data.role !== "user") return;

    const chatId = event.params.chatId;
    const text = (data.text || "").trim();
    const chatRef = admin.firestore().collection("chats").doc(chatId);

    const gatewayBase =
      process.env.GATEWAY_BASE || "http://127.0.0.1:3001";

    const intent = detectIntent(text);
    const month = parseMonth(text);
    const subscriber_no = DEFAULT_SUBSCRIBER;


    if (!intent || !month) {
      await chatRef.collection("messages").add({
        role: "assistant",
        text: "Please specify the month, for example: January 2024 or March.",
        createdAt: FieldValue.serverTimestamp(),
      });
      return;
    }


    let reply = "";
    const prettyMonth = formatMonth(month);


    try {
      if (intent === "query") {
        const r = await axios.get(`${gatewayBase}/agent/query-bill`, {
          params: { subscriber_no, month },
        });
        reply =
          `Here is your bill for ${prettyMonth}:\n\n` +
          `Total Amount: ${r.data.total_amount} TL\n` +
          `Status: ${r.data.status}`;
      }


    if (intent === "detailed") {
      const r = await axios.get(`${gatewayBase}/agent/query-bill-detailed`, {
        params: { subscriber_no, month },
      });

      reply =
        `Bill details for ${prettyMonth}:\n\n` +        
        `Subscriber: ${subscriber_no}\n` +
        `Month: ${month}\n` +
        `Total Amount: ${r.data.total_amount} TL\n` +
        `Paid Amount: ${r.data.paid_amount ?? 0} TL\n` +
        `Remaining: ${r.data.total_amount - (r.data.paid_amount ?? 0)} TL\n` +
        `Status: ${r.data.status}\n\n`;
    }

    if (intent === "pay") {
      const r = await axios.get(`${gatewayBase}/agent/query-bill-detailed`, {
        params: { subscriber_no, month },
      });

      const remaining =
        r.data.total_amount - (r.data.paid_amount ?? 0);

      await axios.post(`${gatewayBase}/agent/pay-bill`, {
        subscriber_no,
        month,
        amount: remaining,
      });

      reply =
        "Payment successful.\n\n" +
        `Subscriber: ${subscriber_no}\n` +
        `Month: ${prettyMonth}\n` +
        `Amount Paid: ${remaining} TL\n` +
        `Status: Paid`;
    }




    } catch (e: any) {
      if (e.response?.status === 429) {
        reply =
          "You have reached the daily query limit.\n\n" +
          "Please try again tomorrow or proceed with payment if needed.";
      } else {
        reply =
          "Request failed:\n" +
          JSON.stringify(e.response?.data || e.message, null, 2);
      }
    }

    await chatRef.collection("messages").add({
      role: "assistant",
      text: reply,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
);
