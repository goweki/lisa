import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { SessionUser } from "@/types/next-auth";
import { Institution, InstitutionUser } from "@prisma/client";

// create institution
async function postHandler(
  request: Request,
  user: SessionUser,
  institutionIds: string[] | undefined
) {
  if (user.role !== "system") {
    return Response.json("You do not have permission to create institution", {
      status: 403,
    });
  }

  try {
    const doc: Partial<Institution> = await request.json();
    const { name, ...doc_ } = doc;
    if (!name) {
      return Response.json("No institution name provided", {
        status: 403,
      });
    }

    const newInst = await prisma.institution.create({
      data: { name, ...doc_ },
    });
    if (!newInst) {
      console.error("FAILED: didn't save new institution.\n > ", doc);
      return Response.json("Failed to save new institution", { status: 500 });
    }

    console.log(" > SUCCESS: institution saved.\n > ", newInst, "\n...");
    return Response.json({ ...newInst });
  } catch (err) {
    console.error(
      "ERROR: institution insertion failed - route: /api/dashboard/institution POST\n >> error:",
      err
    );
    return Response.json("Server error", { status: 500 });
  }
}

// update institution
async function patchHandler(
  request: Request,
  user: SessionUser,
  institutionIds: string[] | undefined
) {
  const doc = await request.json();
  console.log("REQUEST: Patch institution", doc);
  const { id, ...doc_ } = doc;

  if (user.role !== "system") {
    return Response.json("You do not have permission to update institution", {
      status: 403,
    });
  }

  try {
    const updatedInst = await prisma.institution.update({
      where: { id },
      data: { ...doc_ },
    });

    console.log(` > SUCCESS: institution updated\n...`);
    return Response.json({ data: updatedInst });
  } catch (err) {
    console.error(
      `ERROR: institution update failed - route: /api/dashboard/institution PUT\n >> error:`,
      err
    );
    return Response.json("Server error", { status: 500 });
  }
}

// GET institutions related to user
async function getHandler(request: Request, user: SessionUser) {
  const { searchParams } = new URL(request.url);
  console.log("search params: ", searchParams);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json("Missing userId", { status: 400 });
  }

  // Only allow the user themselves or system role to fetch
  if (user.role !== "system" && user.id !== userId) {
    return Response.json(
      "You do not have permission to view these institutions",
      {
        status: 403,
      }
    );
  }

  try {
    const userInstitutions = await prisma.institutionUser.findMany({
      where: { userId },
      select: { institutionId: true },
    });

    const institutionIds = userInstitutions.map((i) => i.institutionId);

    const institutions = await prisma.institution.findMany({
      where: { id: { in: institutionIds } },
      select: { id: true, name: true },
    });

    return Response.json(institutions);
  } catch (err) {
    console.error("ERROR: Failed to fetch institutions", err);
    return Response.json("Server error", { status: 500 });
  }
}

// delete institution
async function deleteHandler(
  request: Request,
  user: SessionUser,
  institutionIds: string[] | undefined
) {
  if (user.role !== "system") {
    return Response.json("You do not have permission to delete institution", {
      status: 403,
    });
  }

  try {
    const doc = await request.json();
    const { id } = doc;
    console.log("DELETE REQUEST: delete institution: ", id);

    const deletedInst = await prisma.institution.delete({ where: { id } });

    console.log(` > SUCCESS: institution deleted\n...`);
    return Response.json({ success: deletedInst });
  } catch (err: any) {
    let errMessage = "";
    if (err.code === "P2003") {
      console.error("Foreign key constraint error:", err.meta);
      errMessage = `Foreign key constraint error: ${err.meta.field_name}`;
    } else {
      console.error(
        `ERROR: institution deletion failed - route: /api/dashboard/institution DELETE\n >> `,
        err
      );
      errMessage = `SERVER ERROR`;
    }
    return Response.json(errMessage, { status: 500 });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PATCH = withAuthAdmin(patchHandler);
export const GET = withAuthGeneral(getHandler);
export const DELETE = withAuthAdmin(deleteHandler);
