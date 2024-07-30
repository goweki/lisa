// import { Binary } from "mongodb";
import prisma from "@/lib/prisma/prisma";
import { strPascalcase } from "@/helpers/stringHandlers";

export async function POST(request) {
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
    console.log(
      " > ERROR: task-document insertion failed.",
      err,
      "\n.........."
    );
    return Response.json({ error: err });
  }
}

export async function PUT(request) {
  // request body
  const { id, ...doc } = await request.json();
  console.log("PUT REQUEST: updating task ", id);
  try {
    // update doc
    const updateTask = await prisma.task.update({
      where: { id },
      data: doc,
    });
    console.log("SUCCESS: task updated\n >> ", updateTask);
    // HTTP response
    return Response.json({ success: updateTask });
  } catch (err) {
    console.error(
      "ERROR: task completion failed -id \n",
      id,
      " >> error: ",
      err
    );
    return Response.json({ error: `Server error: please contact admin...` });
  }
}

export async function DELETE(request) {
  // request body
  const doc = await request.json();
  const { caseID, taskID } = doc;
  console.log("DELETE REQUEST: deleting task: ", taskID, " of ", caseID);
  try {
    // delete (pull) object from the dueDates array
    const deleteTask = await prisma.task.delete({
      where: {
        id: taskID,
        caseID: caseID,
      },
    });
    console.log(`SUCCESS: task deleted.\n..........`);
    // HTTP response
    return Response.json({ success: deleteTask });
  } catch (err) {
    console.log(" > ERROR: document deletion failed.", err, "\n..........");
    return Response.json({ error: err });
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    // retrieve doc
    const res_ = await collection.findOne({ id: id });
    if (res_) return Response.json({ success: res_ });
    else return Response.json({ failed: "no case found" });
  } catch (err) {
    console.log(" > ERROR: document retrieval erred.", err, "\n..........");
    return Response.json({ error: err });
  }
}
