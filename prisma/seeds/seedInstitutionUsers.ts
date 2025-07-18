import prisma from "../../src/lib/prisma/prisma";

export async function seedInstitutionUsers() {
  const user = await prisma.user.findUnique({
    where: { email: "lisa1@goweki.com" },
  });
  const institution = await prisma.institution.findUnique({
    where: { name: "Justice League" },
  });

  if (user && institution) {
    await prisma.institutionUser.upsert({
      where: {
        institutionId_userId: {
          institutionId: institution.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        institutionId: institution.id,
        role: "admin",
      },
    });
  }
}
