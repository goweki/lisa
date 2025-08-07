//     async listTasks(): Promise<string> {
//         const { data, error } = await supabase
//             .from("tasks")
//             .select("*");
//         if (error) {
//             return `Error listing tasks: ${error.message}`;
//         }
//         if (!data || data.length === 0) {
//             return "No tasks found.";
//         }
//         let summary = `Found ${data.length} tasks:\n`;
//         data.forEach((task: any) => {
//             summary += `ID: ${task.id}, Description: ${task.description}, Due: ${task.due_date || "N/A"}, Status: ${task.status}\n`;
//         });
//         return summary;
//     }

import { TaskType } from "@prisma/client";
import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";

export class TaskTools {
  @ToolDecorator({
    docstring: `Adds, edits, or deletes a task based on the action provided.

Parameters:
- action: One of "add", "edit", or "delete".
- id: (Required for edit/delete) ID of the task.
- description: (Optional) Task description.
- dueDate: (Optional) Due date in YYYY-MM-DD format.
- status: (Optional) Task status (e.g., "pending", "completed").`,
    parameters: {
      action: {
        type: "string",
        description: `"add", "edit", or "delete"`,
      },
      id: {
        type: "string",
        description: "Task ID (required for edit or delete)",
      },
      description: {
        type: "string",
        description: "Task description (optional)",
      },
      dueDate: {
        type: "string",
        description: "Due date (YYYY-MM-DD) (optional)",
      },
      status: {
        type: "string",
        description: "Task status (optional)",
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
    status?: string
  ): Promise<string> {
    try {
      switch (action.toLowerCase()) {
        case "add": {
          if (!name || !type || !caseId || !dueDate)
            return `Required parameters missing`;
          const newTask = await prisma.task.create({
            data: {
              name,
              type,
              caseId,
              description: description || "",
              dueDate: new Date(dueDate),
            },
          });
          return `Task added with ID: ${newTask.id}`;
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
            },
          });

          return `Task ${updatedTask.id} updated successfully.`;
        }

        case "delete": {
          if (!id) return "Task ID is required to delete a task.";

          await prisma.task.delete({
            where: { id },
          });

          return `Task ${id} deleted successfully.`;
        }

        default:
          return `Invalid action: ${action}. Must be one of "add", "edit", or "delete".`;
      }
    } catch (error: any) {
      return `Unexpected error: ${error.message}`;
    }
  }
}
