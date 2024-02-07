import { ObjectId } from "mongodb";
import db_cluster from "@/lib/mongodb";
const collection = db_cluster.collection("issues");

export async function POST(request) {
  // request body
  // doc structure: {issueId,type,date,name}
  const { issueId, type, name, date } = await request.json();
  //   console.log(
  //     "POST REQUEST: new task: ",
  //     name,
  //     " of type ",
  //     type,
  //     " in issue: ",
  //     issueId
  //   );
  try {
    //
    if (
      await collection.findOne({
        _id: new ObjectId(issueId),
        "dueDates.task.name": name,
      })
    ) {
      // HTTP response - task name exists
      console.log(` > FAILED: task-document already exists.\n..........`);
      return Response.json({ failed: "task already exists" });
    } else {
      // insert doc
      const res_ = await collection.updateOne(
        { _id: new ObjectId(issueId) },
        {
          $push: {
            dueDates: { type, date, task: { name: name, complete: "" } },
          },
        }
      );
      console.log(` > SUCCESS: task-document inserted.\n..........`);
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
  const doc = await request.json();
  const { _id, ...doc_ } = doc;
  // doc structure: { _id,name, type, source, institution }
  console.log("PUT REQUEST: updating issue ", _id);
  try {
    // console.log(` > setting fields: ${Object.keys(doc_)}`);
    // update doc
    const res_ = collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...doc_ } }
    );
    console.log(` > SUCCESS: document updated.\n..........`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.log(" > ERROR: document update failed.", err, "\n..........");
    return Response.json({ error: err });
  }
}

export async function DELETE(request) {
  // request body
  const doc = await request.json();
  const { _id } = doc;
  // doc structure: { _id,name, type, source, institution }
  console.log("DELETE REQUEST: deleting issue: ", _id);
  try {
    // delete doc
    const res_ = collection.deleteOne({ _id: new ObjectId(_id) });
    console.log(` > SUCCESS: document deleted.\n..........`);
    // HTTP response
    return Response.json({ success: res_ });
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
    const res_ = await collection.findOne({ _id: new ObjectId(id) });
    if (res_) return Response.json({ success: res_ });
    else return Response.json({ failed: "no issue found" });
  } catch (err) {
    console.log(" > ERROR: document retrieval erred.", err, "\n..........");
    return Response.json({ error: err });
  }
}
