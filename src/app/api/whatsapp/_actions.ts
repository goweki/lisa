import { TemplateObj } from "@/types/custom";

interface SendMessageInput {
  to: string;
  body?: string;
  mediaUrl?: string;
}

export async function sendMessage({
  to,
  body,
  mediaUrl,
}: SendMessageInput): Promise<TemplateObj | null> {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
  const WHATSAPP_PHONE_NO_ID = process.env.WHATSAPP_PHONE_NO_ID!;
  const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL!;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NO_ID || !WHATSAPP_API_URL) {
    console.error("WhatsApp integration not configured");
    return null;
  }

  if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
    console.error("Invalid phone number format:", to);
    return null;
  }

  const messageData: Record<string, any> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
  };

  if (body) {
    messageData.type = "text";
    messageData.text = { body };
  }

  if (mediaUrl) {
    messageData.type = "image";
    messageData.image = { link: mediaUrl };
  }

  const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NO_ID}/messages`;
  console.log("➡️ Sending WhatsApp message:", messageData, "-", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!res.ok) {
      const errBody = await res.json();
      console.error("❌ Failed to send WhatsApp message:", errBody);
      return null;
    }

    const responseData = await res.json();
    console.log("✅ WhatsApp message sent:", responseData);

    return responseData;
  } catch (error) {
    console.error("🔥 WhatsApp API Error:", error);
    return null;
  }
}
