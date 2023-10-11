import AfricasTalking from "africastalking";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(`  > message to be sent:...: ${JSON.stringify(body)}`);
    let channels = process.env.NOTIFY_CHANNELS.split(" ");
    let res = [];
    if (channels.includes("sms")) {
      //africastalking
      res.push(await sendSMS(body));
      console.log(`Here sent sms`);
    }
    if (channels.includes("email")) {
      //nodemailer
      res.push(await sendEmail(body));
      console.log(`Here sent email`);
    }
    return Response.json(res);
  } catch (e) {
    // log error
    console.log(`ERROR 786789: ${e}`);
    return Response.json({
      error: `ERROR: server error. Try again later: ${JSON.stringify(e)}`,
    });
  }
}

async function sendEmail({ subject, message }) {
  //nodemailer
  const nodeMailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT_USER,
      pass: process.env.GMAIL_APP_KEY,
    },
  });
  //email properties
  const rabeeMailOptions = {
    from: process.env.GMAIL_ACCOUNT_FROM,
    to: process.env.GMAIL_ACCOUNT_TO,
    subject: subject,
    text: message,
  };
  const resp_ = await nodeMailTransporter.sendMail(rabeeMailOptions);
  return { message: resp_ };
}

async function sendSMS({ subject, message }) {
  //africastalking
  const africastalkingOptions = {
    apiKey: process.env.AFRICASTALKING_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
  };
  // Initialize Africa's Talking
  const africastalking = AfricasTalking(africastalkingOptions);
  //send sms
  const res_ = await africastalking.SMS.send({
    to: process.env.CELL_TO,
    message: subject + ": " + message,
  });
  //log response
  console.log("HERE-A.........." + res_.SMSMessageData.Recipients);
  console.log("HERE-B.........." + Object.keys(res_.SMSMessageData.Recipients));
  if (res_.SMSMessageData.Recipients.length === 0)
    return { error: "message not sent to any receipient" };
  else return { message: res_.SMSMessageData.Recipients };
}
