import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";

export class UsersTools {
  constructor(private user: UserContext) {
    if (!user) {
      throw new Error("User context is required to initialize UsersTools.");
    }
  }

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
  async addUser(
    institutionId?: string,
    names?: string,
    email?: string
  ): Promise<string> {
    if (!institutionId && this.user.institutions.length !== 1) {
      return "You are administrator to several institutions, use dashboard for better management";
    }

    const institutionId_ = institutionId || this.user.institutions[0].id;

    if (!names || !email) {
      return "Name and Email are required.";
    }

    if (!this.user.systemAdmin) {
      const institutionRole = this.user.institutions.find(
        ({ id }) => id === institutionId
      )?.role;
      if (institutionRole !== "ADMIN") {
        return "You do not have permission to create users in this institution.";
      }
    }

    const newUser = await prisma.user.create({
      data: {
        names,
        email,
        institutions: {
          create: {
            institutionId: institutionId_,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: `User: ${newUser.names}`,
        entityId: newUser.id,
        userId: this.user.id,
        details: { institutionId, names, email },
      },
    });

    return `User ${newUser.names} created with ID: ${newUser.id}`;
  }

  @ToolDecorator({
    docstring: `Edits an existing user's name, email, or role.

Parameters:
- userId: ID of the user to edit (required)
- name: New name (optional)
- email: New email (optional)`,
    parameters: {
      userId: { type: "string", description: "User ID (required)" },
      name: { type: "string", description: "New name (optional)" },
      email: { type: "string", description: "New email (optional)" },
    },
  })
  async editUser(
    userId?: string,
    names?: string,
    email?: string
  ): Promise<string> {
    if (!userId) return "User ID is required.";

    if (!this.user.systemAdmin) {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { institutions: true },
      });
      if (!targetUser) return "User not found.";

      const hasPermission = targetUser.institutions.some((inst) =>
        this.user.institutions.some(
          (uInst) => uInst.id === inst.institutionId && uInst.role === "ADMIN"
        )
      );
      if (!hasPermission) {
        return "You do not have permission to edit this user.";
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        names: names || undefined,
        email: email || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: `User: ${updatedUser.names}`,
        entityId: updatedUser.id,
        userId: this.user.id,
        details: { names, email },
      },
    });

    return `User ${updatedUser.id} updated successfully.`;
  }

  @ToolDecorator({
    docstring: `Deletes a user permanently. 

Parameters:
- userId: ID of the user to delete (required)`,
    parameters: {
      userId: { type: "string", description: "User ID (required)" },
    },
  })
  async deleteUser(userId?: string): Promise<string> {
    if (!userId) return "User ID is required.";

    if (!this.user.systemAdmin) {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { institutions: true },
      });
      if (!targetUser) return "User not found.";

      const hasPermission = targetUser.institutions.some((inst) =>
        this.user.institutions.some(
          (uInst) => uInst.id === inst.institutionId && uInst.role === "ADMIN"
        )
      );
      if (!hasPermission) {
        return "You do not have permission to delete this user.";
      }
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: `User: ${deletedUser.names}`,
        entityId: deletedUser.id,
        userId: this.user.id,
      },
    });

    return `User ${deletedUser.id} permanently deleted.`;
  }

  @ToolDecorator({
    docstring: `Lists all users visible to the current user.`,
    parameters: {},
  })
  async listUsers(): Promise<string> {
    if (!this.user.systemAdmin) {
      return "You do not have permission to view user.";
    }

    const users = this.user.systemAdmin
      ? await prisma.user.findMany({
          include: { institutions: { include: { institution: true } } },
        })
      : await prisma.user.findMany({
          where: {
            institutions: {
              some: {
                institutionId: { in: this.user.institutions.map((i) => i.id) },
              },
            },
          },
          include: { institutions: { include: { institution: true } } },
        });

    if (users.length === 0) return "No users found.";

    return users
      .map(
        (u) =>
          `- ${u.names} (${u.email}) with id ${u.id} - Institutions: ${u.institutions
            .map(
              (inst) =>
                `${inst.role} in institution with id ${inst.institutionId} (${inst.institution.name})`
            )
            .join(", ")}`
      )
      .join("\n");
  }
}
