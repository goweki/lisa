import prisma from "../../src/lib/prisma/prisma";

export async function seedCaseTypes() {
  const institution = await prisma.institution.findUnique({
    where: { name: "Justice League" },
  });

  if (institution) {
    const caseTypes = [
      {
        name: "Criminal Case",
        primaryParty: "Prosecution",
        secondaryParty: "Defendant",
        institutionId: institution.id,
      },
      {
        name: "Civil Case",
        primaryParty: "Plaintiff",
        secondaryParty: "Defendant",
        institutionId: institution.id,
      },
    ];

    for (const caseType of caseTypes) {
      await prisma.caseType.upsert({
        where: { name: caseType.name },
        update: caseType,
        create: caseType,
      });
    }
  }
}
