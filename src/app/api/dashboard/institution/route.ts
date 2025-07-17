/**
 * HINTS:
 *
 * 1.
 * HOFs that wrap the routes to authenticate and
 * leave the route a gift: a user
 * object:{id,name,institutions...}
 *
 */

import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { SessionUser } from "@/types/next-auth";
import { Institution, InstitutionUser } from "@prisma/client";

// create institution
async function postHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
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
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
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

// delete institution
async function deleteHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
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
export const DELETE = withAuthAdmin(deleteHandler);
