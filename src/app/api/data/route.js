import prisma from "@/lib/prisma";
export const revalidate = 0; // false | 'force-cache' | 0 | number

export async function GET(req) {
  const url = new URL(req.url);
  const model_ = url.searchParams.get("model");
  try {
    console.log(
      `........................\nGET REQUEST /api/data\n > collection: ${model_}`
    );
    // Access the model dynamically
    const model = prisma[model_];
    // Query
    const data_ = await model.findMany();
    return Response.json({ success: data_ });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/data GET \n >> ${error}\n`);
    return Response.json({
      error: "Could not fetch data",
    });
  }
}
