import prisma from "@/lib/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { hash } from "@/helpers/bcryptHandlers";

async function postHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { institutionId, ...doc_ } = doc;
    // validation checks
    if (
      !user.institutionIDs.includes(institutionId) ||
      !user.email !== "antonio@goweki.com"
    )
      Response.json("Forbidden", { status: 403 });
    console.log("POST REQUEST: create new user: ", doc_);
    console.log("USER - ", user);
    // return;
    // insert doc
    const newUser = await prisma.user.create({
      data: {
        password: await hash(doc.email),
        institutionIDs: [institutionId],
        ...doc_,
      },
    });
    if (!newUser) {
      console.error("FAILED: didnt save new user.\n > ", doc);
      return Response.json({ failed: "Failed creating new user" });
    }
    // console.log("SUCCESS: user inserted.\n > ", newUser);
    return Response.json({ success: newUser });
  } catch (err) {
    console.error(
      "ERROR: user insertion failed -route:/api/dashboard/user POST\n >> error:",
      err
    );
    return Response.json({ status: 500 }, "Server error");
  }
}

export async function putHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { id, ...doc_ } = doc;

    // console.log("PUT REQUEST: updating institution ",id);
    console.log(` > updating - data: ${doc}`);
    // update doc
    const res_ = await prisma.institution.update({
      where: { id },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: institution updated - ${id}\n`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(
      `ERROR: institution update failed - ${_id}\n >> error: ${err}, \n`
    );
    return Response.json({ error: err });
  }
}

export async function deleteHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { id } = doc;
    console.log("DELETE REQUEST: deleting institution: ", id);
    // delete doc
    const res = await prisma.institution.delete({ where: { id } });
    console.log(`SUCCESS: institution deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(
      `ERROR: institution deletion failed: ${_id}\n >> error: ${err}\n`
    );
    return Response.json({ error: err });
  }
}

export async function getHandler(request, user) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    // retrieve doc
    const res_ = await collection.findOne({ _id: new ObjectId(id) });
    if (res_) return Response.json({ success: res_ });
    else return Response.json({ failed: "no institution found" });
  } catch (err) {
    console.log(`ERROR: institution retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);
export const GET = withAuthAdmin(getHandler);
