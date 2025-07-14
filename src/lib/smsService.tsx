import AfricasTalking from "africastalking";

const {
  AFRICASTALKING_KEY,
  AFRICASTALKING_USERNAME,
  AFRICASTALKING_SENDER_ID,
} = process.env;

interface SMSData {
  subject: string;
  text: string;
  to: string;
}

export default async function sendSMS({
  subject,
  text,
  to,
}: SMSData): Promise<boolean> {
  if (
    !AFRICASTALKING_KEY ||
    !AFRICASTALKING_USERNAME ||
    !AFRICASTALKING_SENDER_ID
  ) {
    console.error(" > ERROR: Africastalking credentials not set in env");
    return false;
  }

  try {
    const africastalking = AfricasTalking({
      apiKey: AFRICASTALKING_KEY,
      username: AFRICASTALKING_USERNAME,
    });
    const result = await africastalking.SMS.send({
      from: AFRICASTALKING_SENDER_ID,
      to,
      message: subject + ": " + text,
    });
    console.log(" > SUCCESS: sms sent " + JSON.stringify(result));
    return true;
  } catch (err: any) {
    console.error(" > ERROR: sms not sent - ", err.error ?? err);
    return false;
  }
}
