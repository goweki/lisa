import prisma from "@/lib/prisma";
// const collection = db_cluster.collection("cases");
import { withAuthAdmin } from "@/lib/authRouteWrappers";
import { UserType } from "@/types/models";

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);
// export const GET = withAuthAdmin(getHandler);

/** HANDLER functions */
/**
 *
 * @param {Request} request
 * @param {UserType} user
 * @returns {Response}
 */
async function postHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    console.log("POST REQUEST: new case: ", doc);
    // insert doc
    const res_ = await prisma.case.create({ data: doc });
    console.log(
      `SUCCESS: case inserted, for institution ${doc.institution}.\n >${res_.name}`
    );
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: /api/dashboard/case POST\n >> error: `, err);
    return Response.json({ error: "SERVER ERROR" });
  }
}

/**
 *
 * @param {Request} request
 * @param {UserType} user
 * @returns {Response}
 */
async function putHandler(request, user) {
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

/**
 *
 * @param {Request} request
 * @param {UserType} user
 * @returns {Response}
 */
async function deleteHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { id } = doc;
    console.log("DELETE REQUEST: deleting case: ", id);
    // delete doc
    const res = await prisma.case.delete({ where: { id } });
    console.log(`SUCCESS: case deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(`ERROR: case deletion failed: ${_id}\n >> error: ${err}\n`);
    return Response.json({ error: "SERVER ERROR" });
  }
}

/**
 *
 * @param {Request} request
 * @param {UserType} user
 * @returns {Response}
 */
async function getHandler(request, user) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    // retrieve doc
    const res_ = await collection.findOne({ _id: new ObjectId(id) });
    if (res_) return Response.json({ success: res_ });
    else return Response.json({ failed: "no case found" });
  } catch (err) {
    console.log(`ERROR: case retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: "SERVER ERROR" });
  }
}
