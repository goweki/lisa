import prisma from "@/lib/prisma/prisma";
import { SessionUser } from "@/types/next-auth";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { z } from "zod";
import { addMonths } from "date-fns";

// Schema to validate body
const BodySchema = z.object({
  institutionId: z.string().uuid(),
  amount: z.number().positive(),
  providerTransactionId: z.string().min(3),
  paymentMethod: z.string().default("paystack"),
  description: z.string().optional(),
  subscriptionId: z.string().uuid().optional(),
  metadata: z.any().optional(),
});

// Main handler
async function postHandler(req: Request, user: SessionUser) {
  const json = await req.json();
  const parsed: = BodySchema.safeParse(json);

  if (!parsed.success) {
    console.error("Error parsing payment ", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }

  const {
    institutionId,
    subscriptionId: incomingSubId,
    amount,
    providerTransactionId,
    paymentMethod,
    description,
    metadata,
  } = parsed.data;

  const metadataWithAudit = {
    ...metadata,
    submittedBy: user.id,
    submittedAt: new Date().toISOString(),
  };

  // 🔐 Ensure user is linked to institution
  const instUsers = await prisma.institutionUser.findMany({
    where: { userId: user.id },
    select: { institutionId: true },
  });

  const allowedInstitutionIds = instUsers.map((i) => i.institutionId);

  if (!allowedInstitutionIds.includes(institutionId)) {
    return Response.json(
      "You are not authorized to submit payments for this institution",
      { status: 403 }
    );
  }

  // 🚫 Prevent duplicate transactions
  const exists = await prisma.paymentTransaction.findUnique({
    where: { providerTransactionId },
  });

  if (exists) {
    return Response.json("Transaction already exists", { status: 409 });
  }

  let finalSubId = incomingSubId;

  // 🆕 If no subscriptionId is provided, create one if necessary
  if (!finalSubId) {
    const existingSub = await prisma.subscription.findFirst({
      where: {
        institutionId,
        status: "ACTIVE",
      },
    });

    if (existingSub) {
      finalSubId = existingSub.id;
    } else {
      const planId = metadata?.planId;

      if (!planId) {
        return Response.json("Missing planId in metadata", { status: 400 });
      }

      const newSub = await prisma.subscription.create({
        data: {
          institutionId,
          planId,
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: addMonths(new Date(), 1), // Adjust as needed
        },
      });

      finalSubId = newSub.id;
    }
  }

  // 💾 Create payment transaction
  try {
    const tx = await prisma.paymentTransaction.create({
      data: {
        institutionId,
        subscriptionId: finalSubId,
        amount,
        providerTransactionId,
        paymentMethod,
        description,
        metadata: JSON.stringify(metadataWithAudit),
        status: "SUCCEEDED", // Or "PENDING" until Paystack webhook confirms
      },
    });

    return Response.json(tx);
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    return Response.json("Internal server error", { status: 500 });
  }
}

export const POST = withAuthGeneral(postHandler);
