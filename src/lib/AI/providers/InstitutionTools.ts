import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";

export class InstitutionTools {
  private user: UserContext;

  constructor(user: UserContext) {
    if (!user) {
      throw new Error(
        "User context is required to initialize InstitutionTools."
      );
    }
    this.user = user;
  }

  @ToolDecorator({
    docstring: `Adds, edits, or deletes an institution with permission checks and audit logging.`,
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
        description: "Institution name (required for add)",
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
    address?: string
  ): Promise<string> {
    try {
      const { user } = this;

      switch (action.toLowerCase()) {
        case "add": {
          if (!name) return "Institution name is required.";

          const institution = await prisma.institution.create({
            data: {
              name,
              location: address || undefined,
            },
          });

          await prisma.auditLog.create({
            data: {
              action: "CREATE",
              entity: "Institution",
              entityId: institution.id,
              userId: user.id,
              details: { name, address },
            },
          });

          return `Institution added with ID: ${institution.id}`;
        }

        case "edit": {
          if (!id) return "Institution ID is required.";

          const institutionRole = user.institutions.find(
            ({ id: _id }) => _id === id
          )?.role;

          if (institutionRole !== "ADMIN") {
            return "You do not have permission to edit this institution.";
          }

          const institution = await prisma.institution.update({
            where: { id },
            data: {
              name: name || undefined,
              location: address || undefined,
            },
          });

          await prisma.auditLog.create({
            data: {
              action: "UPDATE",
              entity: "Institution",
              entityId: institution.id,
              userId: user.id,
              details: { name, address },
            },
          });

          return `Institution ${institution.id} updated successfully.`;
        }

        case "delete": {
          if (!id) return "Institution ID is required.";

          if (!user.systemAdmin) {
            return "Only system administrators can delete institutions.";
          }

          const institution = await prisma.institution.delete({
            where: { id },
          });

          await prisma.auditLog.create({
            data: {
              action: "DELETE",
              entity: "Institution",
              entityId: institution.id,
              userId: user.id,
            },
          });

          return `Institution ${institution.id} permanently deleted`;
        }

        default:
          return `Invalid action: ${action}`;
      }
    } catch (error: any) {
      if (error.code === "P2025") {
        return `Institution with ID ${id} not found.`;
      }
      return `Unexpected error: ${error.message}`;
    }
  }
}
