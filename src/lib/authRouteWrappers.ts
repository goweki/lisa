import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { InstitutionUser, UserRole } from "@prisma/client";
import { auth } from "./auth";
import { type User } from "next-auth";

export function withAuthGeneral(
  handler: (req: Request | NextRequest, user: unknown) => Promise<Response>,
) {
  return async function (req: Request | NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return Response.json(
        { message: "Unauthorized: please log in" },
        { status: 401 },
      );
    }

    return handler(req, user);
  };
}

export function withAuthAdmin(
  handler: (
    req: Request | NextRequest,
    user: User,
    institutionIds: string[] | undefined,
  ) => Promise<Response>,
) {
  return async function (req: Request | NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return Response.json("Unauthorized: please log in", { status: 401 });
    }

    let institutionIds: string[] | undefined = undefined;

    if (!user.systemAdmin) {
      const userInsts = await prisma.institutionUser.findMany({
        where: {
          userId: user.id,
          role: UserRole.ADMIN,
        },
      });

      if (userInsts.length < 1) {
        return Response.json("Not Allowed", { status: 403 });
      } else {
        institutionIds = userInsts.map(({ institutionId }) => institutionId);
      }
    }

    return handler(req, user, institutionIds);
  };
}
