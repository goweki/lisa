import nodemailer from "nodemailer";
const gmailAccountUser = process.env.GMAIL_ACCOUNT_USER;
const gmailAccountKey = process.env.GMAIL_APP_KEY;
const emailFrom = process.env.GMAIL_ACCOUNT_FROM;
const emailCC = process.env.NEXT_PUBLIC_MAIL_ACCOUNT_ADMIN;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  // cc,
  // bcc,
}: SendEmailOptions): Promise<boolean> {
  if (!gmailAccountUser || !gmailAccountKey) {
    console.error("Gmail account credentials are not set in env variables.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailAccountUser,
        pass: gmailAccountKey,
      },
    });

    const mailOptions = {
      from: emailFrom,
      to,
      subject,
      text,
      html,
      bcc: emailCC,
    };

    // console.log("...........\n \nMAILER:", mailOptions);
    console.log("Sending email to:", mailOptions.to);
    // console.log("Email subject:", mailOptions.subject);
    // console.log("Email HTML content:", mailOptions.html);

    const info = await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
