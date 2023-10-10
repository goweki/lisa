import AfricasTalking from "africastalking";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(`  > message to be sent:...: ${JSON.stringify(body)}`);

    if (body.tel) {
      let res = await sendSMS(body);
      Response.json(res);
    }
    if (body.email) {
      //nodemailer
      let res = await sendEmail(body);
      Response.json(res);
    }
  } catch (e) {
    // log error
    console.log(`ERROR: ${e}`);
    return Response.json({
      error: `ERROR: server error. Try again later: ${JSON.stringify(e)}`,
    });
  }
}

async function sendEmail(reqBody) {
  //nodemailer
  const nodeMailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.RABEE_GMAIL_ACCOUNT_USER,
      pass: process.env.GMAIL_APP_KEY,
    },
  });
  //email properties
  const rabeeMailOptions = {
    from: process.env.RABEE_GMAIL_ACCOUNT_FROM,
    to: reqBody.email,
    subject: "Rabee - Sign Up Link",
    text: reqBody.message,
  };
  const resp_ = await nodeMailTransporter.sendMail(rabeeMailOptions);
  return { message: resp_ };
}

async function sendSMS(reqBody) {
  //africastalking
  const africastalkingOptions = {
    apiKey: process.env.AFRICASTALKING_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
  };
  // Initialize Africa's Talking
  const africastalking = AfricasTalking(africastalkingOptions);
  //send sms
  const res_ = await africastalking.SMS.send({
    to: reqBody.tel,
    message: reqBody.message,
  });
  //log response
  console.log("HERE-A.........." + res_.SMSMessageData.Recipients);
  console.log(
    "HERE-B.........." + JSON.stringify(res_.SMSMessageData.Recipients)
  );
  if (res_.SMSMessageData.Recipients === 0)
    return { error: "message not sent to any receipient" };
  else return { message: res_.SMSMessageData.Recipients };
}
