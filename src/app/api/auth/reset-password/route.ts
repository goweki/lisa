import prisma from "@/lib/prisma";
import sendEmail from "@/lib/emailService";
import crypto from "crypto";
const CONICAL_URL =
  process.env.ENV === "development"
    ? process.env.CONICAL_URL_DEV
    : process.env.CONICAL_URL_PROD;

export async function POST(request: Request) {
  const { userEmail } = await request.json();
  try {
    const userExists = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!userExists) return Response.json({ failed: "User NOT FOUND" });
    //user exists
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 3600000;
    //update db
    const updatedUser = await prisma.user.update({
      where: { id: userExists.id },
      data: {
        resetToken: passwordResetToken,
        resetTokenExpiry: new Date(passwordResetExpires),
      },
    });
    if (!updatedUser) {
      console.error("Password Reset link NOT SAVED: \n", userExists);
      return Response.json({
        failed: "Error generating reset link, try again later",
      });
    }
    console.log("Password Reset link SAVED: \n", updatedUser);
    //reset password URL
    const resetURL = `${CONICAL_URL}/reset-password/${resetToken}`;
    const emailOptions = {
      subject: "Reset Password for Lisa",
      text: `Reset your password by clicking the following URL: ${resetURL}`,
    };
    const sendMail = await sendEmail(emailOptions);
    if (sendMail.success)
      return Response.json({ success: "Check email for the reset link" });
    else return Response.json({ failed: "Reset failed, try again later" });
  } catch (err: any) {
    console.log("ERROR in route: >", err);
    return Response.json({ error: err.message });
  }
}
