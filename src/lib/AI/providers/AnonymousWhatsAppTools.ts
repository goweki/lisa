import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import { TaskType, User } from "@prisma/client";
import { appendPlus } from "@/helpers/telHandlers";

export class AnonymousWhatsAppTools {
  private user: User | null = null;

  constructor(private tel: string) {}

  async init() {
    return await this.loadUser();
  }

  private async loadUser(): Promise<User | null> {
    console.log("loading user: ", appendPlus(this.tel));
    const user_ = await prisma.user.findUnique({
      where: { tel: appendPlus(this.tel) },
      include: { messages: true },
    });
    this.user = user_;
    return user_;
  }

  @ToolDecorator({
    docstring: `Creates a new user over whatsapp self-registration. 

    Parameters: 
    - name: Full name of the user (required)`,
    parameters: {
      name: {
        type: "string",
        description: "Full name of the user (required)",
      },
    },
  })
  async addUserOnWhatsApp(name?: string): Promise<string> {
    if (this.user) {
      return `User is already onboarded. Their name is ${this.user.names}`;
    }

    if (!name || !this.tel) {
      return "User's telephone is obscured. refer them to webapp link.";
    }

    const newUser = await prisma.user.create({
      data: {
        names: name,
        tel: appendPlus(this.tel),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "KOKOSE-USER-CREATE",
        entity: `User: ${newUser.names}`,
        entityId: newUser.id,
        userId: newUser.id,
        details: newUser,
      },
    });

    return `User ${newUser.names} created with ID: ${newUser.id}`;
  }

  @ToolDecorator({
    docstring: `Creates a new task for a WhatsApp User. The user 

  Parameters: 
  - taskName: Name of the task (required)
  - description: details of the task (optional)
  - dueDate: Time when task is expected to be executed
  `,
    parameters: {
      taskName: {
        type: "string",
        description: "Name of the task (required)",
      },
      description: {
        type: "string",
        description: "Details of the task (optional)",
      },
      dueDate: {
        type: "string",
        description: "ISO 8601 datetime string when task is due (optional)",
      },
    },
  })
  async addTask(
    taskName: string,
    description?: string,
    dueDate?: string
  ): Promise<string> {
    if (!this.user) {
      return "User has not been onboarded yet, add user first.";
    }

    if (!taskName) {
      return "Task name is required.";
    }

    // Create the task for the user
    const task = await prisma.task.create({
      data: {
        name: taskName,
        description: description || "",
        assigneeId: this.user.id,
        type: TaskType.OTHER,
        dueDate: dueDate
          ? new Date(dueDate)
          : new Date(Date.now() + 60 * 60 * 1000), // ⏰ default: 1 hour from now
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "TASK-CREATE",
        entity: `Task: ${task.name}`,
        entityId: task.id,
        userId: this.user.id,
        details: task,
      },
    });

    return `Task "${task.name}" created for user ${this.user.names} with due date: ${task.dueDate}`;
  }

  @ToolDecorator({
    docstring: `Marks an existing task as complete for a WhatsApp User. 

  Parameters: 
  - taskId: ID of the task to be marked complete (required)
  `,
    parameters: {
      taskId: {
        type: "number",
        description: "The ID of the task to be marked complete (required)",
      },
    },
  })
  async completeTask(taskId: string): Promise<string> {
    if (!this.user) {
      return "User has no account, add user first.";
    }
    if (!taskId) {
      return "Task ID is required.";
    }

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: taskId, assigneeId: this.user.id },
    });

    if (!task) {
      return `Task with ID ${taskId} not found for user ${this.user.names}.`;
    }

    // Update task to complete
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completedById: this.user.id, completedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        action: "TASK-COMPLETE",
        entity: `Task: ${updatedTask.name}`,
        entityId: updatedTask.id,
        userId: this.user.id,
        details: updatedTask,
      },
    });

    return `Task "${updatedTask.name}" marked as complete ✅`;
  }

  @ToolDecorator({
    docstring: `Deletes an existing task for a WhatsApp User. 

  Parameters: 
  - taskId: ID of the task to be deleted (required)
  `,
    parameters: {
      taskId: {
        type: "number",
        description: "The ID of the task to be deleted (required)",
      },
    },
  })
  async deleteTask(taskId: string): Promise<string> {
    if (!this.user) {
      return "User has no account, add user first.";
    }
    if (!taskId) {
      return "Task ID is required.";
    }

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: taskId, assigneeId: this.user.id },
    });

    if (!task) {
      return `Task with ID ${taskId} not found for user ${this.user.names}.`;
    }

    // Delete task
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    // Log deletion in audit trail
    await prisma.auditLog.create({
      data: {
        action: "TASK-DELETE",
        entity: `Task: ${deletedTask.name}`,
        entityId: deletedTask.id,
        userId: this.user.id,
        details: deletedTask,
      },
    });

    return `Task "${deletedTask.name}" deleted 🗑️`;
  }

  @ToolDecorator({
    docstring: `Lists all tasks for a WhatsApp User. 

  Parameters: 
  - None
  `,
    parameters: {},
  })
  async listTasks(): Promise<string> {
    if (!this.user) {
      return "User has no account, add user first.";
    }

    // Fetch all tasks for this user
    const tasks = await prisma.task.findMany({
      where: { assigneeId: this.user.id },
      orderBy: { createdAt: "asc" },
    });

    if (!tasks.length) {
      return `No tasks found for user ${this.user.names}.`;
    }

    // Format tasks for readability
    const formattedTasks = tasks
      .map(
        (task, index) =>
          `${index + 1}. ${task.name} (ID: ${task.id}) ${
            task.completedAt ? "✅ Completed" : "⏳ Pending"
          }`
      )
      .join("\n");

    return `Here are the tasks for ${this.user.names}:\n${formattedTasks}`;
  }
}
