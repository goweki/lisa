import prisma from "@/lib/prisma";
// const collection = db_cluster.collection("cases");

export async function POST(request) {
  try {
    // request body
    const doc = await request.json();
    console.log("POST REQUEST: new case: ", doc);
    // insert doc
    const res_ = await prisma.case.create({ data: doc });
    console.log(
      `SUCCESS: case inserted, for institution ${doc.institution}.\n >${res_.name}`
    );
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(
      `ERROR: case insertion failed -route:/api/dashboard/case POST\n >> error: ${err}\n`
    );
    return Response.json({ error: err });
  }
}

export async function PUT(request) {
  try {
    // request body
    const doc = await request.json();
    const { id, ...doc_ } = doc;

    // console.log("PUT REQUEST: updating case ",id);
    // console.log(` > setting fields: ${Object.keys(doc_)}`);
    // update doc
    const res_ = await prisma.case.update({
      where: { id },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: case updated - ${id}\n`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(`ERROR: case update failed - ${_id}\n >> error: ${err}, \n`);
    return Response.json({ error: err });
  }
}

export async function DELETE(request) {
  try {
    // request body
    const doc = await request.json();
    const { id } = doc;
    console.log("DELETE REQUEST: deleting case: ", id);
    // delete doc
    const res = await prisma.case.delete({ where: { id } });
    console.log(`SUCCESS: case deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(`ERROR: case deletion failed: ${_id}\n >> error: ${err}\n`);
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
    else return Response.json({ failed: "no case found" });
  } catch (err) {
    console.log(`ERROR: case retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
  }
}
