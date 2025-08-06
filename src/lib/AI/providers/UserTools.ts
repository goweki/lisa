import { ToolDecorator } from "../decorators/ToolDecorator";

export class UserTools {
  @ToolDecorator({
    docstring: `Adds, edits, or deletes a user in the system.

Parameters:
- action: One of "add", "edit", or "delete".
- id: (Required for edit/delete) User ID.
- names: (Optional) Full name of the user.
- email: (Optional) User email address.
- tel: (Optional) Phone number.
- password: (Optional) Password.
- status: (Optional) Account status (e.g., "ACTIVE", "DORMANT").
- systemAdmin: (Optional) Whether the user is an admin (true/false).`,
    parameters: {
      action: { type: "string", description: `"add", "edit", or "delete"` },
      id: { type: "string", description: "User ID (required for edit/delete)" },
      names: { type: "string", description: "User's full name (optional)" },
      email: { type: "string", description: "Email address (optional)" },
      tel: { type: "string", description: "Phone number (optional)" },
      password: { type: "string", description: "User password (optional)" },
      status: { type: "string", description: "Account status (optional)" },
      systemAdmin: {
        type: "boolean",
        description: "Whether the user is a system admin (optional)",
      },
    },
  })
  async modifyUser(
    action: string,
    id?: string,
    names?: string,
    email?: string,
    tel?: string,
    password?: string,
    status?: string,
    systemAdmin?: boolean
  ): Promise<string> {
    try {
      const payload = {
        names,
        email,
        tel,
        password,
        status,
        systemAdmin,
      };

      switch (action.toLowerCase()) {
        case "add": {
          const res = await fetch("/api/dashboard/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          if (!res.ok) return `Error adding user: ${result.message}`;
          return `User added with ID: ${result.id}`;
        }

        case "edit": {
          if (!id) return "User ID is required to edit.";
          const res = await fetch(`/api/dashboard/user/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          if (!res.ok) return `Error updating user: ${result.message}`;
          return `User ${id} updated successfully.`;
        }

        case "delete": {
          if (!id) return "User ID is required to delete.";
          const res = await fetch(`/api/dashboard/user/${id}`, {
            method: "DELETE",
          });
          const result = await res.json();
          if (!res.ok) return `Error deleting user: ${result.message}`;
          return `User ${id} deleted successfully.`;
        }

        default:
          return `Invalid action: ${action}. Must be one of "add", "edit", or "delete".`;
      }
    } catch (error: any) {
      return `Unexpected error: ${error.message}`;
    }
  }
}
