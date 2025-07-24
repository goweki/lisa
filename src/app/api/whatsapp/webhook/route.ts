import { strFirstWord } from "@/helpers/stringHandlers";
import prisma from "@/lib/prisma/prisma";
import { TemplateObj } from "@/types/custom";
import { MessageSubject, VerificationChannel } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { sendMessage } from "../_actions";

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NO_ID = process.env.WHATSAPP_PHONE_NO_ID;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;

const WebhookPayloadSchema = z.object({
  // Adjust to match actual structure of WhatsApp webhook payload
  object: z.string(),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(z.any()), // Define this properly based on your needs
    })
  ),
});

enum IntentType {
  RESET_PASSWORD = "RESET_PASSWORD",
  PAY_SUBSCRIPTION = "PAY_SUBSCRIPTION",
  CREATE_PROJECT = "CREATE_PROJECT",
  HELP = "HELP",
  UNKNOWN = "UNKNOWN",
}

function getIntentFromMessage(message: string): IntentType {
  const normalized = message.toLowerCase().trim();

  if (/reset.*password/.test(normalized)) {
    return IntentType.RESET_PASSWORD;
  }

  if (/create.*project|new.*project/.test(normalized)) {
    return IntentType.CREATE_PROJECT;
  }

  if (/pay.*subscription|subscribe/.test(normalized)) {
    return IntentType.PAY_SUBSCRIPTION;
  }

  return IntentType.UNKNOWN;
}

interface SendTemplateDto {
  to: string;
  template: string;
  languageCode?: string;
  headerParams?: Record<string, any>[];
  bodyParams?: Record<string, any>[];
  buttonParams?: Record<string, any>[];
}

async function sendTemplate(
  sendTemplateDto: SendTemplateDto
): Promise<TemplateObj | null> {
  const { to, template, languageCode, headerParams, bodyParams, buttonParams } =
    sendTemplateDto;

  // Build components dynamically
  const components: any[] = [];

  if (headerParams && headerParams.length > 0) {
    components.push({
      type: "header",
      parameters: headerParams.map((param: Record<string, any>) => ({
        type: param.type || "text",
        text: param.text,
      })),
    });
  }

  if (bodyParams && bodyParams.length > 0) {
    components.push({
      type: "body",
      parameters: bodyParams.map((param: Record<string, any>) => ({
        type: param.type || "text",
        text: param.text,
      })),
    });
  }

  if (buttonParams && buttonParams.length > 0) {
    components.push({
      type: "button",
      sub_type: "url",
      index: 0,
      parameters: buttonParams.map((param: Record<string, any>) => ({
        type: param.type || "text",
        text: param.text,
      })),
    });
  }

  try {
    // Validate recipient phone number
    if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
      console.error("Invalid phone number format:", to);
      throw new Error("Invalid phone number format");
    }

    const messageData: any = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: {
          code: languageCode || "en_US",
        },
        components,
      },
    };

    if (!WHATSAPP_API_URL || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NO_ID) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "WhatsApp API env configs not set: API URL / Access Token / Phone Number ID"
        );
      } else {
        console.warn(
          "TESTING ENVIRONMENT: WhatsApp API env configs not set: API URL / Access Token / Phone Number ID: ",
          sendTemplateDto
        );
      }
      return {
        success: true,
        whatsappResponse: null,
      };
    }

    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NO_ID}/messages`;
    console.log(
      "Sending template message to WhatsApp API:",
      messageData,
      "-",
      url
    );

    const waResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }).then(async (res_) => {
      if (res_.ok) {
        return await res_.json();
      } else {
        console.error("Failed to send whatsapp message - ", await res_.json());
        return null;
      }
    });

    if (!waResponse || waResponse.statusText !== "OK") {
      return null;
    }

    return {
      success: true,
      whatsappResponse: waResponse.data,
    };
  } catch (error) {
    console.error(`Failed to send WhatsApp message: `, error);
    return null;
  }
}

async function processIncomingMessage(message: any, valueData: any) {
  try {
    // message info
    const from = message.from;
    const from_user = await prisma.user.findFirst({
      where: { tel: from },
      include: { messages: true },
    });
    const to = valueData.metadata?.phone_number_id;
    const messageId = message.id;

    let body = "";
    let _mediaUrl = null;
    let mediaUrl = null;

    if (from_user) {
      console.log(
        ` > Processing incoming message from existing user:`,
        from_user.email || from_user.tel
      );

      if (
        !from_user.password &&
        from_user.resetTokenExpiry &&
        from_user.resetTokenExpiry > new Date(Date.now() + 60_000) &&
        from_user.resetTokenSentTo === VerificationChannel.WHATSAPP
      ) {
        const templateConfig_ = {
          template: "set_your_password",
          bodyParams: [
            {
              type: "text",
              text: strFirstWord(from_user.names),
            },
            {
              type: "text",
              text: "your WhatsApp No.",
            },
          ],
          buttonParams: [
            {
              type: "text",
              text: `?resetToken=${from_user.resetToken}&username=${from_user.tel}`,
            },
          ],
        };

        const sent_whatsapp_template = await sendTemplate({
          to: from,
          ...templateConfig_,
        });
        console.log(
          `sent new_password template message with valid token to - ${from}`
        );
        if (!sent_whatsapp_template) {
          console.error("Whatsapp Template not sent");
          return;
        }
        // save outgoin message to db
        await prisma.message.create({
          data: {
            messageId: sent_whatsapp_template.whatsappResponse.messages[0].id,
            userId: from_user.id,
            subject: MessageSubject.SET_YOUR_PASSWORD,
            to: from,
            from: to,
            text: `verify account`,
          },
        });
        return;
      }

      if (message.type === "text" && message.text) {
        body = message.text.body;
      } else if (
        ["image", "audio", "video", "document"].includes(message.type)
      ) {
        const mediaType = message.type;
        _mediaUrl = message[mediaType]?.link || null;
        // Download media if needed
        if (_mediaUrl) {
          // You can implement media download and storage here
        }
      }
      const intent = getIntentFromMessage(body);

      // save incomin message to db
      await prisma.message.create({
        data: {
          messageId,
          userId: from_user.id,
          from,
          to,
          text: body,
          mediaUrl,
          intent,
        },
      });

      switch (intent) {
        case IntentType.RESET_PASSWORD:
          console.warn(` > Unimplemented intent: reset password`);
          // Handle reset password logic here
          break;
        case IntentType.CREATE_PROJECT:
          console.warn(` > Unimplemented intent: create project`);
          // Handle create project logic here
          break;
        case IntentType.PAY_SUBSCRIPTION:
          console.warn(` > Unimplemented intent: pay subscription`);
          // Handle pay subscription logic here
          break;
        case IntentType.HELP:
          console.warn(` > Unimplemented intent: help`);
          // Handle help logic here
          break;
        default:
          console.warn(` > Unimplemented intent: default`);
          // Handle unknown intent logic here
          break;
      }

      return;
    } else {
      console.warn(
        ` > Processing incoming message from unregistered user:`,
        from
      );

      // reply
      const message_text_ = `Hi , \n\nYou need to sign-up to LISA to use this autometed service. Read more here: \n\nhttps://lisa.goweki.com/`;
      const sent_message_ = await sendMessage({
        to: from,
        body: message_text_,
      });

      if (!sent_message_) {
        return null;
      }

      //save to db
      let systemUser = await prisma.user.findFirst({
        where: {
          systemAdmin: true,
        },
      });
      // If not found, create one
      if (!systemUser) {
        systemUser = await prisma.user.create({
          data: {
            names: "System User",
            systemAdmin: true,
            email: "lisa-admin@goweki.com",
          },
        });
      }

      await prisma.message.create({
        data: {
          messageId: sent_message_.whatsappResponse.messages[0].id,
          userId: systemUser.id,
          to: from,
          from: "system",
          text: `Hi , \n\nYou need to sign-up to use this autometed service. Read more here: \n\nhttps://loci.nlm-tech.com/`,
        },
      });
    }

    console.log(`Processed and saved incoming message: ${messageId}`);
    return messageId;
  } catch (error) {
    console.error(`Failed to process incoming message: `, error);
    throw error;
  }
}

async function processWebhook(data: z.infer<typeof WebhookPayloadSchema>) {
  console.log("📦 Processing webhook payload:", data);

  try {
    // Extract messages from the webhook payload
    const entries = data.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field === "messages") {
          // Process incoming message
          const messages = change.value?.messages || [];
          for (const message of messages) {
            await processIncomingMessage(message, change.value);
          }

          // Process status updates
          const statuses = change.value?.statuses || [];
          for (const status of statuses) {
            await processStatusUpdate(status);
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error(`Failed to process webhook: `, error);
    return { success: false, error: error };
  }

  // Example processing logic — replace with your real logic
  for (const entry of data.entry) {
    console.log("Entry ID:", entry.id);
    // Handle changes, log or process messages
  }

  return { status: "success" };
}

async function processStatusUpdate(status: any): Promise<string | null> {
  try {
    const messageId = status.id;
    const statusValue = status.status; // sent, delivered, read, etc.

    const status_ =
      statusValue === "delivered"
        ? { isDelivered: true }
        : statusValue === "read"
          ? { isRead: true }
          : {};

    // Update message status in db
    prisma.message.updateMany({
      where: { messageId },
      data: status_,
    });

    console.log(`Message status updated: ${messageId} -> ${statusValue}`);

    return messageId;
  } catch (error) {
    console.error(`Failed to process status update: ${error}`);
    return null;
  }
}

// GET: Verification
export async function GET(req: NextRequest) {
  console.log("GET webhook verification", req.url);
  const { searchParams } = req.nextUrl;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (process.env.NODE_ENV === "development") {
    console.warn("WHATSAPP WEBHOOK IN DEVELOPMENT:");
    console.warn(" - mode:", mode);
    console.warn(" - token:", token);
    console.warn(" - challenge:", challenge);
  }

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified successfully.");
    return new Response(challenge ?? "", { status: 200 });
  } else {
    console.warn("❌ WhatsApp webhook verification failed.");
    return new Response("Forbidden", { status: 403 });
  }
}

// POST: Receive Webhook Payload
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received webhook POST payload", body);

    const parsed = WebhookPayloadSchema.safeParse(body);
    if (!parsed.success) {
      console.error("❌ Invalid webhook payload:", parsed.error.flatten());
      return new Response("Invalid webhook payload", { status: 400 });
    }

    const result = await processWebhook(parsed.data);

    return Response.json(result);
  } catch (err) {
    console.error("🔥 Error processing webhook:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
