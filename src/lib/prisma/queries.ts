import { hash, generateRandom } from "@/helpers/passwordHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

/**
 * Creates a new user and optionally a new institution.
 *
 * The user must be associated with either:
 * - Existing institutions via `institutionIds`, or
 * - A new institution via `institutionName`.
 *
 * If a new institution is created, the user is assigned the `admin` role.
 * Otherwise, the default role is assigned during creation.
 *
 * @param userData - Object containing user details and either `institutionIds` or `institutionName`.
 * @returns Object with created user's basic info and reset password URL.
 *
 * @throws Will throw an error if institution input is invalid or user creation fails.
 */
export async function createUser(userData: {
  names: string;
  email: string;
  institutionName?: string;
  institutionCode?: string;
  institutionIds?: string[];
}): Promise<{
  id: string;
  name: string;
  email: string;
  institutionIds: string[];
  onboardingURL: string;
}> {
  const {
    names,
    email,
    institutionIds: _institutionIds,
    institutionName,
    institutionCode,
  } = userData;

  if (
    (!_institutionIds && !institutionName) ||
    (_institutionIds && institutionName)
  ) {
    throw new Error("Institution ID -OR- Name is required (not both).");
  }

  try {
    let institutionIds: string[] = [];

    // Case 1: Use existing institution IDs
    if (_institutionIds) {
      const foundInstitutions = await prisma.institution.findMany({
        where: {
          id: {
            in: _institutionIds,
          },
        },
      });

      if (_institutionIds.length !== foundInstitutions.length) {
        throw new Error("Some provided institution IDs are invalid.");
      }

      institutionIds = _institutionIds;
    }

    // Case 2: Create new institution
    else if (institutionName && institutionCode) {
      const newInstitution = await prisma.institution.create({
        data: {
          code: institutionCode,
          name: institutionName,
        },
      });

      if (!newInstitution?.id) {
        throw new Error("Failed to create new institution.");
      }

      institutionIds = [newInstitution.id];
    }

    // Generate reset token and expiry
    const resetToken = await generateRandom(11);
    const hashedResetToken = await hash(resetToken);
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Create new user
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
            role: institutionName ? UserRole.ADMIN : undefined,
          })),
        },
      },
    });

    const resetURL = `${BASE_URL}/reset-password/${resetToken}/?email_=${encodeURIComponent(newUser.email)}`;

    return {
      id: newUser.id,
      name: newUser.names,
      email: newUser.email,
      institutionIds,
      onboardingURL: resetURL,
    };
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Handle unique constraint error
      console.error("User with this email already exists", error.meta);
      throw {
        code: 409,
        message: `A ${error.meta?.modelName} exists with the same ${JSON.stringify(error.meta?.target)}`,
      };
    }

    console.error("Unexpected error during user creation:", error);
    throw new Error("An unexpected error occurred while creating the user.");
  }
}

/**
 * Checks whether a given institution currently has an active subscription.
 *
 * A subscription is considered active if:
 * - Its `status` is either "ACTIVE" or "TRIALING"
 * - The current date is within the subscription's valid period (`currentPeriodStart` to `currentPeriodEnd`)
 *
 * @param institutionId - The unique identifier of the institution to check for a valid subscription.
 * @returns A Promise that resolves to `true` if an active subscription exists, otherwise `false`.
 *
 * @example
 * const isActive = await hasActiveSubscription("abc123");
 * if (isActive) {
 *   console.log("Institution has an active subscription");
 * } else {
 *   console.log("Institution has no active subscription");
 * }
 */
export async function hasActiveSubscription(
  institutionId: string
): Promise<boolean> {
  const now = new Date();

  const subscription = await prisma.subscription.findFirst({
    where: {
      institutionId,
      status: { in: ["ACTIVE", "TRIALING"] },
      currentPeriodStart: { lte: now },
      currentPeriodEnd: { gte: now },
    },
    select: { id: true },
  });

  return !!subscription;
}

export async function ensureSession({ from }: { from: string }) {
  let session = await prisma.session.findFirst({
    where: { whatsAppNumber: from },
  });

  if (!session || session.expiresAt < new Date()) {
    session = await prisma.session.create({
      data: {
        whatsAppNumber: from,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        context: {},
      },
    });
  }

  return session;
}
