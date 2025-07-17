import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { hash } from "@/helpers/passwordHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { NextRequest } from "next/server";
import { welcomeEmail } from "@/lib/emailRenderer";
import { InstitutionUser } from "@prisma/client";
import { User } from "@/types/models";
import { SessionUser } from "@/types/next-auth";
import { includesAll } from "@/helpers/dataHandlers";
import { createUser } from "@/lib/prisma/queries";

async function postHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
) {
  const doc = await request.json();
  const { names, email, tel, institutionIds } = doc;

  try {
    // institution auth check
    if (user.role !== "system") {
      const adminsInsts = await prisma.institutionUser.findMany({
        where: { userId: user.id },
      });
      const adminsInsts_strArr = adminsInsts.map(({ id }) => id);
      //  * includesAll(['a', 'b'], ['a', 'b', 'c']); // true
      const isAllAdmin = includesAll(institutionIds, adminsInsts_strArr);
      if (!isAllAdmin) {
        return Response.json("Institution Not Found", { status: 40 });
      }
    }

    // new user object
    const newUser_ = {
      names,
      email,
      // tel,
      institutionIds,
    };
    console.log("newUser_:", newUser_);

    //add to db
    const newRegistration = await createUser(newUser_);

    console.log("Database updated", newRegistration);

    // send email
    const emailToSend = await welcomeEmail(
      newRegistration.name,
      newRegistration.onboardingURL
    );
    const emailerRes = await fetch(`${BASE_URL}/api/mailer`, {
      method: "POST",
      body: JSON.stringify({
        email: {
          to: newRegistration.name,
          subject: "Welcome to Lisa",
          html: emailToSend.html,
          text: emailToSend.text,
        },
      }),
    });

    let message_: string | undefined = undefined;
    if (!emailerRes.ok) {
      console.warn(
        "Failed to send onboarding email to - ",
        newRegistration.email
      );
      message_ = "Failed to send onboarding email";
    }

    console.log("User created successfully");
    return Response.json({
      id: newRegistration.id,
      name: newRegistration.name,
      email: newRegistration.email,
      message: message_,
    });
  } catch (err) {
    console.error(
      "ERROR occurred during user creation -route:/api/dashboard/user POST\n >> error:",
      err
    );
    return Response.json("SERVER ERROR ", { status: 500 });
  }
}

async function getHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
) {
  const url = new URL(request.url);
  const userID = url.searchParams.get("id");

  if (!userID) {
    return Response.json("No userID provided", {
      status: 400,
    });
  }

  if (
    !institutionUser ||
    (institutionUser.role !== "admin" && !user.systemAdmin)
  ) {
    return Response.json("You do not have permission to delete user", {
      status: 403,
    });
  }

  try {
    // retrieve doc
    const res_ = await prisma.user.findUnique({ where: { id: userID } });
    if (res_) {
      return Response.json(res_);
    } else {
      return Response.json("no user found", { status: 404 });
    }
  } catch (err) {
    console.log(`ERROR: user retrieval erred.\n >> ${err} \n..........`);
    return Response.json(err, { status: 500 });
  }
}

async function putHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
) {
  try {
    // request body
    const doc = await request.json();
    const { id: userID, ...doc_ } = doc;

    // console.log("PUT REQUEST: updating institution ",id);
    console.log(`PUT - /api/dashboard/user\n`, doc);
    return Response.json("TESTING PASSED");
    // update doc
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: user updated`, updatedUser);
    // HTTP response
    return Response.json("User Updated");
  } catch (err) {
    console.error(`ERROR: user not updated`, err);
    return Response.json("Server error", { status: 500 });
  }
}

async function deleteHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
) {
  const doc = await request.json();
  const { id } = doc;
  if (!id) {
    return Response.json("No userID provided", {
      status: 400,
    });
  }

  try {
    console.log("DELETE REQUEST: deleting user: ", id);
    //permissions check
    const del_institutionUser = await prisma.institutionUser.findFirst({
      where: { userId: id },
    });
    if (!del_institutionUser || del_institutionUser.role === "admin") {
      return Response.json("You do not have permission to delete this user", {
        status: 403,
      });
    }
    // delete doc
    const res = await prisma.user.delete({ where: { id } });
    if (!res) Response.json("Database error", { status: 500 });
    console.log(`SUCCESS: user deleted - ${id}\n`);
    // HTTP response
    return Response.json(`User deleted ${res.email}`);
  } catch (err) {
    console.error(`ERROR: User deletion failed:}\n >`, err);
    return Response.json(`Server error`, { status: 500 });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);
export const GET = withAuthAdmin(getHandler);
