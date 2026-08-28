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
    const remoteLink = req.scope.resolve(
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
    const newCategoryIds: string[] = Array.isArray(newCategories)
      ? newCategories.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];

    const categoriesToDelete = existingCategoryIds.filter(
      (id) => id && !newCategoryIds.includes(id)
    );

    const categoriesToAdd = newCategoryIds.filter(
      (id) => !existingCategoryIds.includes(id)
    );

    // Step 4: Delete/dismiss links for categories to be removed
    if (categoriesToDelete.length > 0) {
      const deletePromises = categoriesToDelete.map(async (categoryId) => {
        const linkObj = {
          [BLOG_MODULE]: { blog_id: blogId },
          [Modules.PRODUCT]: { product_category_id: categoryId },
        };
        try {
          if (typeof (remoteLink as any).dismiss === "function") {
            await (remoteLink as any).dismiss(linkObj);
          } else {
            await remoteLink.delete(linkObj);
          }
        } catch (delErr) {
          try {
            await remoteLink.delete(linkObj);
          } catch (e) {}
        }
      });

      await Promise.all(deletePromises);
    }

    // Step 5: Add links ONLY for newly assigned categories that do not already exist
    if (categoriesToAdd.length > 0) {
      const createPromises = categoriesToAdd.map(async (categoryId) => {
        const linkObj = {
          [BLOG_MODULE]: { blog_id: blogId },
          [Modules.PRODUCT]: { product_category_id: categoryId },
        };
        try {
          await remoteLink.create(linkObj);
        } catch (createErr) {
          try {
            if (typeof (remoteLink as any).restore === "function") {
              await (remoteLink as any).restore(linkObj);
            }
          } catch (restoreErr) {
            // Already active or restored
          }
        }
      });

      await Promise.all(createPromises);
    }

    // Ensure author link exists if not already present
    if (!oldBlog?.user && req.auth_context?.actor_id) {
      try {
        await remoteLink.create({
          [BLOG_MODULE]: {
            blog_id: blogId,
          },
          [Modules.USER]: {
            user_id: req.auth_context.actor_id,
          },
        });
      } catch (linkErr) {
        // User link may already exist
      }
    }

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
