import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { hash } from "@/helpers/bcryptHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { NextRequest } from "next/server";
import { User } from "@/lib/prisma/types";
import { useState } from "react";

async function postHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  if (!user.role?.includes("admin")) {
    return Response.json("You do not have permission to delete institution", {
      status: 403,
    });
  }

  try {
    // request body
    const doc = await request.json();
    const { institutionIds, ...doc_ } = doc;

    // Validation checks
    let validCheck: boolean = institutionIds.every((instId: string) =>
      user.institutionIDs?.includes(instId)
    );

    if (user.role === "system_admin") {
      validCheck = true;
    }

    if (validCheck === false) Response.json("Forbidden", { status: 403 });
    // console.log("POST REQUEST: create new user: ", doc_);
    // console.log("by USER - ", user);

    // new user object
    const newUser_ = {
      password: await hash(doc.email),
      institutionIDs: institutionIds,
      ...doc_,
    };
    console.log("newUser_:", newUser_);

    // insert doc
    const newUser = await prisma.user.create({
      data: newUser_,
    });
    if (!newUser) {
      console.error("FAILED: didnt save new user.\n > ", doc);
      return Response.json({ failed: "Failed creating new user" });
    }
    // update user's Institution to include the new userID
    newUser.institutionIDs.forEach((instId) => {
      prisma.institution.update({
        where: { id: instId },
        data: {
          userIDs: {
            push: newUser.id,
          },
        },
      });
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
      if (res_.ok) {
        return await res_.json();
      } else {
        console.log(`ERROR: ` + JSON.stringify(res_));
        // setUIstate(httpCodes[res_.status]);
        return;
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
    return Response.json("SERVER ERROR ", { status: 500 });
  }
}

async function getHandler(request: Request | NextRequest, user: Partial<User>) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json("No userID provided", {
      status: 400,
    });
  }

  if (!user.role?.includes("admin")) {
    return Response.json("You do not have permission to delete user", {
      status: 403,
    });
  }

  try {
    // retrieve doc
    const res_ = await prisma.user.findUnique({ where: { id } });
    if (res_) {
      return Response.json({ success: res_ });
    } else {
      return Response.json({ failed: "no user found" });
    }
  } catch (err) {
    console.log(`ERROR: user retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
  }
}

async function putHandler(request: Request | NextRequest, user: Partial<User>) {
  try {
    // request body
    const doc = await request.json();
    const { id: userID, ...doc_ } = doc;

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

async function deleteHandler(
  request: Request | NextRequest,
  user: Partial<User>
) {
  const doc = await request.json();
  const { id } = doc;
  if (!id) {
    return Response.json("No userID provided", {
      status: 400,
    });
  }

  if (!user.role?.includes("admin")) {
    return Response.json("You do not have permission to delete user", {
      status: 403,
    });
  }
  try {
    console.log("DELETE REQUEST: deleting user: ", id);
    // delete doc
    const res = await prisma.user.delete({ where: { id } });
    if (!res) Response.json({ failed: "Database error" });
    else console.log(`SUCCESS: user deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: `User deleted ${res.email}` });
  } catch (err) {
    console.error(`ERROR: User deletion failed:}\n >`, err);
    return Response.json({ error: `Server error` });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);
export const GET = withAuthAdmin(getHandler);
