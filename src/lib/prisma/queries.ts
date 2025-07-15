import { hash, generateRandom } from "@/helpers/passwordHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { PrismaClient, userRole } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(userData: {
  names: string;
  email: string;
  institutionName?: string;
  institutionId?: string;
}) {
  const {
    names,
    email,
    institutionId: _institutionId,
    institutionName,
  } = userData;
  if (!_institutionId && !institutionName) {
    throw new Error("Institution ID or Name is required");
  }

  try {
    // 1. Ensure Institution
    let institutionId: string | null = null;
    if (userData.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: userData.institutionId },
      });
      if (!institution) {
        throw new Error("Institution not found");
      }
      institutionId = institution.id;
    } else if (institutionName) {
      const newInstitution = await prisma.institution.create({
        data: {
          name: institutionName,
        },
      });
      institutionId = newInstitution.id;
    }

    if (!institutionId) {
      throw new Error("Failed to create or find institution");
    }

    // 2. Create the new User
    const resetToken = await generateRandom(11);
    const hashedResetToken = await hash(resetToken);
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    const newUser = await prisma.user.create({
      data: {
        names,
        email,
        resetToken: hashedResetToken,
        resetTokenExpiry: passwordResetExpires,
      },
    });

    console.log("Created User:", newUser);

    // 3. Link the new User to the new Institution via the InstitutionUser join table
    const institutionUserLink = await prisma.institutionUser.create({
      data: {
        institutionId,
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
      institutionId,
      onboardingURL: resetURL,
    };
  } catch (error: any) {
    console.error("Error creating institution and user:", error);
    throw error.message || "Failed to create institution and user";
  }
}

// async function updatePassword(userData: any) {
//   try {
//   } catch (error) {
//     console.error("Error updating password:", error);
//     throw error;
//   }
// }
