import { ObjectId } from "mongodb";
import db_cluster from "@/lib/mongodb";
const collection = db_cluster.collection("issues");

export async function POST(request) {
  try {
    // request body
    const doc = await request.json();
    // doc structure: { name, type, source, institution }
    // console.log("POST REQUEST: new issue: ",doc.type.category," ",doc.type.type,"-",doc.name," "," in institution ",doc.institution);
    // insert doc
    const res_ = await collection.insertOne(doc);
    console.log(
      `SUCCESS: issue inserted - ${doc.name}, for institution ${doc.institution}.\n`
    );
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(
      `ERROR: issue insertion failed - ${doc.name}, for institution ${doc.institution}\n >> error: ${err}\n`
    );
    return Response.json({ error: err });
  }
}

export async function PUT(request) {
  try {
    // request body
    const doc = await request.json();
    const { _id, ...doc_ } = doc;
    // doc structure: { _id,name, type, source, institution }
    // console.log("PUT REQUEST: updating issue ", _id);
    // console.log(` > setting fields: ${Object.keys(doc_)}`);
    // update doc
    const res_ = collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...doc_ } }
    );
    console.log(`SUCCESS: issue updated - ${_id}\n`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: issue update failed - ${_id}\n >> error: ${err}, \n`);
    return Response.json({ error: err });
  }
}

export async function DELETE(request) {
  try {
    // request body
    const doc = await request.json();
    const { _id } = doc;
    // doc structure: { _id,name, type, source, institution }
    // console.log("DELETE REQUEST: deleting issue: ", _id);
    // delete doc
    const res_ = collection.deleteOne({ _id: new ObjectId(_id) });
    console.log(`SUCCESS: issue deleted - ${_id}\n`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: issue deletion failed: ${_id}\n >> error: ${err}\n`);
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
    console.log(`ERROR: issue retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
  }
}
