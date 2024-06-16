import prisma from "@/lib/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { hash } from "@/helpers/bcryptHandlers";
import { BASE_URL } from "@/helpers/getUrl";

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
    // console.log("by USER - ", user);
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
    // update user's Institution to include the new userID
    await prisma.institution.update({
      where: { id: institutionId },
      data: {
        userIDs: {
          push: newUser.id,
        },
      },
    });
    // send register link
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({ userEmail: newUser.email }),
    };
    const regLink = await fetch(
      `${BASE_URL}/api/auth/reset-password`,
      fetchOptions
    ).then(async (res_) => {
      if (res_.status === 200) {
        return await res_.json();
      } else {
        console.log(`ERROR: ` + JSON.stringify(res_));
        // setUIstate(httpCodes[res_.status]);
        if (res_.status && res_.status in httpCodes) {
          setUIstate(httpCodes[res_.status]);
        } else {
          setUIstate("Unknown Error, try again later"); // Handle unknown errors
        }
      }
    });
    if (!regLink.success) {
      console.error("FAILED: didnt send registration mail.\n > ", newUser);
      return Response.json({ failed: "Failed sending registration link" });
    }
    return Response.json({ success: newUser });
  } catch (err) {
    console.error(
      "ERROR: user insertion failed -route:/api/dashboard/user POST\n >> error:",
      err
    );
    return Response.json({ status: 500 }, "Server error");
  }
}

async function putHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { userID, ...doc_ } = doc;

    // ***test
    // return Response.json({ success: doc });

    // console.log("PUT REQUEST: updating institution ",id);
    console.log(`PUT - /api/dashboard/user\n >:`, doc);
    // update doc
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: user updated`, updatedUser);
    // HTTP response
    return Response.json({ success: "User Updated" });
  } catch (err) {
    console.error(`ERROR: user not updated`, err);
    return Response.json({ error: "Server error" });
  }
}

async function deleteHandler(request, user) {
  try {
    // request body
    const doc = await request.json();
    const { userID } = doc;
    console.log("DELETE REQUEST: deleting user: ", userID);
    // delete doc
    const res = await prisma.user.delete({ where: { id: userID } });
    if (!res) Response.json({ failed: "Database error" });
    else console.log(`SUCCESS: user deleted - ${userID}\n`);
    // HTTP response
    return Response.json({ success: "User deleted" });
  } catch (err) {
    console.error(`ERROR: User deletion failed:}\n >`, err);
    return Response.json({ error: `Server error` });
  }
}

async function getHandler(request, user) {
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
