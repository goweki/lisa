import nodemailer from "nodemailer";
const gmailAccountUser = process.env.GMAIL_ACCOUNT_USER;
const gmailAccountKey = process.env.GMAIL_APP_KEY;
const emailFrom = process.env.GMAIL_ACCOUNT_FROM;
const emailTo = process.env.GMAIL_ACCOUNT_TO;

export default async function sendEmail(
  data: {
    subject: string;
    text: string;
    html: string;
    cc?: string;
  },
  sendTo?: string
) {
  try {
    // nodemailer transporter obj
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailAccountUser,
        pass: gmailAccountKey,
      },
    });
    // nodemailer options
    const mailOptions = {
      from: emailFrom,
      to: sendTo || emailTo,
      subject: data.subject,
      text: data.text,
      html: data.html,
      cc: data.cc || (sendTo ? emailTo : ""),
    };
    // console.log(` > CHECKPOINT: Sending email`);
    // send email
    const result = await transporter.sendMail(mailOptions);
    if (result.accepted.length > 0) return { success: result };
    else {
      console.error(" > ERROR: email not sent ");
      return { error: "Email not sent " };
    }
  } catch (err) {
    console.error(" > ERROR: email not sent \n > ", err);
    return { error: "Email not sent" };
  }
}
