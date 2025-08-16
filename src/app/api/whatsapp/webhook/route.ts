import { strFirstWord } from "@/helpers/stringHandlers";
import prisma from "@/lib/prisma/prisma";
import { TemplateObj } from "@/types/custom";
import { randomUUID } from "crypto";
import {
  Institution,
  Message,
  MessageDirection,
  MessageSubject,
  VerificationChannel,
} from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { sendMessage } from "../_actions";
import parsePhoneNumberFromString from "libphonenumber-js";
import { runAgent } from "@/lib/AI";
import { User, InstitutionUser } from "@/types/models";
import {
  generateConversationalContentFromMessages,
  generateLangConversationFromMessages,
} from "@/lib/AI/utils/generateHistory";
import { HumanMessage } from "@langchain/core/messages";
import { AgentName } from "@/lib/AI/agent/Agent";
import { IntentType } from "../types";

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

  // TALK_TO_KOKOSE intent: message contains "kokose" or "420" within the first 10 characters
  const firstTenDgts = normalized.toLowerCase().slice(0, 10);
  if (firstTenDgts.includes("kokose") || firstTenDgts.includes("420")) {
    return IntentType.TALK_TO_KOKOSE;
  }

  return IntentType.HELP;
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
  const {
    to: _to,
    template,
    languageCode,
    headerParams,
    bodyParams,
    buttonParams,
  } = sendTemplateDto;

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
    const phoneNumber = parsePhoneNumberFromString(_to);

    if (!phoneNumber || !phoneNumber.isValid()) {
      console.error("Invalid phone number format:", _to);
      throw new Error("Invalid phone number format");
    }

    const to = phoneNumber.number;

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
        console.error("Failed to send whatsapp template - ", await res_.json());
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
    console.error(`Error in send WhatsApp template: `, error);
    return null;
  }
}

async function processIncomingMessage(
  message: any,
  valueData: any
): Promise<boolean> {
  try {
    // message info
    const from = message.from;
    const from_user = await prisma.user.findUnique({
      where: { tel: "+" + from },
      include: {
        messages: true,
        Session: true,
        institutions: { include: { institution: true } },
      },
    });
    const to = valueData.metadata?.phone_number_id;
    const messageId = message.id;

    let body = "";
    let _mediaUrl = null;
    let mediaUrl = null;

    if (from_user && from_user.email) {
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
          return false;
        }
        // save outgoin message to db
        await prisma.message.create({
          data: {
            messageId: sent_whatsapp_template.whatsappResponse.messages[0].id,
            userId: from_user.id,
            direction: MessageDirection.OUTBOUND,
            subject: MessageSubject.SET_YOUR_PASSWORD,
            to: from,
            from: to,
            text: `account verification info: ****`,
          },
        });
        return true;
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
          console.warn(
            "Media processing logic yet to be implemented...",
            _mediaUrl
          );
        }
      }

      const intent = getIntentFromMessage(body);

      // save incomin message to db
      await prisma.message.create({
        data: {
          messageId,
          userId: from_user.id,
          direction: MessageDirection.INBOUND,
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
        case IntentType.TALK_TO_KOKOSE:
          console.warn(
            ` > Consulting KOKOSE - registered user - ${from_user.names}, ${from_user.tel}`
          );

          const kokoseReply = await consultAI({
            prompt: body,
            user: from_user,
            agentName: "kokose",
          });

          // reply
          if (kokoseReply) {
            const sent_message_ = await sendMessage({
              to: from,
              body: kokoseReply,
            });

            if (!sent_message_) {
              console.warn(
                `Reply was not sent to user ${from} : ${kokoseReply} `
              );
              return false;
            }

            await prisma.message.create({
              data: {
                messageId: sent_message_.messages[0].id,
                userId: from_user.id,
                direction: MessageDirection.OUTBOUND,
                to: from,
                from: "assistant",
                text: kokoseReply,
              },
            });
          } else {
            console.warn(`No response from kokose AI : prompt -`, body);
            return false;
          }
          break;
        case IntentType.HELP:
          console.warn(
            ` > HELP intent: Consulting AI - ${from_user.names}, ${from_user.tel}`
          );

          const reply = await consultAI({
            prompt: body,
            user: from_user,
          });

          // reply
          if (reply) {
            const sent_message_ = await sendMessage({
              to: from,
              body: reply,
            });

            if (!sent_message_) {
              console.warn(`Reply was not sent to user ${from} : ${reply} `);
              return false;
            }

            await prisma.message.create({
              data: {
                messageId: sent_message_.messages[0].id,
                userId: from_user.id,
                direction: MessageDirection.OUTBOUND,
                to: from,
                from: "assistant",
                text: reply,
              },
            });
          } else {
            console.warn(`No response from lisa AI : prompt -`, body);
            return false;
          }
          break;

        default:
          console.warn(
            ` > Could not determine intent of WhatsApp message from - ${from_user.names} (${from_user.tel}): ${body}`
          );
          break;
      }

      return true;
    } else {
      console.warn(
        ` > Processing incoming message from unonboarded user:`,
        from,
        message
      );

      // reply
      let reply: string | null =
        `You need to sign-up to LISA to use this automated service. Read more here: \n\nhttps://lisa.goweki.com/`;
      let saveMessageFlag: boolean = false;

      if (message.type === "text" && message.text) {
        body = message.text.body;
      }

      const intent = getIntentFromMessage(body);
      if (intent === IntentType.TALK_TO_KOKOSE) {
        await prisma.message.create({
          data: {
            messageId,
            direction: MessageDirection.INBOUND,
            to: "kokose",
            from,
            text: body,
          },
        });

        const prevMessages_ = await prisma.message.findMany({
          where: { OR: [{ to: from }, { from }] },
        });

        // message count in the last 2 minutes
        const recentMessagesCount = prevMessages_.filter((message) => {
          const messageTime = new Date(message.createdAt).getTime();
          return Date.now() - messageTime <= 2 * 60 * 1000;
        }).length;

        if (recentMessagesCount > 5) {
          const reply_ =
            "User Messages exceeded demo quota. Try again after 2 minutes.";
          console.warn(reply_);
          reply = reply_;
        } else {
          const reply_ = await consultKokose({
            prompt: body,
            messages: prevMessages_,
            agentName: "kokose",
            tel: from,
          });
          reply = reply_;
          saveMessageFlag = true;
        }
      }

      if (reply) {
        const sent_message_ = await sendMessage({
          to: from,
          body: reply,
        });

        if (!sent_message_) {
          console.warn("Message not sent - ", {
            to: from,
            body: reply,
          });
          return false;
        }

        //save to db
        if (saveMessageFlag) {
          // user
          let systemUser = await prisma.user.findUnique({
            where: { email: "lisa@goweki.com" },
          });
          if (!systemUser) {
            systemUser = await prisma.user.create({
              data: {
                names: "System User",
                systemAdmin: true,
                email: "lisa@goweki.com",
              },
            });
          }

          //create
          await prisma.message.create({
            data: {
              messageId: sent_message_.messages[0].id,
              userId: systemUser.id,
              direction: MessageDirection.OUTBOUND,
              to: from,
              from: "kokose",
              text: reply,
            },
          });
        }
      }
    }

    console.log(`Processed and saved incoming message: ${messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to process incoming message: `, error);
    throw error;
  }
}

async function processWebhook(
  data: z.infer<typeof WebhookPayloadSchema>
): Promise<boolean> {
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

    return true;
  } catch (error) {
    console.error(`Failed to process webhook: `, error);
    return false;
  }
}

async function processStatusUpdate(status: any): Promise<boolean> {
  try {
    const messageId = status.id;
    const statusValue = status.status;

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

    return true;
  } catch (error) {
    console.error(`Error processing status update:`, error);
    return false;
  }
}

async function consultAI({
  prompt,
  user,
  agentName = "lisa",
}: {
  prompt: string;
  user: User;
  agentName?: AgentName;
}): Promise<string | null> {
  const institutions =
    user.institutions?.map((userInst: InstitutionUser) => ({
      id: userInst.institutionId,
      name: userInst.institution?.name || "<NULL>",
      role: userInst.role,
    })) || [];

  const reply = await runAgent({
    user: user ? { ...user, institutions } : undefined,
    prompt: [
      ...(await generateLangConversationFromMessages(user?.messages || [])),
      new HumanMessage(prompt),
    ],
    agentName,
  });
  // console.log("Lisa AI says: ", reply);
  return reply;
}

async function consultKokose({
  prompt,
  messages,
  agentName,
  tel,
}: {
  prompt: string;
  messages?: Message[];
  agentName: AgentName;
  tel: string;
}): Promise<string | null> {
  const reply = await runAgent({
    prompt: [
      ...(await generateLangConversationFromMessages(messages || [])),
      new HumanMessage(prompt),
    ],
    agentName,
    tel,
  });
  // console.log("Lisa AI says: ", reply);
  return reply;
}

// GET: Verification
export async function GET(req: NextRequest) {
  console.log("WhatsApp webhook verification request...", req.url);
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
    // console.log('RESULT - ', result);

    return Response.json("");
  } catch (err) {
    console.error("🔥 Error processing webhook:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
