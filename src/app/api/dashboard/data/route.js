import prisma from "@/lib/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
export const revalidate = 60; // false | 'force-cache' | 0 | number

export async function getHandler(req, user) {
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
    const _institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    });

    const institutions = await prisma.institution.findMany({
      where: _institution.name !== "Lisa" ? { id: institutionId } : {},
      include: {
        cases: true,
      },
    });

    // GET users
    let users = [];
    for (const inst of institutions) {
      users = [
        ...(await prisma.user.findMany({
          where: {
            institutionIDs: {
              has: inst.id,
            },
          },
        })),
      ];
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
