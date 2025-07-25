import prisma from "@/lib/prisma/prisma";
import { withAuthAdmin, withAuthGeneral } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { User } from "@/types/models";
import { SessionUser } from "@/types/next-auth";

export const POST = withAuthGeneral(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);

async function postHandler(request: Request | NextRequest, user: SessionUser) {
  // request body
  const doc = await request.json();
  console.log("POST - api/dashboard/case: ", doc);
  //     id?: String | StringFieldUpdateOperationsInput,
  // ?   status?: CaseStatus | EnumCaseStatusFieldUpdateOperationsInput,
  // ?   clientID?: String | NullableStringFieldUpdateOperationsInput | Null,
  // ?   createdAt?: DateTime | DateTimeFieldUpdateOperationsInput,
  // ?   updatedAt?: DateTime | DateTimeFieldUpdateOperationsInput,
  // ?   createdBy?: String | NullableStringFieldUpdateOperationsInput | Null,
  // ?   caseType?: CaseTypeUpdateOneRequiredWithoutCasesNestedInput,
  // ?   institution?: InstitutionUpdateOneRequiredWithoutCasesNestedInput,
  // ?   lawyer?: UserUpdateOneWithoutCasesNestedInput,
  // ?   tasks?: TaskUpdateManyWithoutCaseNestedInput,
  // ?   assigneeRequests?: AssigneeRequestUpdateManyWithoutCaseNestedInput

  //   id: '32b25529-5877-4d16-98e5-87d3aa99897d',
  // name: 'New Case',
  // description: '',
  // court: null,
  // userId: null,
  // caseNumber: '453553464555',
  // clientParty: 'Accused',
  // clientTel: '+254700833003',
  // clientEmail: null,
  // clientName: 'Defendant One',
  // otherPartyName: null,
  // otherPartyTel: null,
  // otherPartyEmail: null,
  // otherPartyDescription: null

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
    // insert doc
    const res_ = await prisma.case.create({
      data: { ...doc, createdBy: user.id },
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

async function putHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined
) {
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
