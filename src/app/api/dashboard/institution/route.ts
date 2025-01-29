/**
 * HINTS:
 *
 * 1.
 * withAuthAdmin (& withAuthGeneral) are HOFs that wrap
 * the routes to authenticate and leave the route a
 * gift: a user object:{id,name,institutions...}
 *
 * 2.
 *
 */

import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { User } from "@/lib/prisma/types";
import { NextRequest } from "next/server";

// create institution
async function postHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  if (user.role !== "system_admin") {
    return Response.json("You do not have permission to create institution", {
      status: 403,
    });
  }

  try {
    const doc = await request.json();
    console.log("POST REQUEST: new institution: ", doc);

    const newInst = await prisma.institution.create({ data: doc });
    if (!newInst) {
      console.error("FAILED: didn't save new institution.\n > ", doc);
      return Response.json({ failed: "Failed saving new institution" });
    }

    console.log(" > SUCCESS: institution inserted.\n > ", newInst, "\n...");
    return Response.json({ success: newInst });
  } catch (err) {
    console.error(
      "ERROR: institution insertion failed - route: /api/dashboard/institution POST\n >> error:",
      err
    );
    return Response.json({ failed: "Server error" });
  }
}

// update institution
async function patchHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  if (user.role !== "system_admin") {
    return Response.json("You do not have permission to update institution", {
      status: 403,
    });
  }

  try {
    const doc = await request.json();
    const { id, ...doc_ } = doc;

    // console.log("PUT REQUEST: update institution: ", id);

    const updatedInst = await prisma.institution.update({
      where: { id },
      data: { ...doc_ },
    });

    console.log(` > SUCCESS: institution updated\n...`);
    return Response.json({ success: updatedInst });
  } catch (err) {
    console.error(
      `ERROR: institution update failed - route: /api/dashboard/institution PUT\n >> error:`,
      err
    );
    return Response.json({ error: "Server error" });
  }
}

// delete institution
async function deleteHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  if (user.role !== "system_admin") {
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
  } catch (err) {
    console.error(
      `ERROR: institution deletion failed - route: /api/dashboard/institution DELETE\n >> `,
      err
    );
    return Response.json({ error: "Server error" });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PATCH = withAuthAdmin(patchHandler);
export const DELETE = withAuthAdmin(deleteHandler);
