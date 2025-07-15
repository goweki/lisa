import prisma from "@/lib/prisma/prisma";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { compareHash, generateRandom, hash } from "@/helpers/passwordHandlers";
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
    if (!userExists)
      return Response.json({ message: "User NOT FOUND" }, { status: 404 });
    //user exists
    const resetToken = await generateRandom(20);
    const hashedResetToken = await hash(resetToken);
    const passwordResetExpires = Date.now() + 3600000;
    //update db
    const updatedUser = await prisma.user.update({
      where: { id: userExists.id },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry: new Date(passwordResetExpires),
      },
    });
    if (!updatedUser) {
      console.error("Password Reset link NOT SAVED: \n", userExists);
      return Response.json(
        {
          message: "Error generating reset link, try again later",
        },
        { status: 500 }
      );
    }
    console.log("Password Reset link SAVED: \n", updatedUser);
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
    console.log("email-", email, "\ntoken-", token);

    const userExists = await prisma.user.findUnique({
      where: {
        email,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!userExists) {
      return Response.json({ message: "Invalid link" }, { status: 400 });
    }

    const _isTokenValid: boolean =
      !!userExists.resetToken &&
      (await compareHash(token, userExists.resetToken));

    if (!_isTokenValid) {
      return Response.json(
        { message: "Invalid token. Try restting password" },
        { status: 400 }
      );
    } else return Response.json({ message: "Enter new password" });
  } catch (err: any) {
    console.log("ERROR in route: > /api/auth/reset-password", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

//updates password
export async function PUT(request: Request) {
  const { userEmail, token, password } = await request.json();
  console.log("password update request by - ", userEmail);
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: userEmail,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        resetToken: true,
        resetTokenExpiry: true,
      },
    });

    if (!userExists || !userExists.resetToken) {
      return Response.json(
        { message: "Not found. Try resetting your password later." },
        { status: 404 }
      );
    }

    const _isTokenValid = await compareHash(token, userExists.resetToken);
    //user exists
    if (!_isTokenValid)
      return Response.json(
        { message: "Invalid token. Try Resetting your password later" },
        { status: 401 }
      );

    const updatedUser = await prisma.user.update({
      where: { id: userExists.id },
      data: {
        password: await hash(password),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    if (!updatedUser)
      return Response.json(
        { message: "Password not updated" },
        { status: 500 }
      );

    return Response.json({ message: "Password updated" });
  } catch (err: any) {
    console.log("ERROR in route /api/reset-password:\n >", err.message ?? err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
