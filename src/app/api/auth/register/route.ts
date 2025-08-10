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
      return Response.json("could not generate unique institution CODE", {
        status: 409,
      });
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

// //validates token
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const email = searchParams.get("email") as string;
//     const plainTextToken = searchParams.get("token") as string;
//     console.log("email-", email, "token-", plainTextToken);

//     const userExists = await prisma.user.findUnique({
//       where: {
//         email,
//         resetTokenExpiry: {
//           gt: new Date(),
//         },
//       },
//     });

//     if (!userExists || !userExists.resetToken) {
//       return Response.json(
//         { message: "Not found. Try resetting your password later." },
//         { status: 404 }
//       );
//     }

//     const _isTokenValid = await compareHash(
//       plainTextToken,
//       userExists.resetToken
//     );
//     //user exists
//     if (_isTokenValid) return Response.json({ success: "Enter new password" });
//     else
//       return Response.json(
//         { message: "Invalid link. Try resetting Password after a while." },
//         { status: 400 }
//       );
//     //
//   } catch (err: any) {
//     console.log("ERROR in route: >", err);
//     return Response.json({ error: err.message });
//   }
// }

// //updates password
// export async function PUT(request: Request) {
//   const { userEmail, token, password } = await request.json();
//   console.log("password update request by - ", userEmail);
//   try {
//     const userExists = await prisma.user.findUnique({
//       where: {
//         email: userEmail,
//         resetTokenExpiry: {
//           gt: new Date(),
//         },
//       },
//       select: {
//         id: true,
//         resetToken: true,
//         resetTokenExpiry: true,
//       },
//     });

//     if (!userExists || !userExists.resetToken) {
//       return Response.json(
//         { message: "Not found. Try resetting your password later." },
//         { status: 404 }
//       );
//     }

//     const _isTokenValid = await compareHash(token, userExists.resetToken);
//     //user exists
//     if (!_isTokenValid)
//       return Response.json(
//         { message: "Invalid token. Try Resetting your password later" },
//         { status: 401 }
//       );

//     const updatedUser = await prisma.user.update({
//       where: { id: userExists.id },
//       data: {
//         password: await hash(password),
//         resetToken: null,
//         resetTokenExpiry: null,
//       },
//     });

//     if (!updatedUser)
//       return Response.json(
//         { message: "Password not updated" },
//         { status: 500 }
//       );

//     return Response.json({ message: "Password updated" });
//   } catch (err: any) {
//     console.log("ERROR in route /api/reset-password:\n >", err.message ?? err);
//     return Response.json({ message: "Server error" }, { status: 500 });
//   }
// }
