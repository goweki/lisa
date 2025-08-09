import { ToolDecorator } from "../decorators/ToolDecorator";
import prisma from "@/lib/prisma/prisma";
import type { UserContext } from "../types/UserContext";
import { UserRole } from "@prisma/client";

export class UsersTools {
  constructor(private user: UserContext) {
    if (!user) {
      throw new Error("User context is required to initialize UsersTools.");
    }
  }

  @ToolDecorator({
    docstring: `Creates a new user within an institution. 
System admins can create users in any institution.
Admins can create users only in their institution.

Parameters:
- institutionId: ID of the institution (required)
- name: Full name of the user (required)
- email: Email address of the user (required)
- role: Role for the user in the institution ("USER" or "ADMIN") (required)`,
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
      role: {
        type: "string",
        description: `User role in the institution ("USER" or "ADMIN") (required)`,
      },
    },
  })
  async addUser(
    institutionId?: string,
    names?: string,
    email?: string
  ): Promise<string> {
    if (!institutionId || !names || !email) {
      return "Institution ID, name, email are required.";
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
            institutionId,
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
System admins can edit any user. Admins can only edit users in their institution.

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
System admins can delete any user.
Admins can only delete users in their institution.

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
    docstring: `Lists all users visible to the current user.
System admins see all users. Admins and regular users see only users in their institution(s).`,
    parameters: {},
  })
  async listUsers(): Promise<string> {
    const users = this.user.systemAdmin
      ? await prisma.user.findMany({
          include: { institutions: true },
        })
      : await prisma.user.findMany({
          where: {
            institutions: {
              some: {
                institutionId: { in: this.user.institutions.map((i) => i.id) },
              },
            },
          },
          include: { institutions: true },
        });

    if (users.length === 0) return "No users found.";

    return users
      .map(
        (u) =>
          `- ${u.names} (${u.email}) [${u.id}] - Institutions: ${u.institutions
            .map((inst) => `${inst.institutionId}:${inst.role}`)
            .join(", ")}`
      )
      .join("\n");
  }
}
