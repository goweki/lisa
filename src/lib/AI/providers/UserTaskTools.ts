import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";

export class UserTaskTools {
  constructor() {}

  @ToolDecorator({
    docstring: `Creates a new user within an institution. 

    Parameters:
    - institutionId: ID of the institution (required): Foreign-key from listInstitutions tool  
    - name: Full name of the user (required)
    - email: Email address of the user (required)`,
    parameters: {
      institutionId: {
        type: "string",
        description: "Institution ID (required)",
      },
      name: { type: "string", description: "Full name of the user (required)" },
      email: {
        type: "string",
        description: "Email address of the user (required)",
      },
    },
  })
  async addTaskUser(names?: string, tel?: string): Promise<string> {
    if (!names || !tel) {
      return "Name and telephone number are required.";
    }

    const newUser = await prisma.user.create({
      data: {
        names,
        tel,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "SELF-USER-CREATE",
        entity: `User: ${newUser.names}`,
        entityId: newUser.id,
        userId: newUser.id,
        details: newUser,
      },
    });

    return `User ${newUser.names} created with ID: ${newUser.id}`;
  }
}
