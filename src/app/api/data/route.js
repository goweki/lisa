import db_cluster from "@/lib/mongodb";
export const revalidate = 0; // false | 'force-cache' | 0 | number

export async function GET(req) {
  const url = new URL(req.url);
  const collection_ = url.searchParams.get("colle");
  try {
    console.log(
      `........................\nGET REQUEST /api/data\n > collection: ${collection_}`
    );
    // target COLLECTION
    const collection = db_cluster.collection(collection_);
    // FIND Docs
    const data_ = await collection.find({}).toArray();
    return Response.json({ success: data_ });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/data GET \n >> ${error}\n`);
    return Response.json({
      error: "Could not fetch data",
    });
  }
}
