import prisma from "@/lib/prisma/prisma";
import { httpCodes } from "@/lib/configs";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { User } from "@/lib/prisma/types";

async function postHandler(request: Request, user: Partial<User>) {
  const { caseID, dueDate, ...doc } = await request.json();
  console.log("POST REQUEST: new task: ", doc.name);
  try {
    //
    if (
      !(await prisma.case.findUnique({
        where: { id: caseID },
      }))
    ) {
      // HTTP response - task name exists
      console.log(` > FAILED: Parent Case does not exist.\n..........`);
      return Response.json({ failed: "Parent Case does not exist" });
    } else {
      // insert doc
      const res_ = await prisma.task.create({
        data: {
          ...doc,
          caseID,
          dueDate: new Date(dueDate),
        },
      });
      console.log(` > SUCCESS: task inserted.\n..........`);
      // HTTP response
      return Response.json({ success: res_ });
    }
  } catch (err) {
    console.error(
      " > ERROR: task-document insertion failed.",
      err,
      "\n.........."
    );
    return Response.json("SERVER ERROR");
  }
}

async function patchHandler(request: Request, user: Partial<User>) {
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

async function deleteHandler(request: Request, user: Partial<User>) {
  // request body
  const doc = await request.json();
  const { caseID, id } = doc;
  console.log("DELETE REQUEST: deleting task: ", id, " of ", caseID);
  try {
    // delete (pull) object from the dueDates array
    const deleteTask = await prisma.task.delete({
      where: {
        id: id,
        caseID: caseID,
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
