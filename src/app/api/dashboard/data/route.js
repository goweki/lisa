import prisma from "@/lib/prisma";
export const revalidate = 60; // false | 'force-cache' | 0 | number

export async function GET(req) {
  const url = new URL(req.url);
  const institutionId = url.searchParams.get("institution");
  try {
    console.log(
      `........................\nGET REQUEST /api/dashboard/data\n > institution: ${institutionId}`
    );
    // check institution
    const institutions = await prisma.institution.findMany({
      where: { id: institutionId },
    });
    // console.log("institutiuon: ", institution);
    // FIND Docs
    const cases = await prisma.case.findMany(
      institutions.some((inst) => inst.name === "Lisa")
        ? {}
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
    const caseTypes = await prisma.caseType.findMany({});
    institutions.forEach((inst) => delete inst.userIDs);
    // HTTP response
    return Response.json({
      success: { caseTypes, cases, institutions },
    });
  } catch (error) {
    // handle ERROR if caught
    console.log(`> Error caught at api/dashboard/data GET \n >> ${error}\n`);
    return Response.json({
      error: "Could not fetch data",
    });
  }
}
