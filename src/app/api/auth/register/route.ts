import prisma from "@/lib/prisma/prisma";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { compareHash, hash } from "@/helpers/passwordHandlers";
import { createUser } from "@/lib/prisma/queries";
import { welcomeEmail } from "@/lib/emailRenderer";
import { BASE_URL } from "@/helpers/getUrl";
import { generateUniqueInstitutionCode } from "@/helpers/stringHandlers";

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
      return Response.json("Email already in use", { status: 409 });

    let institutionCode = "";
    try {
      institutionCode = await generateUniqueInstitutionCode(
        newUser.institutionName
      );
    } catch (error: any) {
      console.error(error);
      return Response.json(
        "could not generate unique institution CODE. Try another name",
        {
          status: 409,
        }
      );
    }
    //add to db
    const newRegistration = await createUser({
      names: newUser.names,
      email: newUser.email,
      institutionName: newUser.institutionName,
      institutionCode,
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
      return Response.json(
        "Email was not sent: reset password later, or contact support"
      );
    }

    console.log("Registration successful");
    return Response.json(
      "Registration successful. Check email for activation link"
    );
  } catch (err: any) {
    console.error("ERROR in route: /api/auth/register >", err);
    return Response.json("Registration failed", { status: 500 });
  }
}
