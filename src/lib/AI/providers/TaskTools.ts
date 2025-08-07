import { TaskType } from "@prisma/client";
import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";

export class TaskTools {
  @ToolDecorator({
    docstring: `Adds, edits, deletes, or lists tasks associated with cases.

Parameters:
- action: One of "list", "add", "edit", or "delete".
- id: (Required for edit/delete) Task ID.
- name: (Required for add/edit) Task name.
- type: (Required for add/edit) Task type (enum from TaskType).
- caseId: (Required for add/edit) Related case ID.
- description: (Optional) Task description.
- dueDate: (Required for add, optional for edit) Due date in YYYY-MM-DD format.
- completedById: (Optional) ID of user who completed the task.`,
    parameters: {
      action: {
        type: "string",
        description: `"list", "add", "edit", or "delete"`,
      },
      id: {
        type: "string",
        description: "Task ID (required for edit or delete)",
      },
      name: {
        type: "string",
        description: "Task name (required for add/edit)",
      },
      type: {
        type: "string",
        description:
          "Task type (enum value from TaskType, required for add/edit)",
      },
      caseId: {
        type: "string",
        description: "Associated case ID (required for add/edit)",
      },
      description: {
        type: "string",
        description: "Task description (optional)",
      },
      dueDate: {
        type: "string",
        description:
          "Due date in YYYY-MM-DD format (required for add, optional for edit)",
      },
      completedById: {
        type: "string",
        description: "User ID who completed the task (optional)",
      },
    },
  })
  async modifyTask(
    action: string,
    id?: string,
    name?: string,
    type?: TaskType,
    caseId?: string,
    description?: string,
    dueDate?: string,
    completedById?: string
  ): Promise<string> {
    try {
      switch (action.toLowerCase()) {
        case "add": {
          if (!name || !type || !caseId || !dueDate) {
            return "Missing required fields for adding a task.";
          }

          const newTask = await prisma.task.create({
            data: {
              name,
              type,
              caseId,
              dueDate: new Date(dueDate),
              description: description || "",
              completedById: completedById || null,
            },
          });

          return `✅ Task "${newTask.name}" created with ID: ${newTask.id}`;
        }

        case "edit": {
          if (!id) return "Task ID is required to edit a task.";

          const updatedTask = await prisma.task.update({
            where: { id },
            data: {
              name: name || undefined,
              type: type || undefined,
              caseId: caseId || undefined,
              dueDate: dueDate ? new Date(dueDate) : undefined,
              description: description ?? undefined,
              completedById: completedById ?? undefined,
            },
          });

          return `✅ Task "${updatedTask.name}" updated successfully.`;
        }

        case "delete": {
          if (!id) return "Task ID is required to delete a task.";

          await prisma.task.delete({
            where: { id },
          });

          return `🗑️ Task ${id} deleted successfully.`;
        }

        case "list": {
          const tasks = await prisma.task.findMany({
            orderBy: { dueDate: "asc" },
            include: {
              case: { select: { name: true } },
              completedBy: { select: { names: true } },
            },
          });

          if (!tasks.length) return "No tasks found.";

          let output = `📝 Found ${tasks.length} tasks:\n`;
          for (const task of tasks) {
            output += `• [${task.id}] ${task.name} (${task.type}) — due ${task.dueDate.toISOString().split("T")[0]}`;
            output += ` | Case: ${task.case?.name || "N/A"}`;
            output += task.completedBy
              ? ` | Completed by: ${task.completedBy.names}`
              : "";
            output += `\n`;
          }

          return output;
        }

        default:
          return `❌ Invalid action "${action}". Must be one of "add", "edit", "delete", or "list".`;
      }
    } catch (error: any) {
      return `❗ Error: ${error.message}`;
    }
  }
}
