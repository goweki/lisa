import prisma from "../../src/lib/prisma/prisma";

export async function seedReminders() {
  const task = await prisma.task.findFirst({
    where: { name: "Court Hearing" },
  });

  if (task) {
    await prisma.reminder.create({
      data: {
        taskId: task.id,
        regime: "days",
        count: 1,
        channel: "email",
      },
    });
  }
}
