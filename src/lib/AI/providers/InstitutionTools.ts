import { ToolDecorator } from "../decorators/ToolDecorator";

export class InstitutionTools {
  @ToolDecorator({
    docstring: `Adds, edits, or deletes an institution based on the provided action.

Parameters:
- action: One of "add", "edit", or "delete".
- id: (Required for edit/delete) Institution ID.
- name: (Optional) Name of the institution.
- type: (Optional) Type/category of the institution.
- address: (Optional) Physical address of the institution.`,
    parameters: {
      action: {
        type: "string",
        description: `"add", "edit", or "delete"`,
      },
      id: {
        type: "string",
        description: "Institution ID (required for edit or delete)",
      },
      name: {
        type: "string",
        description: "Institution name (optional)",
      },
      type: {
        type: "string",
        description: "Institution type or category (optional)",
      },
      address: {
        type: "string",
        description: "Physical address (optional)",
      },
    },
  })
  async modifyInstitution(
    action: string,
    id?: string,
    name?: string,
    type?: string,
    address?: string
  ): Promise<string> {
    try {
      switch (action.toLowerCase()) {
        case "add": {
          const res = await fetch("/api/dashboard/institution", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              type,
              address,
            }),
          });
          const result = await res.json();
          if (!res.ok) return `Error adding institution: ${result.message}`;
          return `Institution added with ID: ${result.id}`;
        }

        case "edit": {
          if (!id) return "Institution ID is required to edit.";
          const res = await fetch(`/api/dashboard/institution/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              type,
              address,
            }),
          });
          const result = await res.json();
          if (!res.ok) return `Error updating institution: ${result.message}`;
          return `Institution ${id} updated successfully.`;
        }

        case "delete": {
          if (!id) return "Institution ID is required to delete.";
          const res = await fetch(`/api/dashboard/institution/${id}`, {
            method: "DELETE",
          });
          const result = await res.json();
          if (!res.ok) return `Error deleting institution: ${result.message}`;
          return `Institution ${id} deleted successfully.`;
        }

        default:
          return `Invalid action: ${action}. Must be one of "add", "edit", or "delete".`;
      }
    } catch (error: any) {
      return `Unexpected error: ${error.message}`;
    }
  }
}
