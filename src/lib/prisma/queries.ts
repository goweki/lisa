import crypto from "crypto";
import { BASE_URL } from "@/helpers/getUrl";
import { PrismaClient, userRole } from "@prisma/client";
const prisma = new PrismaClient();

export async function registerUser(userData: {
  names: string;
  email: string;
  institutionName: string;
}) {
  try {
    // 1. Create the new Institution
    const newInstitution = await prisma.institution.create({
      data: {
        name: userData.institutionName,
      },
    });

    console.log("Created Institution:", newInstitution);

    // 2. Create the new User

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 3600000; //1 hr

    const newUser = await prisma.user.create({
      data: {
        names: userData.names,
        email: userData.email,
        resetToken: passwordResetToken,
        resetTokenExpiry: new Date(passwordResetExpires),
      },
    });

    console.log("Created User:", newUser);

    // 3. Link the new User to the new Institution via the InstitutionUser join table
    const institutionUserLink = await prisma.institutionUser.create({
      data: {
        institutionId: newInstitution.id,
        userId: newUser.id,
        role: userRole.admin,
      },
    });

    console.log("Linked User to Institution and role:", institutionUserLink);

    // 4. send reset password URL
    const resetURL = `${BASE_URL}/reset-password/${resetToken}/?email_=${newUser.email}`;

    return {
      name: newUser.names,
      email: newUser.email,
      institutionName: newInstitution.name,
      onboardingURL: resetURL,
    };
  } catch (error) {
    console.error("Error creating institution and user:", error);
    throw error;
  }
}

// async function updatePassword(userData: any) {
//   try {
//   } catch (error) {
//     console.error("Error updating password:", error);
//     throw error;
//   }
// }
