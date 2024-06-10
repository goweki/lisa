import prisma from "@/lib/prisma";
export const revalidate = 3600; // false | 0 | number
const allowedModels = ["blog"];

export async function GET(request) {
  const url = new URL(request.url);
  const model_ = url.searchParams.get("model");
  if (!model_) {
    return Response.json("Bad Request", { status: 400 });
  }
  if (!allowedModels.includes(model_)) {
    return Response.json("Unauthorized", { status: 401 });
  }
  try {
    console.log(
      `........................\nGET REQUEST /api/data\n >`,
      model_ ? `model - ${model_}` : `All data`
    );
    // Query
    const data = await prisma[model_].findMany({});
    return Response.json({ success: data });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/data GET \n`, error);
    return Response.json("Server Error", { status: 500 });
  }
}
