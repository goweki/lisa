import { sendEmail } from "@/lib/sendEmail";
import { sendSMS } from "@/lib/sendSMS";

export async function POST(request) {
  if (!process.env.SENDING_CHANNELS)
    return Response.json({ error: "no sending channels defined" });
  try {
    // sending channels
    const channels = process.env.SENDING_CHANNELS.split(" ");
    // request body
    const doc = await request.json();
    console.log(`POST REQUEST: to send an email.`);
    let mailerRes = {};
    if (channels.includes("email")) {
      const res_ = await sendEmail(doc);
      if (res_.success) mailerRes.email = "success";
    }
    if (channels.includes("sms")) {
      const res_ = await sendSMS(doc);
      if (res_.success) mailerRes.sms = "success";
    }
    // const mailerRes = await sendEmail(doc);
    if (Object.values(mailerRes).includes("success"))
      return Response.json({ success: mailerRes });
    else return Response.json({ error: mailerRes });
  } catch (error) {
    // handle ERROR if caught
    console.log(
      `ERROR: error caught in mailer route -POST\n >> ${
        error.error || error
      }\n.........................`
    );
    return Response.json({ error: "Message was not sent" });
  }
}
