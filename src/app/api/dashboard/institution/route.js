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

// create institution
async function postHandler(request, user) {
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
async function putHandler(request, user) {
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
async function deleteHandler(request, user) {
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
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);

/**
 * This is version 0 of my code: optimized and standardized to develop the above
 */
// import prisma from "@/lib/prisma/prisma";
// // import { NextResponse } from "next/server";

// async function postHandler(request, user) {
//   try {
//     // request body
//     const doc = await request.json();
//     console.log("POST REQUEST: new institution: ", doc);
//     // insert doc
//     const newInst = await prisma.institution.create({ data: doc });
//     if (!newInst) {
//       console.error("FAILED: didnt save new institution.\n > ", doc);
//       return Response.json({ failed: "Failed saving new institution" });
//     }
//     console.log(" > SUCCESS: institution inserted.\n > ", newInst, "\n...");
//     return Response.json({ success: newInst });
//   } catch (err) {
//     console.error(
//       "ERROR: institution insertion failed -route:/api/dashboard/institution POST\n >> error:",
//       err
//     );
//     return Response.json({ failed: "Server error" });
//   }
// }

// async function putHandler(request) {
//   try {
//     // request body
//     const doc = await request.json();
//     const { id, ...doc_ } = doc;

//     // console.log("PUT REQUEST: updating institution ",id);
//     console.log("PUT REQUEST: update institution: ", id);
//     // update doc
//     const res_ = await prisma.institution.update({
//       where: { id },
//       data: {
//         ...doc_,
//       },
//     });
//     console.log(` > SUCCESS: institution updated\n...`);
//     // HTTP response
//     return Response.json({ success: res_ });
//   } catch (err) {
//     console.error(
//       `ERROR: institution insertion failed -route:/api/dashboard/institution PUT\n >> error:`,
//       err
//     );
//     return Response.json({ error: "Server error" });
//   }
// }

// async function deleteHandler(request) {
//   try {
//     // request body
//     const doc = await request.json();
//     const { id } = doc;
//     console.log("DELETE REQUEST: delete institution: ", id);
//     // delete doc
//     const res = await prisma.institution.delete({ where: { id } });
//     console.log(` > SUCCESS: institution deleted\n...`);
//     // HTTP response
//     return Response.json({ success: res });
//   } catch (err) {
//     console.error(
//       `ERROR: institution insertion failed -route:/api/dashboard/institution DELETE\n >> `,
//       err
//     );
//     return Response.json({ error: "Server error" });
//   }
// }

// // async function getHandler(request) {
// //   const url = new URL(request.url);
// //   const id = url.searchParams.get("id");
// //   try {
// //     // retrieve doc
// //     const res_ = await collection.findOne({ _id: new ObjectId(id) });
// //     if (res_) return Response.json({ success: res_ });
// //     else return Response.json({ failed: "no institution found" });
// //   } catch (err) {
// //     console.log(
// //       `ERROR: institution insertion failed -route:/api/dashboard/institution GET\n >> `,
// //       err
// //     );
// //     return Response.json({ error: err });
// //   }
// // }

// export const POST = withAuthAdmin(postHandler);
// export const PUT = withAuthAdmin(putHandler);
// export const DELETE = withAuthAdmin(deleteHandler);
