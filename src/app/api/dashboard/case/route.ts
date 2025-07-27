import prisma from "@/lib/prisma/prisma";
import { withAuthAdmin, withAuthGeneral } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { User } from "@/types/models";
import { SessionUser } from "@/types/next-auth";
import { caseInputSchema, TemplateObj } from "@/types/custom";

export const POST = withAuthGeneral(postHandler);
export const PATCH = withAuthAdmin(patchHandler);
export const DELETE = withAuthAdmin(deleteHandler);

async function postHandler(request: Request | NextRequest, user: SessionUser) {
  // request body
  const doc = await request.json();
  console.log("POST - api/dashboard/case: ", doc);

  const { institutionId: _institutionId, ...doc_ } = doc;

  if (user.role !== "system") {
    const userInsts = await prisma.institutionUser.findMany({
      where: {
        userId: user.id,
      },
      select: { institutionId: true },
    });

    const isMember = userInsts.some(
      ({ institutionId }) => institutionId === _institutionId
    );

    if (!isMember) {
      return Response.json("Not Allowed", { status: 403 });
    }
  }

  try {
    doc_.createdById = user.id
    doc_.institutionId = _institutionId
    console.log('Creating - ', doc_)
    // insert doc
    const res_ = await prisma.case.create({
      data: { ...doc_ },
      include: {
        institution: true,
      },
    });
    console.log(
      `SUCCESS: case inserted, for institution ${res_.institution.name}.\n > ${res_.name}`
    );
    // HTTP response
    return Response.json(res_);
  } catch (err) {
    console.error(`ERROR: /api/dashboard/case POST\n >> error: `, err);
    return Response.json("SERVER ERROR", { status: 500 });
  }
}

async function patchHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined
) {
  const body = await request.json();
  // Validate structure
  const parsed = caseInputSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }
  const doc = parsed.data;
  const { id, assigneeId, institutionId, ...doc_ } = doc;

  const update: TemplateObj = doc_

  // ✅ Handle optional relation
  if (assigneeId === null) {
    update.assignee = { disconnect: true };
  } else if (typeof assigneeId === 'string') {
    update.assignee = { connect: { id: assigneeId } };
  }
  if (institutionId === null) {
    update.institution = { disconnect: true };
  } else if (typeof assigneeId === 'string') {
    update.institution = { connect: { id: institutionId } };
  }


  try {
    console.log(`PATCH REQUEST: case data: `, update);
    // update doc
    const res_ = await prisma.case.update({
      where: { id },
      data: {
        ...update,
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
  user: SessionUser,
  institutionIds: string[] | undefined
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
