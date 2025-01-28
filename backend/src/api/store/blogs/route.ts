import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: blogs } = await query.graph({
      entity: "blog",
      fields: [
        "*",
        "product_categories.*",
        "seo_details.*",
        "seo_details.metaSocial.*",
      ],
      filters: {
        ...(req.query.handle ? { handle: req.query.handle as string } : {}),
      },
    });

    res.status(200).json({ blogs: blogs, count: blogs.length });
  } catch (error) {
    console.error("Error listing blogs:", error);
    res
      .status(500)
      .json({ error: "Failed to list blogs.", message: error.message });
  }
}
