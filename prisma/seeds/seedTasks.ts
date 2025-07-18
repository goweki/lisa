import prisma from "../../src/lib/prisma/prisma";

export async function seedTasks() {
  const legalCase = await prisma.case.findFirst({
    where: { name: "State vs Joker" },
  });
  if (!legalCase) return;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  await prisma.task.createMany({
    data: [
      {
        name: "Prepare Witness List",
        type: "document",
        dueDate,
        caseID: legalCase.id,
      },
      {
        name: "Court Hearing",
        type: "event",
        dueDate,
        description: "Scheduled court hearing for Joker",
        caseID: legalCase.id,
      },
    ],
  });
}
