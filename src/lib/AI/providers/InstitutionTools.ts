import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";
import { generateUniqueInstitutionCode } from "@/helpers/stringHandlers";

export class InstitutionTools {
  constructor(private user: UserContext) {
    if (!user) {
      throw new Error(
        "User context is required to initialize InstitutionTools."
      );
    }
  }

  @ToolDecorator({
    docstring: `Creates a new institution and records an audit log.

    Parameters:
    - name: Name of the institution (required).
    - address: Physical address (optional).`,
    parameters: {
      name: {
        type: "string",
        description: "Institution name (required)",
      },
      address: {
        type: "string",
        description: "Physical address (optional)",
      },
    },
  })
  async addInstitution(name?: string, address?: string): Promise<string> {
    if (!name) return "Institution name is required.";

    let institutionCode = "";

    try {
      institutionCode = await generateUniqueInstitutionCode(name);
    } catch (error: any) {
      console.error(error);
      return "could not generate unique institution CODE, try another name or contact admin";
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        code: institutionCode,
        location: address || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: `Institution: ${institution.name}`,
        entityId: institution.id,
        userId: this.user.id,
        details: { name, address },
      },
    });

    return `Institution added with ID: ${institution.id}`;
  }

  @ToolDecorator({
    docstring: `Edits an existing institution. Only users with ADMIN role for the institution can edit.

Parameters:
- id: Institution ID (required).
- name: New name (optional).
- address: New address (optional).`,
    parameters: {
      id: {
        type: "string",
        description: "Institution ID (required)",
      },
      name: {
        type: "string",
        description: "New institution name (optional)",
      },
      address: {
        type: "string",
        description: "New physical address (optional)",
      },
    },
  })
  async editInstitution(
    id?: string,
    name?: string,
    address?: string
  ): Promise<string> {
    if (!id) return "Institution ID is required.";

    const institutionRole = this.user.institutions.find(
      ({ id: instId }) => instId === id
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
        entity: `Institution: ${institution.name}`,
        entityId: institution.id,
        userId: this.user.id,
        details: { name, address },
      },
    });

    return `Institution ${institution.id} updated successfully.`;
  }

  @ToolDecorator({
    docstring: `Deletes an institution permanently. Only system administrators can perform this action.

Parameters:
- id: Institution ID (required).`,
    parameters: {
      id: {
        type: "string",
        description: "Institution ID (required)",
      },
    },
  })
  async deleteInstitution(id?: string): Promise<string> {
    if (!id) return "Institution ID is required.";

    if (!this.user.systemAdmin) {
      return "Only system administrators can delete institutions.";
    }

    const institution = await prisma.institution.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: `Institution: ${institution.name}`,
        entityId: institution.id,
        userId: this.user.id,
      },
    });

    return `Institution ${institution.id} permanently deleted.`;
  }

  @ToolDecorator({
    docstring: `Lists all institutions.`,
    parameters: undefined,
  })
  async listInstitutions(): Promise<string> {
    const institutions = this.user.systemAdmin
      ? await prisma.institution.findMany()
      : await prisma.institution.findMany({
          where: {
            id: {
              in: this.user.institutions.map((inst) => inst.id),
            },
          },
        });

    if (institutions.length === 0) return "No institutions found.";

    return institutions
      .map(
        (inst) =>
          `- ${inst.name} (${inst.id})${inst.location ? ` - ${inst.location}` : ""}`
      )
      .join("\n");
  }
}
