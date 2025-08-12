import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";
import { TaskType, UserRole } from "@prisma/client";
import { Case, Task } from "@/types/models";

export class TasksTools {
  private tasks: any[] = [];
  private cases: any[] = [];

  constructor(private user: UserContext) {
    if (!user) {
      throw new Error("You need to be a registered user to use TasksTools.");
    }
  }

  async init() {
    await this.loadCases();
    await this.loadTasks();
  }

  private async loadTasks() {
    const cases = await prisma.case.findMany({
      where: this.user?.systemAdmin ? {} : { assigneeId: this.user?.id },
      include: { tasks: { include: { case: true } } },
    });
    this.cases = cases;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ assigneeId: this.user?.id }, { completedById: this.user?.id }],
      },
      include: { case: true },
    });

    // Merge case tasks + directly fetched tasks
    const allTasks = [...cases.flatMap((c) => c.tasks), ...tasks];

    // Remove duplicates (if any)
    const uniqueTasks = Array.from(
      new Map(allTasks.map((t) => [t.id, t])).values()
    );

    this.tasks = uniqueTasks;
  }

  private async loadCases() {
    const cases = await prisma.case.findMany({
      where: this.user?.systemAdmin ? {} : { assigneeId: this.user?.id },
      include: { tasks: true },
    });
    this.cases = cases;
  }

  @ToolDecorator({
    docstring: `Lists all tasks user has access to.`,
    parameters: undefined,
  })
  async listTasks(): Promise<string> {
    // If no tasks, return a friendly message
    if (this.tasks.length === 0) {
      return "✅ User has no assigned or completed tasks at the moment.";
    }

    return this.tasks
      .map(
        (t) =>
          `- ${t.name} [${t.type}] with id:${t.id}, due: ${t.dueDate?.toDateString() || "No due date"} ${
            t.description ? `- ${t.description}` : ""
          }`
      )
      .join("\n");
  }

  @ToolDecorator({
    docstring: `Adds a task to a case.`,
    parameters: {
      caseId: {
        type: "string",
        description: "id of the case associated with new task (required)",
      },
      name: {
        type: "string",
        description: "Name of task to be created (required)",
      },
      dueDate: {
        type: "string",
        description: "Due date of the new task in ISO format (required)",
      },
      type: {
        type: "string",
        description: `Task Type (optional): valid types:${JSON.stringify(TaskType)}`,
      },
      description: {
        type: "string",
        description: "Optional task details and more info",
      },
    },
  })
  async addTask(
    caseId: string,
    name: string,
    dueDate: string,
    type?: string,
    description?: string
  ): Promise<string> {
    await this.loadCases();
    if (!this.cases.find(({ id }) => id === caseId))
      return "Case not found: Invalid caseId";

    const task = await prisma.task.create({
      data: {
        caseId,
        name,
        type: (type as TaskType) || "OTHER",
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
    const task = this.tasks.find(({ id }) => id === taskId);
    if (!task) return "Task not found.";

    await prisma.task.update({
      where: { id: task.id },
      data: { completedById: this.user?.id },
    });

    return `Task ${taskId} marked as completed.`;
  }
}
