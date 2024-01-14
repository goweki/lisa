import AfricasTalking from "africastalking";

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_KEY,
  username: process.env.AFRICAS_TALKING_USERNAME,
});

export async function sendSMS(data) {
  try {
    const result = await africastalking.SMS.send({
      to: process.env.AFRICAS_TALKING_TO,
      message: data.subject + ": " + data.text,
      //   from: '[Your_sender_ID_goes_here]'
    });
    console.log(
      "SUCCESS: sms sent " + JSON.stringify(result) + "\n............"
    );
    return { success: result };
  } catch (err) {
    console.log("ERROR: sms not sent " + err + "\n............");
    return { error: err };
  }
}
