import { CaseStatus } from "@prisma/client";
import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";

export class CaseTools {
  @ToolDecorator({
    docstring: `Lists, adds, edits, or deletes a legal case.

Parameters:
- action: One of "list", "add", "edit", or "delete".
- id: (Required for edit/delete) ID of the case.
- name: (Required for add/edit) Case name.
- caseNumber: (Optional) Case number.
- description: (Optional) Case description.
- status: (Optional for edit) Case status (e.g., "OPEN", "CLOSED").
- clientName: (Required for add/edit) Client full name.
- clientParty: (Required for add/edit) Client party description.
- clientIdNumber, clientTel, clientEmail: (Optional) Client contact info.
- otherPartyName, otherPartyTel, otherPartyEmail, otherPartyDescription: (Optional) Opposing party info.
- court: (Optional) Court name.
- caseTypeId: (Required for add/edit) ID of the related case type.
- institutionId: (Required for add/edit) ID of the institution.
- createdById: (Required for add) User ID of the creator.
- assigneeId: (Optional for add/edit) User ID of the assignee.`,
    parameters: {
      action: {
        type: "string",
        description: `"list", "add", "edit", or "delete"`,
      },
      id: {
        type: "string",
        description: "Case ID (required for edit or delete)",
      },
      name: {
        type: "string",
        description: "Case name (required for add/edit)",
      },
      caseNumber: {
        type: "string",
        description: "Case number (optional)",
      },
      description: {
        type: "string",
        description: "Case description (optional)",
      },
      status: {
        type: "string",
        description: "Case status (optional, e.g., OPEN, CLOSED)",
      },
      clientParty: {
        type: "string",
        description: "Client party (required for add/edit)",
      },
      clientName: {
        type: "string",
        description: "Client name (required for add/edit)",
      },
      clientIdNumber: {
        type: "string",
        description: "Client ID number (optional)",
      },
      clientTel: {
        type: "string",
        description: "Client phone number (optional)",
      },
      clientEmail: {
        type: "string",
        description: "Client email (optional)",
      },
      otherPartyName: {
        type: "string",
        description: "Other party name (optional)",
      },
      otherPartyTel: {
        type: "string",
        description: "Other party phone (optional)",
      },
      otherPartyEmail: {
        type: "string",
        description: "Other party email (optional)",
      },
      otherPartyDescription: {
        type: "string",
        description: "Other party description (optional)",
      },
      court: {
        type: "string",
        description: "Court name (optional)",
      },
      caseTypeId: {
        type: "string",
        description: "Case type ID (required for add/edit)",
      },
      institutionId: {
        type: "string",
        description: "Institution ID (required for add/edit)",
      },
      createdById: {
        type: "string",
        description: "Creator user ID (required for add)",
      },
      assigneeId: {
        type: "string",
        description: "Assignee user ID (optional)",
      },
    },
  })
  async modifyCase(
    action: string,
    id?: string,
    name?: string,
    caseNumber?: string,
    description?: string,
    status?: CaseStatus,
    clientName?: string,
    clientParty?: string,
    clientIdNumber?: string,
    clientTel?: string,
    clientEmail?: string,
    otherPartyName?: string,
    otherPartyTel?: string,
    otherPartyEmail?: string,
    otherPartyDescription?: string,
    court?: string,
    caseTypeId?: string,
    institutionId?: string,
    createdById?: string,
    assigneeId?: string
  ): Promise<string> {
    try {
      switch (action.toLowerCase()) {
        case "add": {
          if (
            !name ||
            !clientName ||
            !clientParty ||
            !caseTypeId ||
            !institutionId ||
            !createdById ||
            !clientTel
          ) {
            return "Missing required fields for case creation.";
          }

          const newCase = await prisma.case.create({
            data: {
              name,
              caseNumber,
              description,
              status: status ?? "OPEN",
              clientName,
              clientParty,
              clientIdNumber,
              clientTel,
              clientEmail,
              otherPartyName,
              otherPartyTel,
              otherPartyEmail,
              otherPartyDescription,
              court,
              caseTypeId,
              institutionId,
              createdById,
              assigneeId,
            },
          });

          return `✅ Case "${newCase.name}" created with ID: ${newCase.id}`;
        }

        case "edit": {
          if (!id) return "Case ID is required to edit a case.";

          const updatedCase = await prisma.case.update({
            where: { id },
            data: {
              name: name || undefined,
              caseNumber,
              description,
              status,
              clientName,
              clientParty,
              clientIdNumber,
              clientTel,
              clientEmail,
              otherPartyName,
              otherPartyTel,
              otherPartyEmail,
              otherPartyDescription,
              court,
              caseTypeId,
              institutionId,
              assigneeId,
            },
          });

          return `✅ Case "${updatedCase.name}" updated successfully.`;
        }

        case "delete": {
          if (!id) return "Case ID is required to delete a case.";

          await prisma.case.delete({
            where: { id },
          });

          return `🗑️ Case ${id} deleted successfully.`;
        }

        case "list": {
          const cases = await prisma.case.findMany({
            include: { tasks: true },
            orderBy: { createdAt: "desc" },
          });

          if (!cases.length) return "No cases found.";

          let output = `📁 Found ${cases.length} cases:\n`;
          for (const c of cases) {
            output += `• [${c.id}] ${c.name} (${c.status}) - ${c.tasks.length} task(s)\n`;
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
