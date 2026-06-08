import { ReactElement } from "react";
import client from "./client";
import { getFriendlyErrorMessage } from "@/lib/utils/errorHandlers";

const defaultFrom = process.env.RESEND_SYSTEM_SENDER;

export type SendEmailProps = {
  to: string | string[];
  subject: string;
  message: { text?: string; react: ReactElement<any> };
  from?: string;
  replyTo?: string;
};

async function sendEmail({
  to,
  subject,
  message,
  from,
  replyTo,
}: SendEmailProps): Promise<ActionResult<string>> {
  if (!defaultFrom) {
    console.log("misssing env.RESEND_SYSTEM_SENDER");
    throw new Error("ERROR: missing env");
  }

  const { data, error } = await client.emails.send({
    from: from || defaultFrom,
    to,
    subject,
    react: message.react,
    text: message.text,
    replyTo,
  });

  if (error) {
    console.error("Resend ERROR:", error);
    return { ok: false, error: error.message };
  }

  console.log(`Email sent successfully:`, data);
  return { ok: true, data: data.id };
}

export default sendEmail;
