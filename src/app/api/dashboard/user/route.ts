import prisma from "@/lib/prisma";
import { withAuthAdmin } from "@/lib/authRouteWrappers";
import { BASE_URL } from "@/helpers/getUrl";
import { NextRequest } from "next/server";
import { welcomeEmail } from "@/lib/emailRenderer";
import { SessionUser } from "@/types/next-auth";
import { includesAll } from "@/helpers/dataHandlers";
import { createUser } from "@/lib/prisma/queries";
import { UserRole } from "@prisma/client";

async function postHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined,
) {
  const doc = await request.json();
  console.log("POST - /api/dashboard/user", doc);

  const { names, email, tel, institutionIds: _institutionIds_update } = doc;

  // institution auth check
  if (user.role !== "system") {
    const isAllAdmin = includesAll(
      _institutionIds_update,
      institutionIds || [],
    );
    if (!isAllAdmin) {
      return Response.json("Not allowed", { status: 403 });
    }
  }

  // new user object
  const newUser_ = {
    names,
    email,
    // tel,
    institutionIds: _institutionIds_update,
  };
  console.log("newUser_:", newUser_);

  try {
    //add to db
    const newRegistration = await createUser(newUser_);
    console.log("Database updated", newRegistration);
    // send email
    const emailToSend = await welcomeEmail(
      newRegistration.name,
      newRegistration.onboardingURL,
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

    let message_: string = "Failed to send onboarding email";
    if (emailerRes.ok) {
      message_ = "message sent";
    } else {
      console.warn(
        "Failed to send onboarding email to - ",
        newRegistration.email,
      );
    }

    return Response.json({
      id: newRegistration.id,
      name: newRegistration.name,
      email: newRegistration.email,
      message: message_,
    });
  } catch (err: any) {
    let message = "SERVER ERROR";
    let code = 500;
    if (err.code === 409) {
      message = err.message || "User exists";
      code = err.code;
    }
    console.error(
      "ERROR occurred during user creation -route:/api/dashboard/user POST\n >> error:",
      message,
    );
    return Response.json(message, { status: code });
  }
}

async function getHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined,
) {
  const url = new URL(request.url);
  const userID = url.searchParams.get("id");

  if (!userID) {
    return Response.json("No userID provided", {
      status: 400,
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

async function patchHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined,
) {
  // request body
  const doc = await request.json();
  console.log(`PATCH - /api/dashboard/user\n`, doc);
  // update doc
  const { id, institutionIDs, ...doc_ } = doc;

  try {
    if (institutionIDs) {
      const _institutions = await prisma.institution.findMany({
        where: {
          id: {
            in: institutionIDs,
          },
        },
      });
      if (institutionIDs.length !== _institutions.length) {
        throw new Error("Invalid institutions found");
      }
    }

    const userInstitutionsJoin_ = institutionIDs
      ? {
          deleteMany: {}, // ❗ removes all existing InstitutionUser entries for this user
          create: institutionIDs.map((institutionId: string) => ({
            institution: { connect: { id: institutionId } },
          })),
        }
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...doc_,
        institutions: userInstitutionsJoin_,
      },
    });
    console.log(`SUCCESS: user updated`, updatedUser);
    // HTTP response
    return Response.json(updatedUser);
  } catch (err: any) {
    let errorMessage = "Server error";
    let errorCode = 500;

    if (err.message) {
      errorMessage = err.message;
    }
    if (err.code) {
      errorMessage = err.code;
    }

    console.error(`ERROR: user not updated`, err, " - ", errorMessage);
    return Response.json(errorMessage, { status: errorCode });
  }
}

async function deleteHandler(
  request: Request | NextRequest,
  user: SessionUser,
  institutionIds: string[] | undefined,
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
    if (!del_institutionUser || del_institutionUser.role === UserRole.ADMIN) {
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
export const PATCH = withAuthAdmin(patchHandler);
export const DELETE = withAuthAdmin(deleteHandler);
export const GET = withAuthAdmin(getHandler);
