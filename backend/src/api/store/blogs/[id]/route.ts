import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [blog],
    } = await query.graph({
      entity: "blog",
      fields: [
        "*",
        "blogSeo.*",
        "product_categories.*",
        "seo_details.*",
        "seo_details.metaSocial.*",
      ],
      filters: {
        id: req.params.id,
      },
    });

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error retrieving blog:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve blog.", message: error.message });
  }
}
