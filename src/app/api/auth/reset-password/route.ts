import prisma from "@/lib/prisma";
import { type NextRequest } from "next/server";
import sendEmail from "@/lib/emailService";
import crypto from "crypto";
import { hash } from "@/helpers/bcryptHandlers";
import { emailHTML } from "@/app/api/mailer/emailTemplates";
import { BASE_URL } from "@/helpers/getUrl";

//generates password-reset link
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
    const resetURL = `${BASE_URL}/reset-password/${resetToken}/?email_=${userEmail}`;
    const html = emailHTML(
      updatedUser.name,
      resetURL,
      "Reset your password (Lisa)"
    );

    const emailOptions = {
      subject: "Reset Password for Lisa",
      html,
      // `
      //       <p>Reset your password by clicking the below URL:</p>
      //       <p><a href="${resetURL}">${resetURL}</a></p>
      //       <br/>
      //       <br/>
      //       <i>If you did not request a password reset, please ignore this email and do not share contents with anyone.</i>
      //       `
      text: `
      Password Reset Request

      Reset your password by clicking or pasting below URL into your address-bar:
      ${resetURL}

      If you did not request a password reset, please ignore this email.
      `,
    };
    const sendMail = await sendEmail(emailOptions, userEmail);
    if (sendMail.success)
      return Response.json({ success: "Check email for the reset link" });
    else return Response.json({ failed: "Reset failed, try again later" });
  } catch (err: any) {
    console.log("ERROR in route: >", err);
    return Response.json({ error: err.message });
  }
}

//validates token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email") as string;
    const token = searchParams.get("token") as string;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("email-", email, "token-", token);

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });
    if (!userExists) return Response.json({ failed: "Invalid token" });
    //user exists
    else return Response.json({ success: "Enter new password" });
    //
  } catch (err: any) {
    console.log("ERROR in route: >", err);
    return Response.json({ error: err.message });
  }
}

//updates password
export async function PUT(request: Request) {
  const { userEmail, token, password } = await request.json();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    console.log("password-", password);
    console.log("password hash:\n >", await hash(password));
    const updateUser = await prisma.user.update({
      where: { email: userEmail, resetToken: hashedToken },
      data: {
        password: await hash(password),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    if (!updateUser) return Response.json({ failed: "Database error" });

    //user exists
    console.log("SUCCESS:\n >", updateUser);
    return Response.json({ success: "Password updated" });
  } catch (err: any) {
    console.log("ERROR in route /api/reset-password:\n >", err.message ?? err);
    return Response.json({ error: "Server error" });
  }
}
