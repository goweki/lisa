import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma/prisma";
import { InstitutionUser } from "@prisma/client";
import { SessionUser } from "@/types/next-auth";

export function withAuthGeneral(
  handler: (req: Request | NextRequest, user: SessionUser) => Promise<Response>
) {
  return async function (req: Request | NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return Response.json(
        { message: "Unauthorized: please log in" },
        { status: 401 }
      );
    }

    return handler(req, {
      ...user,
      role: user.role || "user",
    });
  };
}

export function withAuthAdmin(
  handler: (
    req: Request | NextRequest,
    user: SessionUser,
    institutionUser: InstitutionUser | null
  ) => Promise<Response>
) {
  return async function (req: Request | NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return Response.json(
        { message: "Unauthorized: please log in" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const institutionId = url.searchParams.get("institutionId");
    if (!institutionId && !user.systemAdmin) {
      return Response.json(
        { message: "Missing institutionId" },
        { status: 400 }
      );
    }

    const institutionUser = await prisma.institutionUser.findFirst({
      where: {
        userId: user.id,
        institutionId: institutionId || undefined,
      },
    });

    if (user.systemAdmin) {
      return handler(
        req,
        {
          ...user,
          role: user.role || "user",
        },
        institutionUser
      );
    }

    if (institutionUser && institutionUser.role === "ADMIN") {
      return handler(
        req,
        {
          ...user,
          role: user.role || "user",
        },
        institutionUser
      );
    }

    return Response.json(
      { message: "Unauthorized: you do not have admin access" },
      { status: 403 }
    );
  };
}
