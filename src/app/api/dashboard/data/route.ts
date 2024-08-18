import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { excludeFields } from "@/helpers/dataHandlers";
import { User } from "@/lib/prisma/types";
export const revalidate = 60; // false | 'force-cache' | 0 | number

async function getHandler(req: Request, user: Partial<User>) {
  // const url = new URL(req.url);
  // const institutionId = url.searchParams.get("institution");
  // retrieve data
  if (!user.institutionIDs || user.institutionIDs.length === 0) {
    return Response.json("No institution assigned", { status: 401 });
  }
  try {
    // GET institutions where
    const institutions_ = await prisma.institution.findMany({
      where: {
        id: {
          in: user.institutionIDs,
        },
      },
    });
    if (institutions_.length === 0) {
      return Response.json("No institutions", { status: 401 });
    }
    // id institution includes Lisa
    const institutions = await prisma.institution.findMany({
      where: !institutions_.map((inst) => inst.name).includes("Lisa")
        ? {
            id: {
              in: user.institutionIDs,
            },
          }
        : {},
      include: {
        cases: true,
        users: true,
        //   caseTypes: true,
      },
    });

    // GET users
    let users: User[] = [];

    if (user.email === "antonio@goweki.com") {
      const instUsers = await prisma.user.findMany({
        include: {
          institutions: true,
          cases: true,
          completedTasks: true,
        },
      });

      users = [
        ...excludeFields(instUsers, [
          "password",
          "resetToken",
          "resetTokenExpiry",
        ]),
      ];
    } else {
      // not suser
      if (user.institutionIDs && user.institutionIDs.length > 0) {
        for (const instID_ of user.institutionIDs) {
          const instUsers = await prisma.user.findMany({
            where: {
              institutionIDs: {
                has: instID_,
              },
              // id: {
              //   not: user.id,
              // },
            },
            include: {
              institutions: true,
              cases: true,
              completedTasks: true,
            },
          });

          users = [
            ...users,
            ...excludeFields(instUsers, [
              "password",
              "resetToken",
              "resetTokenExpiry",
            ]),
          ];
        }
      }
    }

    // GET cases
    const caseQuery: { where: any; include: any } = institutions.some(
      (inst) => inst.name === "Lisa"
    )
      ? {
          where: {},
          include: {
            caseType: true,
            institution: true,
            lawyer: true,
            tasks: true,
          },
        }
      : user.role === "admin"
      ? {
          where: {
            institutionID: {
              in: user.institutionIDs,
            },
          },
          include: {
            caseType: true,
            institution: true,
            lawyer: true,
            tasks: true,
          },
        }
      : {
          where: {
            institutionID: {
              in: user.institutionIDs,
            },
            userID: user.id,
          },
          include: {
            caseType: true,
            institution: true,
            lawyer: true,
            tasks: true,
          },
        };
    const cases = await prisma.case.findMany(caseQuery);

    //Get tasks
    const caseIDs_ = cases.map(({ id }) => id);
    const tasks = await prisma.task.findMany({
      where: {
        id: {
          in: caseIDs_,
        },
      },
      include: {
        documents: true,
        case: true,
        completedBy: true,
      },
    });

    //Get case-types
    const caseTypes = await prisma.caseType.findMany({
      where: {
        OR: [
          {
            institutionID: null,
          },
          {
            institutionID: {
              isSet: false,
            },
          },
          {
            institutionID: {
              in: user.institutionIDs,
            },
          },
        ],
      },
      include: {
        institution: true,
      },
    });

    // HTTP response
    return Response.json({
      success: { institutions, users, caseTypes, cases, tasks },
    });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/dashboard/data GET \n  >> ${error}\n`);
    // return Response.json({ error: "SERVER ERROR" });
    return Response.json("Server error", { status: 500 });
  }
}

export const GET = withAuthGeneral(getHandler);
