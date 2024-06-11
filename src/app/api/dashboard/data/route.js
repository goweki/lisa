import prisma from "@/lib/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
export const revalidate = 60; // false | 'force-cache' | 0 | number

async function getHandler(req, user) {
  const url = new URL(req.url);
  const institutionId = url.searchParams.get("institution");
  // validation checks
  if (!user.institutionIDs.includes(institutionId))
    Response.json("Forbidden", { status: 403 });
  // retrieve data
  try {
    console.log(
      `........................\nGET REQUEST /api/dashboard/data\n > institution: ${institutionId}`
    );
    // GET institution
    const institutions_ = await prisma.institution.findMany({
      where: {
        id: {
          in: user.institutionIDs,
        },
      },
    });
    if (institutions_.length < 1)
      Response.json("No institutions", { status: 401 });
    const _institution = institutions_[0];
    const institutions = await prisma.institution.findMany({
      where: _institution.name !== "Lisa" ? { id: institutionId } : {},
      include: {
        cases: true,
      },
    });

    // GET users
    let users = [];
    for (const inst of institutions) {
      const instUsers = await prisma.user.findMany({
        where: {
          institutionIDs: {
            has: inst.id,
          },
          id: {
            not: user.id,
          },
        },
        include: {
          institutions: true,
        },
      });

      users = [...users, ...instUsers];
    }

    // GET cases
    const cases = await prisma.case.findMany(
      institutions.some((inst) => inst.name === "Lisa")
        ? {
            include: {
              caseType: true,
              institution: true,
              lawyer: true,
              tasks: true,
            },
          }
        : {
            where: {
              institutionID: institutionId,
            },
            include: {
              caseType: true,
              institution: true,
              lawyer: true,
              tasks: true,
            },
          }
    );
    //Get case-types
    const caseTypes = await prisma.caseType.findMany({});
    // institutions.forEach((inst) => delete inst.userIDs);
    // HTTP response
    return Response.json({
      success: { caseTypes, cases, institutions, users },
    });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/dashboard/data GET \n  >> ${error}\n`);
    // return Response.json({
    //   error: "SERVER ERROR: Did not fetch data",
    // });
    return Response.json({ status: 500 }, "Server error");
  }
}

export const GET = withAuthGeneral(getHandler);
