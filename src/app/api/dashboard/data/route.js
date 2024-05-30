import db_cluster from "@/lib/mongodb";
export const revalidate = 0; // false | 'force-cache' | 0 | number

export async function GET(req) {
  const url = new URL(req.url);
  const institution = url.searchParams.get("institution");
  try {
    console.log(
      `........................\nGET REQUEST /api/dashboard/data\n > institution: ${institution}`
    );
    // target COLLECTIONS
    const colle_issues = db_cluster.collection("issues");
    const colle_templates = db_cluster.collection("issue-templates");
    // FIND Docs
    const issues = await colle_issues
      .find(institution === "lisa" ? {} : { institution: institution })
      .toArray();
    const templates = await colle_templates.find({}).toArray();
    // HTTP response
    return Response.json({ success: { templates, issues } });
  } catch (error) {
    // handle ERROR if caught
    console.log(`> Error caught at api/dashboard/data GET \n >> ${error}\n`);
    return Response.json({
      error: "Could not fetch data",
    });
  }
}
