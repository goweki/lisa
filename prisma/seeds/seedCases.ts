import prisma from "../../src/lib/prisma/prisma";

export async function seedCases() {
  const institution = await prisma.institution.findUnique({
    where: { name: "Justice League" },
  });
  const user = await prisma.user.findUnique({
    where: { email: "lisa1@goweki.com" },
  });
  const caseType = await prisma.caseType.findUnique({
    where: { name: "Criminal Case" },
  });

  if (institution && caseType) {
    await prisma.case.create({
      data: {
        name: "State vs Joker",
        description: "A criminal case involving the Joker",
        clientParty: "State",
        clientName: "Commissioner Gordon",
        clientTel: "+254712345678",
        otherPartyName: "Joker",
        court: "Gotham High Court",
        caseNumber: "CR123456",
        caseTypeID: caseType.id,
        institutionID: institution.id,
        userID: user?.id,
        createdBy: user?.id,
      },
    });
  }
}
