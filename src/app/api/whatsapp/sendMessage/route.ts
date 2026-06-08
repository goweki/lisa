import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { SessionUser } from "@/types/next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { TemplateObj } from "@/types/custom";
import { sendMessage } from "../_actions";

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

  const parsed = SendMessageSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Invalid body:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }

  const { to, body, mediaUrl } = parsed.data;

  //   return await sendMessage({ to, body, mediaUrl });
  const messageSent = await sendMessage({ to, body, mediaUrl });
  if (messageSent) {
    return Response.json("Message sent");
  } else {
    return Response.json("Message not sent", { status: 500 });
  }
}

export const POST = withAuthGeneral(postHandler);
