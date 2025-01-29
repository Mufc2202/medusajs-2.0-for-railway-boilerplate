import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { UPDATE_BLOG_TYPE } from "../type";
import BlogModuleService from "../../../../modules/blog/service";
import { BLOG_MODULE } from "../../../../modules/blog";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import type { FileDTO } from "@medusajs/framework/types";
import { RemoteLink } from "@medusajs/framework/modules-sdk";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE);
    // const blog = await blogModuleService.retrieveBlog(req.params.id);

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
        "user.*",
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

export async function PUT(
  req: AuthenticatedMedusaRequest<UPDATE_BLOG_TYPE>,
  res: MedusaResponse
) {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const remoteLink: RemoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );
    const blogId = req.params.id;
    const blogImage = req.files as Express.Multer.File[];
    const newCategories =
      typeof req.body.categories === "string"
        ? JSON.parse(req.body.categories)
        : req.body.categories;
    // Step 1: Fetch the old blog and existing category IDs
    const {
      data: [oldBlog],
    } = await query.graph({
      entity: "blog",
      fields: ["*", "product_categories.id"],
      filters: { id: blogId },
    });

    const existingCategoryIds =
      oldBlog?.product_categories?.map((cat) => cat?.id) || [];
    let upload_result: FileDTO | null = null;
    if (blogImage?.length > 0) {
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

    // Step 2: Update the blog
    const blogUpdate = await blogModuleService.updateBlogs({
      id: blogId,
      ...req.body,
      ...(upload_result?.url && { image: upload_result?.url }),
    });

    // Step 3: Determine distinct categories to add and delete
    const newCategoryIds = Array.isArray(newCategories) ? newCategories : [];

    const categoriesToDelete = existingCategoryIds.filter(
      (id) => !newCategoryIds.includes(id || "")
    );

    // Step 4: Delete links for categories to be removed
    if (categoriesToDelete.length > 0) {
      const deletePromises = categoriesToDelete.map((categoryId) => {
        return remoteLink.delete({
          [BLOG_MODULE]: { blog_id: blogId },
          [Modules.PRODUCT]: { product_category_id: categoryId || "" },
        });
      });

      await Promise.all(deletePromises);
    }

    // Step 5: Add links for new categories
    if (newCategoryIds.length > 0) {
      const createPromises = newCategoryIds.map((categoryId) => {
        return remoteLink.create({
          [BLOG_MODULE]: { blog_id: blogId },
          [Modules.PRODUCT]: { product_category_id: categoryId },
        });
      });

      await Promise.all(createPromises);
    }

    await remoteLink.create({
      [BLOG_MODULE]: {
        blog_id: blogId,
      },
      [Modules.USER]: {
        user_id: req.auth_context.actor_id,
      },
    });

    res.status(200).json(blogUpdate);
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ error: "Failed to update blog.", message: error.message });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);

    const blog = await blogModuleService.deleteBlogs(req.params.id);

    res.status(200).json({ blog, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .json({ error: "Failed to delete blog.", message: error.message });
  }
}
