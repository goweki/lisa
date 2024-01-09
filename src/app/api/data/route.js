import db_cluster from "@/lib/mongodb";
export const revalidate = 0; // false | 'force-cache' | 0 | number

export async function GET(request) {
  try {
    console.log(`........................\nROUTE: GET REQUEST -/data`);
    // target COLLECTIONS
    const colle_issues = db_cluster.collection("issues");
    // FIND Docs
    const issues = await colle_issues.find({}).toArray();
    console.log(` > Success\n........................`);
    // HTTP response
    return Response.json({ success: { issues: issues } });
  } catch (error) {
    // handle ERROR if caught
    console.log(
      `> Error caught\n >> ${JSON.stringify(
        error.error || error
      )}\n........................`
    );
    return Response.json({
      error: "Could not GET -/data",
    });
  }
}
