import { hash, generateRandom } from "@/helpers/passwordHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { PrismaClient, userRole } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(userData: {
  names: string;
  email: string;
  institutionName?: string;
  institutionIds?: string[];
}) {
  const {
    names,
    email,
    institutionIds: _institutionIds,
    institutionName,
  } = userData;
  if (
    (!_institutionIds && !institutionName) ||
    (_institutionIds && institutionName)
  ) {
    throw new Error("Institution ID -OR- Name is required");
  }

  try {
    let institutionIds: string[] = [];
    if (_institutionIds) {
      const _institutions = await prisma.institution.findMany({
        where: {
          id: {
            in: _institutionIds,
          },
        },
      });
      if (_institutionIds.length !== _institutions.length) {
        throw new Error("Invalid institutions found");
      }
      institutionIds = _institutionIds;
    } else if (institutionName) {
      const newInstitution = await prisma.institution.create({
        data: {
          name: institutionName,
        },
      });
      if (!newInstitution.id) {
        throw new Error("Failed to create institution");
      }
      institutionIds = [newInstitution.id];
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
        institutions: {
          create: institutionIds.map((institutionId) => ({
            institution: {
              connect: { id: institutionId },
            },
            role: institutionName ? userRole.admin : undefined,
          })),
        },
      },
    });

    console.log("Created User:", newUser);

    // 4. send reset password URL
    const resetURL = `${BASE_URL}/reset-password/${resetToken}/?email_=${newUser.email}`;

    return {
      id: newUser.id,
      name: newUser.names,
      email: newUser.email,
      institutionIds,
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
