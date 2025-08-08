import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";
import { TaskType } from "@prisma/client";

export class TasksTools {
  constructor(private user: UserContext) {
    if (!user) {
      throw new Error("User context is required to initialize TasksTools.");
    }
  }

  private async canAccessCase(caseId: string) {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { institutionId: true, assigneeId: true, createdById: true },
    });

    if (!caseData) return false;

    if (this.user.systemAdmin) return true;
    if (
      this.user.institutions.some(
        (i) => i.id === caseData.institutionId && i.role === "ADMIN"
      )
    )
      return true;
    if (caseData.assigneeId === this.user.id) return true;
    if (caseData.createdById === this.user.id) return true;

    return false;
  }

  @ToolDecorator({
    docstring: `Lists all tasks for a specific case.`,
    parameters: {
      caseId: { type: "string", description: "The case ID to list tasks for" },
    },
  })
  async listTasks(caseId: string): Promise<string> {
    if (!caseId) return "Case ID is required.";
    if (!(await this.canAccessCase(caseId)))
      return "You do not have permission to view this case.";

    const tasks = await prisma.task.findMany({ where: { caseId } });

    if (!tasks.length) return "No tasks found for this case.";

    return tasks
      .map(
        (t) =>
          `- ${t.name} [${t.type}] Due: ${t.dueDate.toDateString()} ${t.description ? `- ${t.description}` : ""}`
      )
      .join("\n");
  }

  @ToolDecorator({
    docstring: `Adds a task to a case.`,
    parameters: {
      caseId: { type: "string", description: "Case ID (required)" },
      name: { type: "string", description: "Task name (required)" },
      type: {
        type: "string",
        description: "Task type (required): EVENT or DOCUMENT",
      },
      dueDate: {
        type: "string",
        description: "Due date in ISO format (required)",
      },
      description: { type: "string", description: "Optional task details" },
    },
  })
  async addTask(
    caseId: string,
    name: string,
    type: string,
    dueDate: string,
    description?: string
  ): Promise<string> {
    if (!(await this.canAccessCase(caseId)))
      return "You do not have permission to add tasks to this case.";

    const task = await prisma.task.create({
      data: {
        caseId,
        name,
        type: type as TaskType,
        dueDate: new Date(dueDate),
        description,
      },
    });

    return `Task '${task.name}' added to case ${caseId}.`;
  }

  @ToolDecorator({
    docstring: `Marks a task as completed.`,
    parameters: {
      taskId: { type: "string", description: "Task ID (required)" },
    },
  })
  async completeTask(taskId: string): Promise<string> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { caseId: true },
    });

    if (!task) return "Task not found.";
    if (!(await this.canAccessCase(task.caseId)))
      return "You do not have permission to complete this task.";

    await prisma.task.update({
      where: { id: taskId },
      data: { completedById: this.user.id },
    });

    return `Task ${taskId} marked as completed.`;
  }
}
