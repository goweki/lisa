import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { excludeFields } from "@/helpers/dataHandlers";
import { User } from "@/types/models";
import { Prisma } from "@prisma/client";
import { SessionUser } from "@/types/next-auth";

export const revalidate = 6;

async function getHandler(req: Request, user: SessionUser) {
  try {
    const isSysAdmin = !!user.systemAdmin;

    const instUsers = await prisma.institutionUser.findMany({
      where: { userId: user.id },
      select: { institutionId: true },
    });

    const instIDs = instUsers.map((i) => i.institutionId);

    // Run institution, users, cases, caseTypes, assignmentRequests in parallel
    const [institutions, rawUsers, cases, caseTypes, assignmentRequests] =
      await Promise.all([
        prisma.institution.findMany({
          where: isSysAdmin ? {} : { id: { in: instIDs } },
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
          : instIDs.length > 0
            ? prisma.user.findMany({
                where: {
                  institutions: {
                    some: {
                      institutionId: { in: instIDs },
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
          where: isSysAdmin ? {} : { institutionID: { in: instIDs } },
          include: {
            caseType: true,
            institution: true,
            lawyer: true,
            tasks: true,
          },
        }),

        prisma.caseType.findMany({
          where: {
            OR: [{ institutionId: null }, { institutionId: { in: instIDs } }],
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
