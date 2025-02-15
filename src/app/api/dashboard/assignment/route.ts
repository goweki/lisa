import prisma from "@/lib/prisma/prisma";
import { withAuthAdmin, withAuthGeneral } from "@/lib/authRouteWrappers";
import { UserType } from "@/types/models";
import { NextRequest } from "next/server";
import { User } from "@/lib/prisma/types";

export const POST = withAuthGeneral(postHandler);
export const DELETE = withAuthGeneral(deleteHandler);

async function postHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  // request body
  const doc = await request.json();
  console.log("POST - api/dashboard/assignment: ", doc);

  const { caseID } = doc;
  const userID = user.id;

  if (!caseID || !userID) {
    console.error("ERROR: invalid request body");
    return Response.json("caseID or userID missing", {
      status: 400,
    });
  }

  try {
    // insert doc
    const res_ = await prisma.assigneeRequest.create({
      data: {
        case: { connect: { id: caseID } },
        assignee: { connect: { id: userID } },
      },
      include: {
        case: true,
        assignee: true,
      },
    });
    console.log(
      `SUCCESS: assignment request by ${res_.assignee.email} saved.\n > case:  ${res_.case.name}`
    );
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: /api/dashboard/assignment POST\n >> error: `, err);
    return Response.json({ error: "SERVER ERROR" });
  }
}

async function deleteHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  // request body
  const doc = await request.json();
  const { id } = doc;
  console.log("DELETE - api/dashboard/assignment: ", id);

  try {
    //doc owner?
    const doc__ = await prisma.assigneeRequest.findFirst({
      where: {
        id,
        assigneeID: user.id,
      },
    });
    if (!doc__) {
      console.error(" > FAILED: No assignment request found for user");
      return Response.json("No assignment request found for user", {
        status: 400,
      });
    }
    // delete doc
    const res = await prisma.assigneeRequest.delete({ where: { id } });
    console.log(`SUCCESS: assignmentRequest deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(
      `ERROR: assignmentRequest deletion failed: ${JSON.stringify(
        doc
      )}\n >> error: ${err}\n`
    );
    return Response.json({ error: "SERVER ERROR" });
  }
}
