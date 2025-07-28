import prisma from "@/lib/prisma/prisma";
import { httpCodes } from "@/lib/configs";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { SessionUser } from "@/types/next-auth";
import { ReminderChannels, TimeRegimes } from "@prisma/client";
import { taskInputSchema } from "@/types/custom";

async function postHandler(request: Request, user: SessionUser) {
  const body = await request.json();
  console.log(`PATCH REQUEST: case data: `, body);
  // Validate structure
  const parsed = taskInputSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten());
    return Response.json("Invalid request body", { status: 400 });
  }
  const doc = parsed.data;
  const { caseId, dueDate, name: taskName, type, reminders: _reminders, ...doc_ } = doc;

  if (!caseId || !taskName || !type || !dueDate) {
    console.error("Invalid task object - ", doc);
    return Response.json("Invalid request body", { status: 400 });
  }

  try {
    // parent case exists?
    if (
      !(await prisma.case.findUnique({
        where: { id: caseId },
      }))
    ) {
      console.log(` > FAILED: Parent Case does not exist.\n..........`);
      return Response.json("Parent case does not exist", { status: 404 });
    }

    const reminders: {
      regime: TimeRegimes;
      count: number;
      channel: ReminderChannels;
    }[] = _reminders || []
    if (reminders.length === 0) {
      reminders.push({
        regime: "hours",
        count: 2,
        channel: "whatsapp",
      })
    }

    // insert doc
    const res_ = await prisma.task.create({
      data: {
        caseId, name: taskName, type, dueDate, ...doc,
        reminders: {
          create: reminders.map((reminder__) => reminder__,),
        },
      },
    });
    console.log(` > SUCCESS: task inserted.\n..........`);
    // HTTP response
    return Response.json(res_);
  } catch (err) {
    console.error(
      " > ERROR: task-document insertion failed.",
      err,
      "\n.........."
    );
    return Response.json("SERVER ERROR");
  }
}

async function patchHandler(request: Request, user: SessionUser) {
  try {
    // request body
    const { id, ...doc } = await request.json();
    console.log("PATCH REQUEST: updating task - ", id);
    // update doc
    const updatedTask_ = await prisma.task.update({
      where: { id },
      data: doc,
    });
    console.log("SUCCESS: task updated\n >> ", updatedTask_);
    // HTTP response
    return Response.json({ success: updatedTask_ });
  } catch (err: any) {
    console.error("ERROR: erred deleting task \n >> error: ", err);
    return Response.json({
      status: err.status || 500,
      message: httpCodes[err.status || "Server error"],
    });
  }
}

async function deleteHandler(request: Request, user: SessionUser) {
  // request body
  const doc = await request.json();
  const { caseID, id } = doc;
  console.log("DELETE REQUEST: deleting task: ", id, " of ", caseID);
  try {
    // delete (pull) object from the dueDates array
    const deleteTask = await prisma.task.delete({
      where: {
        id: id,
        caseId: caseID,
      },
    });
    console.log(`SUCCESS: task deleted.\n..........`);
    // HTTP response
    return Response.json({ success: deleteTask });
  } catch (err: any) {
    console.error("ERROR: erred deleting task \n >> error: ", err);
    return Response.json({
      status: err.status || 500,
      message: httpCodes[err.status || "Server error"],
    });
  }
}

export const POST = withAuthGeneral(postHandler);
export const PATCH = withAuthGeneral(patchHandler);
export const DELETE = withAuthGeneral(deleteHandler);
