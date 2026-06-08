import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { SessionUser } from "@/types/next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { TemplateObj } from "@/types/custom";

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NO_ID = process.env.WHATSAPP_PHONE_NO_ID;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;

// 🧾 Schema to validate the WhatsApp message payload
const SendMessageSchema = z.object({
  to: z
    .string()
    .nonempty("Recipient phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  body: z.string().optional(),
  mediaUrl: z.string().optional(),
});

async function postHandler(req: Request, user: SessionUser) {
  const json = await req.json();
  console.log("POST /api/whatsapp/send - ", json);

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NO_ID || !WHATSAPP_API_URL) {
    return Response.json("WhatsApp integration not configured", {
      status: 400,
    });
  }

  const parsed = SendMessageSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Invalid body:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }

  const { to, body, mediaUrl } = parsed.data;
  if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
    console.error("Invalid phone number format:", to);
    throw new Error("Invalid phone number format");
  }

  const messageData: TemplateObj = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
  };
  // Add text message if body is provided
  if (body) {
    messageData.type = "text";
    messageData.text = { body };
  }
  // Add media message if mediaUrl is provided
  if (mediaUrl) {
    messageData.type = "image"; // Can be adjusted for other media types
    messageData.image = { link: mediaUrl };
  }

  const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NO_ID}/messages`;
  console.log("Sending message to WhatsApp API:", messageData, "-", url);

  //   const response = await axios.post(url, messageData, {
  //     headers: {
  //       Authorization: `Bearer ${this.whatsappAccessToken}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });

  // 🚀 Send the message using fetch
  try {
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
        console.error("ERROR - ", await res_.json());
        return;
      }
    });

    if (!waResponse) {
      return Response.json("Failed to send WhatsApp template", { status: 502 });
    }

    // // 💾 Log the message in your database (optional)
    // await prisma.whatsappMessageLog.create({
    //   data: {
    //     institutionId,
    //     userId: user.id,
    //     recipient: to,
    //     templateName,
    //     responsePayload: JSON.stringify(waData),
    //   },
    // });

    return Response.json("WhatsApp message sent");
  } catch (err) {
    console.error("Unexpected WhatsApp API Error:", err);
    return Response.json("Internal server error", { status: 500 });
  }
}

export const POST = withAuthGeneral(postHandler);
