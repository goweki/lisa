import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral, withAuthAdmin } from "@/lib/authRouteWrappers";
import { hash } from "@/helpers/passwordHandlers";
import { BASE_URL } from "@/helpers/getUrl";
import { NextRequest } from "next/server";
import { welcomeEmail } from "@/lib/emailRenderer";
import { InstitutionUser } from "@prisma/client";
import { User } from "@/types/models";
import { SessionUser } from "@/types/next-auth";

async function postHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionUser: InstitutionUser | null
) {
  try {
    const doc = await request.json();
    const { password, role, institutionId: _institutionId, ...doc_ } = doc;

    // institutionId check
    const institutionId =
      institutionUser?.institutionId ||
      (user.systemAdmin ? _institutionId : undefined) ||
      undefined;
    if (!institutionId) {
      return Response.json(
        { message: "Institution Not Found" },
        { status: 400 }
      );
    }

    // new user object
    const newUser_ = {
      password: await hash(password),
      ...doc_,
    };
    console.log("newUser_:", newUser_);

    // insert doc
    const newUser = await prisma.user.create({
      data: newUser_,
    });
    if (!newUser) {
      console.error("FAILED: didnt save new user.\n > ", doc);
      return Response.json(
        { message: "Failed creating new user, try later" },
        { status: 500 }
      );
    }

    prisma.institutionUser.create({
      data: {
        institutionId,
        userId: newUser.id,
        role: role || undefined,
      },
    });

    // send email
    const emailToSend = await welcomeEmail(
      newUser_.name,
      newUser_.onboardingURL
    );

    const emailerRes = await fetch(`${BASE_URL}/api/mailer`, {
      method: "POST",
      body: JSON.stringify({
        email: {
          to: newUser.email,
          subject: "Welcome to Lisa",
          html: emailToSend.html,
          text: emailToSend.text,
        },
      }),
    });

    if (!emailerRes.ok) {
      throw new Error("Failed to send email");
    }

    console.log("User created successfully");
    return Response.json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error(
      "ERROR: user insertion failed -route:/api/dashboard/user POST\n >> error:",
      err
    );
    return Response.json({ message: "SERVER ERROR " }, { status: 500 });
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
      return Response.json({ success: res_ });
    } else {
      return Response.json({ failed: "no user found" });
    }
  } catch (err) {
    console.log(`ERROR: user retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
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
      return Response.json(
        { message: "You do not have permission to delete this user" },
        { status: 403 }
      );
    }
    // delete doc
    const res = await prisma.user.delete({ where: { id } });
    if (!res) Response.json({ message: "Database error" }, { status: 500 });
    console.log(`SUCCESS: user deleted - ${id}\n`);
    // HTTP response
    return Response.json({ message: `User deleted ${res.email}` });
  } catch (err) {
    console.error(`ERROR: User deletion failed:}\n >`, err);
    return Response.json({ error: `Server error` });
  }
}

export const POST = withAuthAdmin(postHandler);
export const PUT = withAuthAdmin(putHandler);
export const DELETE = withAuthAdmin(deleteHandler);
export const GET = withAuthAdmin(getHandler);
