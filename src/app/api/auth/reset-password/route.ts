import prisma from "@/lib/prisma/prisma";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { hash } from "@/helpers/bcryptHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { resetPasswordEmail as resetPasswordEmailTemplate } from "@/lib/emailRenderer";

//generates password-reset link and emails user
export async function POST(request: Request) {
  const { userEmail } = await request.json();
  console.log("...............\nemail-", userEmail);
  try {
    console.log("users-", await prisma.user.count());
    const userExists = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    console.log("userExists-", userExists);
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

    // send email
    const renderedEmail = await resetPasswordEmailTemplate(
      updatedUser.names,
      resetURL
    );

    console.log("renderedEmail:\n", renderedEmail);

    const emailerRes = await fetch(`${BASE_URL}/api/mailer`, {
      method: "POST",
      body: JSON.stringify({
        email: {
          to: updatedUser.email,
          subject: "Lisa - Reset Password",
          html: renderedEmail.html,
          text: renderedEmail.text,
        },
      }),
    });

    if (!emailerRes.ok) {
      throw new Error("Failed to send password reset link");
    }

    console.log("Password reset email sent successfully");
    return Response.json({ message: "Check email for the reset link" });
  } catch (err: any) {
    console.log("ERROR in route: > /api/auth/reset-password", err);
    return Response.json({ message: err.message }, { status: 500 });
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
    else return Response.json({ success: "Enter new password" });
  } catch (err: any) {
    console.log("ERROR in route: > /api/auth/reset-password", err);
    return Response.json({ message: err.message }, { status: 500 });
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
    if (!updateUser)
      return Response.json({ message: "Database error" }, { status: 500 });

    //user exists
    console.log("SUCCESS:\n >", updateUser);
    return Response.json({ success: "Password updated" });
  } catch (err: any) {
    console.log("ERROR in route /api/reset-password:\n >", err.message ?? err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
