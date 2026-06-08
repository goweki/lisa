import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn(
    "Missing env variable: RESEND_API_KEY. Email features will be disabled.",
  );
}

const resend = new Resend(resendApiKey);

export default resend;
