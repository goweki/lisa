import prisma from "@/lib/prisma/prisma";
import { withAuthAdmin } from "@/lib/authRouteWrappers";
import { UserType } from "@/types/models";
import { NextRequest } from "next/server";
import { User } from "@/lib/prisma/types";

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);

async function postHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  try {
    // request body
    const doc = await request.json();
    console.log("POST REQUEST - new case: ", doc);
    // insert doc
    const res_ = await prisma.case.create({
      data: doc,
      include: {
        institution: true,
      },
    });
    console.log(
      `SUCCESS: case inserted, for institution ${res_.institution.name}.\n > ${res_.name}`
    );
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: /api/dashboard/case POST\n >> error: `, err);
    return Response.json({ error: "SERVER ERROR" });
  }
}

async function putHandler(request: Request | NextRequest, user: Partial<User>) {
  try {
    // request body
    const doc = await request.json();
    const { id, userID, ...doc_ } = doc;

    // console.log("PUT REQUEST: updating case ",doc);
    console.log(`PUT REQUEST: case data: `, doc);
    // update doc
    const res_ = await prisma.case.update({
      where: { id },
      data: {
        ...doc_,
        userID: userID || null,
      },
    });
    console.log(`SUCCESS: case updated\n`, res_);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: case update failed\n>> error: `, err);
    return Response.json({ error: "SERVER ERROR" });
  }
}

async function deleteHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  const doc = await request.json();
  const { id } = doc;
  try {
    // request body
    console.log("DELETE REQUEST: deleting case: ", id);
    // delete doc
    const res = await prisma.case.delete({ where: { id } });
    console.log(`SUCCESS: case deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(
      `ERROR: case deletion failed: ${JSON.stringify(doc)}\n >> error: ${err}\n`
    );
    return Response.json({ error: "SERVER ERROR" });
  }
}

async function getHandler(request: Request | NextRequest, user: Partial<User>) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json("NO case id provided", {
      status: 400,
    });
  }

  try {
    // retrieve doc
    const res_ = await prisma.case.findUnique({
      where: { id },
    });
    if (res_) return Response.json({ success: res_ });
    else return Response.json({ failed: "no case found" });
  } catch (err) {
    console.error(`ERROR: case retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: "SERVER ERROR" });
  }
}
