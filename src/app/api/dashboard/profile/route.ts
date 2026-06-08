import prisma from "@/lib/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { NextRequest } from "next/server";
import { SessionUser } from "@/types/next-auth";
import { profileEditSchema } from "@/types/custom";

async function patchHandler(request: Request | NextRequest, user: SessionUser) {
  // request body
  const body = await request.json();
  // Validate structure
  const parsed = profileEditSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }
  const doc = parsed.data;
  const { id, ...doc_ } = doc;

  if (id !== user.id) {
    return Response.json("Not allowed", { status: 403 });
  }

  console.log("update - ", doc_);

  if (!Object.values(doc_).some(Boolean)) {
    console.error("No update in body: ", doc);
    return Response.json("No update in body", { status: 400 });
  }

  console.log(`PATCH - /api/dashboard/profile\n > Updating: `, doc_);

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: profile updated`, updatedUser);
    // HTTP response
    return Response.json(`Profile updated`);
  } catch (err) {
    console.error(`ERROR: profile not updated`, err);
    return Response.json("Server error", { status: 500 });
  }
}

export const PATCH = withAuthGeneral(patchHandler);
// export const POST = withAuthGeneral(postHandler);
// export const DELETE = withAuthGeneral(deleteHandler);
// export const GET = withAuthGeneral(getHandler);
