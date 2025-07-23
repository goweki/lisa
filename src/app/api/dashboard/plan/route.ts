import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { SessionUser } from "@/types/next-auth";

async function getHandler(req: Request, user: SessionUser) {
  try {
    const plansWithFeatures = await prisma.plan.findMany({
      where: { isActive: true },
      include: {
        planFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });

    return Response.json(plansWithFeatures);
  } catch (error) {
    console.error(`❌ Error at GET /api/dashboard/plan:`, error);
    return Response.json("Server error", { status: 500 });
  }
}

export const GET = withAuthGeneral(getHandler);
