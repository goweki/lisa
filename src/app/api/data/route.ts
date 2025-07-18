import prisma from "@/lib/prisma/prisma";
export const revalidate = 3600;

const allowedModels = ["blog"] as const;
type AllowedModel = (typeof allowedModels)[number];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const model_ = url.searchParams.get("collection") as AllowedModel | null;

  if (!model_) {
    return Response.json("Bad Request", { status: 400 });
  }

  if (!allowedModels.includes(model_)) {
    return Response.json("Unauthorized", { status: 401 });
  }

  try {
    console.log(
      `........................\nGET REQUEST /api/data\n > model - ${model_}`
    );

    let data;
    switch (model_) {
      case "blog":
        data = await prisma.blog.findMany();
        break;
      default:
        return Response.json("Unauthorized", { status: 401 });
    }

    return Response.json(data);
  } catch (error) {
    console.log(` > Error caught at api/data GET \n`, error);
    return Response.json("Server Error", { status: 500 });
  }
}
