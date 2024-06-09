import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // request body
    const doc = await request.json();
    console.log("POST REQUEST: new institution: ", doc);
    // insert doc
    const newInst = await prisma.institution.create({ data: doc });
    if (!newInst) {
      console.error("FAILED: didnt save new institution.\n > ", doc);
      return Response.json({ failed: "Failed saving new institution" });
    }
    console.log("SUCCESS: institution inserted.\n > ", newInst);
    return Response.json({ success: newInst });
  } catch (err) {
    console.error(
      "ERROR: institution insertion failed -route:/api/dashboard/institution POST\n >> error:",
      err
    );
    return Response.json({ failed: "Server error" });
  }
}

export async function PUT(request) {
  try {
    // request body
    const doc = await request.json();
    const { id, ...doc_ } = doc;

    // console.log("PUT REQUEST: updating institution ",id);
    console.log(` > updating - data: ${doc}`);
    // update doc
    const res_ = await prisma.institution.update({
      where: { id },
      data: {
        ...doc_,
      },
    });
    console.log(`SUCCESS: institution updated - ${id}\n`);
    // HTTP response
    return Response.json({ success: res_ });
  } catch (err) {
    console.error(
      `ERROR: institution update failed - ${_id}\n >> error: ${err}, \n`
    );
    return Response.json({ error: err });
  }
}

export async function DELETE(request) {
  try {
    // request body
    const doc = await request.json();
    const { id } = doc;
    console.log("DELETE REQUEST: deleting institution: ", id);
    // delete doc
    const res = await prisma.institution.delete({ where: { id } });
    console.log(`SUCCESS: institution deleted - ${id}\n`);
    // HTTP response
    return Response.json({ success: res });
  } catch (err) {
    console.error(
      `ERROR: institution deletion failed: ${_id}\n >> error: ${err}\n`
    );
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
    else return Response.json({ failed: "no institution found" });
  } catch (err) {
    console.log(`ERROR: institution retrieval erred.\n >> ${err} \n..........`);
    return Response.json({ error: err });
  }
}
