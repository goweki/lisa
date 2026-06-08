import prisma from "@/lib/prisma";
import { SessionUser } from "@/types/next-auth";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { z } from "zod";
import { addMonths } from "date-fns";
import { Packag } from "@/components/payments";
import { paystackPaymentSucceed } from "./_actions";
import { PlanName } from "@prisma/client";

const PackagSchema = z.object({
  name: z.nativeEnum(PlanName),
  planId: z.string().min(9).optional(),
  regime: z.enum(["monthly", "yearly"]),
});

const PaystackPaymentSchema = z.object({
  institutionId: z.string().uuid(),
  amount: z.number().positive(),
  providerTransactionId: z.string().min(3),
  paymentMethod: z.string().default("paystack"),
  description: z.string().optional(),
  subscriptionId: z.string().uuid().optional(),
  packag: PackagSchema,
});

async function postHandler(req: Request, user: SessionUser) {
  const json = await req.json();
  console.log("POST /api/paystack/pay-verify - ", json);

  const parsed = PaystackPaymentSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Invalid body:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }

  const {
    institutionId,
    subscriptionId: incomingSubId,
    amount,
    providerTransactionId,
    paymentMethod,
    description,
    packag: packag_,
  } = parsed.data;

  const packag = packag_;
  const metadataWithAudit = {
    ...packag,
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
      { status: 403 },
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
      const packageName: PlanName = packag?.name;

      let planId = packag?.planId;

      if (!planId && packageName) {
        const plan_ = await prisma.plan.findFirst({
          where: { name: packageName },
        });
        if (!plan_) {
          console.log("Invalid package name - ", packageName);
          return Response.json("Invalid package name", { status: 400 });
        }
        planId = plan_.id;
      }

      if (!planId) {
        return Response.json("Missing planId or invalid packag input", {
          status: 400,
        });
      }

      const subPeriod =
        packag.regime === "monthly"
          ? 1
          : packag.regime === "yearly"
            ? 12
            : null;
      if (!subPeriod) {
        console.log(
          "No subscription period provided in packag.regime",
          packag.regime,
        );
        return Response.json(
          "No subscription period provided in packag.regime",
          { status: 400 },
        );
      }

      const newSub = await prisma.subscription.create({
        data: {
          institutionId,
          planId,
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: addMonths(new Date(), subPeriod), // Adjust as needed
        },
      });

      finalSubId = newSub.id;
    }
  }

  // Check status
  const paymentStatus = await paystackPaymentSucceed(providerTransactionId);

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
        status: paymentStatus,
      },
    });
    return Response.json(tx);
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    return Response.json("Internal server error", { status: 500 });
  }
}

export const POST = withAuthGeneral(postHandler);
