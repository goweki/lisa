import db_cluster from "@/lib/mongodb";
export const revalidate = 0; // false | 'force-cache' | 0 | number

export async function GET(req) {
  const url = new URL(req.url);
  const institution = url.searchParams.get("institution");
  try {
    console.log(
      `........................\nGET REQUEST for ${institution} UI data`
    );
    // target COLLECTIONS
    const colle_issues = db_cluster.collection("issues");
    // FIND Docs
    const issues = await colle_issues
      .find(institution === "lisa" ? {} : { institution: institution })
      .toArray();
    // console.log(` > Success`);
    // console.log(` >> ${JSON.stringify(issues)}\n........................`);
    // HTTP response
    return Response.json({ success: issues });
  } catch (error) {
    // handle ERROR if caught
    console.log(`> Error caught at api/data GET \n >> ${error}\n`);
    return Response.json({
      error: "Could not fetch data",
    });
  }
}
