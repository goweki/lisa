import prisma from "@/lib/prisma";
export const revalidate = 3600; // false | 0 | number
const allowedModels = ["blog"];

export async function GET() {
  const url = new URL(request.url);
  const model_ = url.searchParams.get("model");
  if (!model_) {
    return Response.status(400).json({ message: "Bad Request" });
  }
  if (!allowedModels.includes(model_)) {
    return Response.status(401).json({ message: "Unauthorized" });
  }
  try {
    console.log(
      `........................\nGET REQUEST /api/data\n >`,
      model_ ? `model - ${model_}` : `All data`
    );
    // Query
    const data = await prisma[model_].findMany({});
    return Response.json({ success: cases });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/data GET \n >> ${error}\n`);
    return Response.status(500).json({ message: "Could not fetch data" });
  }
}
