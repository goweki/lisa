import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";

export class UserTaskTools {
  constructor() {}

  @ToolDecorator({
    docstring: `Creates a new user within an institution. 

    Parameters: 
    - name: Full name of the user (required)`,
    parameters: {
      name: {
        type: "string",
        description: "Full name of the user (required)",
      },
    },
  })
  async addTaskUser(name?: string, tel?: string): Promise<string> {
    if (!name || !tel) {
      return "Name and telephone number are required.";
    }

    const newUser = await prisma.user.create({
      data: {
        names: name,
        tel,
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
}
