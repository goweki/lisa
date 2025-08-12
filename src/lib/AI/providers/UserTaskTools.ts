import { te } from "date-fns/locale";
import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import { error } from "console";

export class UserTaskTools {
  constructor(private tel: string) {}

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
  async addTaskUser(name?: string): Promise<string> {
    if (!name || !this.tel) {
      return "User's telephone is obscured. refer them to webapp link.";
    }

    const newUser = await prisma.user.create({
      data: {
        names: name,
        tel: this.tel,
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
