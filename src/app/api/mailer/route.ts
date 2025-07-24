import { sendEmail } from "@/lib/emailService";
import sendSMS from "@/lib/smsService";

export async function POST(request: Request) {
  const body = await request.json();
  console.log('MAILER request - ', body)
  if (!body.sms && !body.email) {
    console.error(
      "FAILED: route /mailer POST: >> Missing required fields in request body",
      body
    );
    return Response.json(
      "Missing required fields in request body",
      { status: 400 }
    );
  }
  const { sms, email } = body;

  try {
    let mailerRes = { email: "", sms: "" }; // will hold responses

    if (email) {
      const { to, subject, html, text, cc } = email;
      if (!to || !subject || !html || !text) {
        console.error(
          "FAILED: route /mailer POST: >> Missing required fields in email request",
          body
        );
        return Response.json("Missing required fields in email request", {
          status: 400,
        });
      }
      const mailSent_ = await sendEmail({ to, subject, html, text, cc });
      if (mailSent_) {
        mailerRes.email = "success";
      } else {
        mailerRes.email = "failed";
      }
    }
    //send SMS
    if (sms) {
      const { to, subject, text } = email;
      if (!to || !subject || !text) {
        console.error(
          "FAILED: route /mailer POST: >> Missing required fields in SMS request",
          body
        );
        return Response.json("Missing required fields in SMS request", {
          status: 400,
        });
      }
      const smsSent = await sendSMS({ to, subject, text });
      if (smsSent) {
        mailerRes.sms = "success";
      } else {
        mailerRes.sms = "failed";
      }
    }

    if (Object.values(mailerRes).includes("success")) {
      console.log(
        "SUCCESS-WRAP: message sent - route /mailer POST: >> ",
        mailerRes
      );
      return Response.json("Message sent");
    } else {
      console.error("FAILED:  route /mailer POST: >> ", mailerRes);
      return Response.json("Message NOT sent", { status: 500 });
    }
  } catch (error) {
    // handle ERROR if caught
    console.log(
      `ERROR: error caught in route /mailer POST\n >> ${error}\n.........................`
    );
    return Response.json("Message NOT sent", { status: 500 });
  }
}
