import prisma from "@/lib/prisma/prisma";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { hash } from "@/helpers/bcryptHandlers";
import { registerUser } from "@/lib/prisma/queries";
import { welcomeEmail } from "@/lib/emailRenderer";
import { BASE_URL } from "@/helpers/getUrl";

// create new User & institution
export async function POST(request: Request) {
  const newUser = await request.json();
  console.log("...............\nNew user - ", newUser);
  try {
    console.log("all users' count - ", await prisma.user.count());
    const emailExists = await prisma.user.findUnique({
      where: { email: newUser.email },
    });
    if (emailExists)
      return Response.json({ message: "User already exists" }, { status: 409 });
    const institutionExists = await prisma.institution.findUnique({
      where: { name: newUser.institutionName },
    });
    if (institutionExists)
      return Response.json(
        { message: "Institution already exists" },
        { status: 409 }
      );

    //add to db
    const newRegistration = await registerUser({
      names: newUser.names,
      email: newUser.email,
      institutionName: newUser.institutionName,
    });

    console.log("Database updated", newRegistration);

    // send email
    const emailToSend = await welcomeEmail(
      newRegistration.name,
      newRegistration.onboardingURL
    );

    const emailerRes = await fetch(`${BASE_URL}/api/mailer`, {
      method: "POST",
      body: JSON.stringify({
        email: {
          to: newRegistration.email,
          subject: "Welcome to Lisa",
          html: emailToSend.html,
          text: emailToSend.text,
        },
      }),
    });

    if (!emailerRes.ok) {
      throw new Error("Failed to send email");
    }

    console.log("Registration successful");
    return Response.json({
      message: "Registration successful. Check email for activation link",
    });
  } catch (err: any) {
    console.error("ERROR in route: /api/auth/register >", err);
    return Response.json({ message: "Registration failed" }, { status: 500 });
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
