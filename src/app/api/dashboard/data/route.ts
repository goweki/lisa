import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { excludeFields } from "@/helpers/dataHandlers";
import { User } from "@/types/models";
import { Prisma } from "@prisma/client";
import { SessionUser } from "@/types/next-auth";
import { hasActiveSubscription } from "@/lib/prisma/queries";

export const revalidate = 6;

async function getHandler(req: Request, user: SessionUser) {
  const isSysAdmin = !!user.systemAdmin;

  try {
    const instUsers = await prisma.institutionUser.findMany({
      where: { userId: user.id },
      select: { institutionId: true },
    });

    console.log(
      "All INSTITUTIONS - ",
      instUsers.map(({ institutionId }) => institutionId)
    );

    let instIDs_activeSub: string[] = [];

    for (const instUser_ of instUsers) {
      const instId = instUser_.institutionId;
      if (await hasActiveSubscription(instId)) {
        instIDs_activeSub.push(instUser_.institutionId);
      }
    }

    console.log("ACTIVE INSTITUTIONS - ", instIDs_activeSub);

    if (!isSysAdmin && instIDs_activeSub.length === 0) {
      console.log("");
      return Response.json("Payment required", { status: 402 });
    }

    // Run institution, users, cases, caseTypes, assignmentRequests in parallel
    const [institutions, rawUsers, cases, caseTypes, assignmentRequests] =
      await Promise.all([
        prisma.institution.findMany({
          where: isSysAdmin ? {} : { id: { in: instIDs_activeSub } },
          include: {
            cases: true,
            users: true,
          },
        }),

        isSysAdmin
          ? prisma.user.findMany({
              include: {
                institutions: true,
                cases: true,
                completedTasks: true,
              },
            })
          : instIDs_activeSub.length > 0
            ? prisma.user.findMany({
                where: {
                  institutions: {
                    some: {
                      institutionId: { in: instIDs_activeSub },
                    },
                  },
                },
                include: {
                  institutions: {
                    include: {
                      institution: true,
                    },
                  },
                },
              })
            : [],

        prisma.case.findMany({
          where: isSysAdmin ? {} : { institutionID: { in: instIDs_activeSub } },
          include: {
            caseType: true,
            institution: true,
            lawyer: true,
            tasks: true,
          },
        }),

        prisma.caseType.findMany({
          where: {
            OR: [
              { institutionId: null },
              { institutionId: { in: instIDs_activeSub } },
            ],
          },
          include: {
            institution: true,
          },
        }),

        prisma.assigneeRequest.findMany({
          where: {
            assigneeID: user.id,
          },
        }),
      ]);

    const users = excludeFields(rawUsers, [
      "password",
      "resetToken",
      "resetTokenExpiry",
    ]);

    const tasks = cases.flatMap((c) => c.tasks);

    return Response.json({
      institutions,
      users,
      caseTypes,
      cases,
      tasks,
      assignmentRequests,
    });
  } catch (error) {
    console.error(`❌ Error at GET /api/dashboard/data:`, error);
    return Response.json("Server error", { status: 500 });
  }
}

export const GET = withAuthGeneral(getHandler);
