import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";

export class CasesTools {
  constructor(private user: UserContext) {
    if (!user) {
      throw new Error("User context is required to initialize CasesTools.");
    }
  }

  @ToolDecorator({
    docstring: `Creates a new case. 
System admins can create cases for any institution.
Institution admins can create cases only for their institution.

Parameters:
- institutionId: Institution ID (required)
- caseTypeId: Case type ID (required)
- name: Name of the case (required)
- description: Optional case description
- clientParty: Name of client party (required)
- clientName: Name of the client (required)
- clientIdNumber: Client ID number (optional)
- clientTel: Client telephone number (required)
- clientEmail: Client email (optional)
- otherPartyName: Name of other party (optional)
- otherPartyTel: Telephone of other party (optional)
- otherPartyEmail: Email of other party (optional)
- otherPartyDescription: Description of other party (optional)
- court: Court name (optional)`,
    parameters: {
      institutionId: {
        type: "string",
        description: "Institution ID (required)",
      },
      caseTypeId: { type: "string", description: "Case type ID (required)" },
      name: { type: "string", description: "Name of the case (required)" },
      description: { type: "string", description: "Description (optional)" },
      clientParty: {
        type: "string",
        description: "Client party name (required)",
      },
      clientName: { type: "string", description: "Client name (required)" },
      clientIdNumber: {
        type: "string",
        description: "Client ID number (optional)",
      },
      clientTel: { type: "string", description: "Client telephone (required)" },
      clientEmail: { type: "string", description: "Client email (optional)" },
      otherPartyName: {
        type: "string",
        description: "Other party name (optional)",
      },
      otherPartyTel: {
        type: "string",
        description: "Other party telephone (optional)",
      },
      otherPartyEmail: {
        type: "string",
        description: "Other party email (optional)",
      },
      otherPartyDescription: {
        type: "string",
        description: "Other party description (optional)",
      },
      court: { type: "string", description: "Court name (optional)" },
    },
  })
  async addCase(params: any): Promise<string> {
    const requiredFields = [
      "institutionId",
      "caseTypeId",
      "name",
      "clientParty",
      "clientName",
      "clientTel",
    ];
    for (const field of requiredFields) {
      if (!params[field]) return `${field} is required.`;
    }

    if (!this.user.systemAdmin) {
      const institutionRole = this.user.institutions.find(
        ({ id }) => id === params.institutionId
      )?.role;
      if (institutionRole !== "ADMIN") {
        return "You do not have permission to create cases for this institution.";
      }
    }

    const caseRecord = await prisma.case.create({
      data: {
        ...params,
        createdById: this.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: `Case: ${caseRecord.name}`,
        entityId: caseRecord.id,
        userId: this.user.id,
        details: params,
      },
    });

    return `Case created with ID: ${caseRecord.id}`;
  }

  @ToolDecorator({
    docstring: `Edits an existing case.
System admins can edit any case.
Institution admins can edit cases in their institution.
Assignees can only update case status.

Parameters:
- id: Case ID (required)
- name: New case name (optional)
- description: New description (optional)
- status: New case status (optional)
- assigneeId: Assign to a user (optional)
- court: Court name (optional)`,
    parameters: {
      id: { type: "string", description: "Case ID (required)" },
      name: { type: "string", description: "New name (optional)" },
      description: {
        type: "string",
        description: "New description (optional)",
      },
      status: { type: "string", description: "New case status (optional)" },
      assigneeId: {
        type: "string",
        description: "Assign to user ID (optional)",
      },
      court: { type: "string", description: "Court name (optional)" },
    },
  })
  async editCase(id?: string, updates: any = {}): Promise<string> {
    if (!id) return "Case ID is required.";

    const caseRecord = await prisma.case.findUnique({ where: { id } });
    if (!caseRecord) return "Case not found.";

    if (!this.user.systemAdmin) {
      const institutionRole = this.user.institutions.find(
        ({ id }) => id === caseRecord.institutionId
      )?.role;

      if (institutionRole === "ADMIN") {
        // Admin can edit anything
      } else if (caseRecord.assigneeId === this.user.id) {
        // Assignee can only change status
        const allowedKeys = ["status"];
        updates = Object.fromEntries(
          Object.entries(updates).filter(([k]) => allowedKeys.includes(k))
        );
      } else {
        return "You do not have permission to edit this case.";
      }
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updates,
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: `Case: ${updatedCase.name}`,
        entityId: updatedCase.id,
        userId: this.user.id,
        details: updates,
      },
    });

    return `Case ${updatedCase.id} updated successfully.`;
  }

  @ToolDecorator({
    docstring: `Deletes a case permanently.
Only system admins can delete cases.

Parameters:
- id: Case ID (required)`,
    parameters: {
      id: { type: "string", description: "Case ID (required)" },
    },
  })
  async deleteCase(id?: string): Promise<string> {
    if (!id) return "Case ID is required.";

    if (!this.user.systemAdmin) {
      return "Only system administrators can delete cases.";
    }

    const caseRecord = await prisma.case.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: `Case: ${caseRecord.name}`,
        entityId: caseRecord.id,
        userId: this.user.id,
      },
    });

    return `Case ${caseRecord.id} permanently deleted.`;
  }

  @ToolDecorator({
    docstring: `Lists all cases visible to the current user.
System admins see all cases.
Institution admins see all cases in their institution.
Regular users see only cases they are assigned to.`,
    parameters: {},
  })
  async listCases(): Promise<string> {
    let cases;

    if (this.user.systemAdmin) {
      cases = await prisma.case.findMany();
    } else {
      const institutionIds = this.user.institutions.map((i) => i.id);
      cases = await prisma.case.findMany({
        where: {
          OR: [
            { institutionId: { in: institutionIds } },
            { assigneeId: this.user.id },
          ],
        },
      });
    }

    if (!cases.length) return "No cases found.";

    return cases.map((c) => `- ${c.name} (${c.status}) [${c.id}]`).join("\n");
  }
}
