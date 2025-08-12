import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { SessionUser } from "@/types/next-auth";

async function postHandler(
  request: Request | NextRequest,
  user: Partial<SessionUser>
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
    // check if user is Case creator
    const case_ = await prisma.case.findFirst({
      where: {
        id: caseID,
        createdById: userID,
      },
    });

    // insert doc
    const res_assigneeRequest = await prisma.assigneeRequest.create({
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
      `SUCCESS: assignment request by ${res_assigneeRequest.assignee.email} saved.\n > case:  ${JSON.stringify(res_assigneeRequest)}`
    );

    if (res_assigneeRequest && case_ && !case_.assigneeId) {
      const res_case_ = await prisma.case.update({
        where: { id: caseID },
        data: {
          assigneeId: userID,
        },
      });

      await prisma.assigneeRequest.update({
        where: {
          id: res_assigneeRequest.id,
        },
        data: {
          status: "APPROVED",
        },
      });

      console.log(
        `SUCCESS: assigned to ${
          res_assigneeRequest.assignee.email
        }.\n >  ${JSON.stringify(res_assigneeRequest)} \n`
      );
    }

    // HTTP response
    return Response.json({ success: res_assigneeRequest });
  } catch (err) {
    console.error(`ERROR: /api/dashboard/assignment POST\n >> error: `, err);
    return Response.json({ error: "SERVER ERROR" });
  }
}

async function deleteHandler(
  request: Request | NextRequest,
  user: Partial<SessionUser>
) {
  // request body
  const doc = await request.json();
  const { requestID } = doc;
  console.log("DELETE - api/dashboard/assignment: ", requestID);

  try {
    //doc owner?
    const doc__ = await prisma.assigneeRequest.findFirst({
      where: {
        id: requestID,
        assigneeId: user.id,
      },
    });
    if (!doc__) {
      console.error(" > FAILED: No assignment request found for user");
      return Response.json("No assignment request found for user", {
        status: 400,
      });
    }
    // delete doc
    const res = await prisma.assigneeRequest.delete({
      where: { id: requestID },
    });
    console.log(`SUCCESS: assignmentRequest deleted - ${requestID}\n`);
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

export const POST = withAuthGeneral(postHandler);
export const DELETE = withAuthGeneral(deleteHandler);
