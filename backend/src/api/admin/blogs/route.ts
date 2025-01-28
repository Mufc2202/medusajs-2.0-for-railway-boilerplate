import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BLOG_TYPE } from "./type";
import BlogModuleService from "../../../modules/blog/service";
import { BLOG_MODULE } from "../../../modules/blog";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import type { FileDTO } from "@medusajs/framework/types";
import { RemoteLink } from "@medusajs/framework/modules-sdk";

export async function POST(req: MedusaRequest<BLOG_TYPE>, res: MedusaResponse) {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);
    const remoteLink: RemoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );

    const categories = JSON.parse(req.body.categories || "");

    const blogImage = req.files as Express.Multer.File[];

    let upload_result: FileDTO | null = null;
    if (blogImage.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: blogImage?.map((f) => ({
            filename: f.originalname,
            mimeType: f.mimetype,
            content: f.buffer.toString("binary"),
            access: "public",
          })),
        },
      });
      if (result) {
        upload_result = result[0];
      }
    }

    const blog = await blogModuleService.createBlogs({
      ...req.body,
      ...(upload_result?.url && { image: upload_result?.url }),
    });

    if (blog.id && categories && categories.length > 0) {
      await Promise.all(
        categories.map(async (category: string) => {
          if (category) {
            await remoteLink.create({
              [BLOG_MODULE]: {
                blog_id: blog.id,
              },
              [Modules.PRODUCT]: {
                product_category_id: category,
              },
            });
          }
        })
      );
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res
      .status(500)
      .json({ error: "Failed to create blog.", message: error.message });
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    // const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);

    // const [blogs, count] = await blogModuleService.listAndCountBlogs();

    const { data: blogs } = await query.graph({
      entity: "blog",
      fields: [
        "*",
        "product_categories.*",
        "seo_details.*",
        "seo_details.metaSocial.*",
      ],
    });

    res.status(200).json({ blogs: blogs, count: blogs.length });
  } catch (error) {
    console.error("Error listing blogs:", error);
    res
      .status(500)
      .json({ error: "Failed to list blogs.", message: error.message });
  }
}
