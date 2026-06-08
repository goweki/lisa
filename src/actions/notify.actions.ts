"use server";

import {
  buildResetUrlTail,
  generateResetToken,
} from "@/lib/utils/passwordHandlers";
import { findUserByKey } from "./user.actions";

import prisma from "@/lib/prisma";
import { BANNER_IMAGE_URL, BASE_URL } from "@/lib/utils/getUrl";
import sendEmail from "@/lib/mailer";
import { getFriendlyErrorMessage } from "@/lib/utils/errorHandlers";
import sendSMS, { SMSData } from "@/lib/smsService";
import { NotificationChannel } from "@prisma/client";
import loci_whatsapp from "@/lib/whatsapp";
import { SendTemplateMessageInput } from "@/lib/whatsapp/client";
import { generatePasswordResetMessage } from "@/components/emails/resetPassword";

/**
 * Creates a new user, and sends Welcome email.
 */
export async function sendResetLinkAction(data: {
  username: string;
  sendTo?: NotificationChannel;
}): Promise<ActionResult<{ username: string; sentTo: string }>> {
  try {
    const { username, sendTo } = data;
    console.log(`[PASSWORD RESET]: request [${username}]`);

    const user = await findUserByKey(username);

    if (!user) {
      return { ok: false, error: `USER_NOT_FOUND: ${username}` };
    }

    const notificationChannel: NotificationChannel | null = sendTo
      ? sendTo
      : username === user.email
        ? "EMAIL"
        : username === user.email
          ? "WHATSAPP"
          : null;

    if (!notificationChannel) {
      return { ok: false, error: `No notification channel provided` };
    }

    const tokenObj = await generateResetToken();
    const resetLinkTail = await buildResetUrlTail(tokenObj.plain, username);
    const resetLink = `${BASE_URL}/reset-password/${resetLinkTail}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: tokenObj.hashed, resetTokenExpiry: tokenObj.expiry },
    });

    let sentTo: NotificationChannel | undefined;

    if (notificationChannel === "EMAIL" && user.email) {
      console.log(
        `[PASSWORD RESET]: sending reset passsword email to [${user.email}]`,
      );
      const message = generatePasswordResetMessage(user.names, resetLink);

      if (process.env.NODE_ENV === "development") {
        console.log("📧 Email (DEV MODE)");
        console.log({
          to: user.email,
          subject: "Reset Password: Q-Sync",
          resetLink,
        });
      } else {
        await sendEmail({
          to: user.email,
          subject: "Reset Password: Q-Sync",
          message,
        });
      }

      sentTo = "EMAIL";
    } else {
      if (user.tel !== username) {
        throw new Error("Error determining notification channel");
      }

      if (notificationChannel === "WHATSAPP") {
        console.log(
          `[PASSWORD RESET]: sending passsword-reset whatsapp-message to [${user.tel}]`,
        );
        if (process.env.NODE_ENV === "development") {
          console.log("📧 Whatsapp (DEV MODE)");
          console.log({
            to: user.tel,
            subject: "Reset Password: Q-Sync",
            resetLink,
          });
        } else {
          const wabaTemplateToSend: SendTemplateMessageInput = {
            to: user.tel,
            type: "template",
            template: {
              name: "qsync_new_password ",
              components: [
                {
                  type: "header",
                  parameters: [
                    { type: "image", image: { link: BANNER_IMAGE_URL } },
                  ],
                },
                {
                  type: "body",
                  parameters: [{ type: "text", text: user.names }],
                },
                {
                  type: "button",
                  sub_type: "url",
                  index: "0",
                  parameters: [
                    {
                      type: "text",
                      text: `reset-password/${resetLinkTail}`,
                    },
                  ],
                },
              ],
            },
          };

          // await loci_whatsapp.send()
          await loci_whatsapp.sendTemplateMessage(wabaTemplateToSend);
        }

        sentTo = "WHATSAPP";
      } else if (notificationChannel === "SMS") {
        console.log(
          `[PASSWORD RESET]: sending passsword-reset sms to [${user.tel}]`,
        );
        if (process.env.NODE_ENV === "development") {
          console.log("📧 sms (DEV MODE)");
          console.log({
            to: user.tel,
            subject: "Reset Password: Q-Sync",
            onboardingLink: resetLink,
          });
        } else {
          const { text: message } = generatePasswordResetMessage(
            user.names,
            resetLink,
          );
          const smsOptions: SMSData = {
            to: user.tel,
            subject: "Reset Passeord",
            text: message,
          };
          await sendSMS(smsOptions);
        }
        sentTo = "SMS";
      } else {
        return {
          ok: false,
          error: "Unknown error sending reset link",
        };
      }
    }

    if (!sentTo) {
      return { ok: false, error: "Reset link not sent" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenSentTo: sentTo },
    });

    return {
      ok: true,
      data: { username, sentTo },
    };
  } catch (error) {
    console.error("[ERROR] in sendResetLink:", error);

    return {
      ok: false,
      error: getFriendlyErrorMessage(error),
    };
  }
}
