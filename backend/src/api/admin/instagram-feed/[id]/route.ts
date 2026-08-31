import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  deleteFilesWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows";
import type { FileDTO } from "@medusajs/framework/types";
import { INSTAGRAM_FEED_MODULE } from "../../../../modules/instagram-feed";
import InstagramFeedModuleService from "../../../../modules/instagram-feed/services";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const id = req.params.id;
  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    const post = await service.retrieveInstagramPost(id);
    res.status(200).json({ post });
  } catch (error: any) {
    console.error(`Error getting instagram post with id ${id}:`, error);
    res.status(500).json({
      error: "Failed to get instagram post.",
      message: error.message,
    });
  }
}

export async function PUT(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const id = req.params.id;

  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [oldPost],
    } = await query.graph({
      entity: "instagram_post",
      fields: ["*"],
      filters: { id },
    });

    if (!oldPost) {
      return res.status(404).json({
        error: "Not Found",
        message: `Instagram post with id ${id} was not found.`,
      });
    }

    const files = req.files as Express.Multer.File[];
    let new_media_url: string | undefined = undefined;

    if (files && files.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: files.map((f) => ({
            filename: f.originalname,
            mimeType: f.mimetype,
            content: f.buffer.toString("binary"),
            access: "public",
          })),
        },
      });
      if (result && result.length > 0) {
        new_media_url = result[0].url;
      }
    }

    const body = req.body as any;

    const updatePayload: Record<string, any> = {
      id,
    };

    if (body.caption !== undefined) updatePayload.caption = body.caption;
    if (body.media_type !== undefined) updatePayload.media_type = body.media_type;
    if (new_media_url) updatePayload.media_url = new_media_url;
    else if (body.media_url !== undefined) updatePayload.media_url = body.media_url;
    
    if (body.thumbnail_url !== undefined) updatePayload.thumbnail_url = body.thumbnail_url;
    if (body.permalink !== undefined) updatePayload.permalink = body.permalink;
    if (body.instagram_id !== undefined) updatePayload.instagram_id = body.instagram_id;
    if (body.likes_count !== undefined) updatePayload.likes_count = Number(body.likes_count);
    if (body.comments_count !== undefined) updatePayload.comments_count = Number(body.comments_count);
    if (body.display_order !== undefined) updatePayload.display_order = Number(body.display_order);
    
    if (body.is_visible !== undefined) {
      updatePayload.is_visible = body.is_visible === "true" || body.is_visible === true;
    }
    if (body.is_pinned !== undefined) {
      updatePayload.is_pinned = body.is_pinned === "true" || body.is_pinned === true;
    }

    if (body.product_id !== undefined) updatePayload.product_id = body.product_id || null;
    if (body.product_title !== undefined) updatePayload.product_title = body.product_title || null;
    if (body.product_handle !== undefined) updatePayload.product_handle = body.product_handle || null;
    if (body.product_thumbnail !== undefined) updatePayload.product_thumbnail = body.product_thumbnail || null;
    if (body.product_price !== undefined) updatePayload.product_price = body.product_price || null;
    if (body.custom_cta_text !== undefined) updatePayload.custom_cta_text = body.custom_cta_text || null;
    if (body.custom_cta_link !== undefined) updatePayload.custom_cta_link = body.custom_cta_link || null;
    if (body.metadata !== undefined) {
      updatePayload.metadata = typeof body.metadata === "string" ? JSON.parse(body.metadata) : body.metadata;
    }

    const updated = await service.updateInstagramPosts(updatePayload);

    // Delete old uploaded image if new one was uploaded
    if (new_media_url && oldPost?.media_url && oldPost.media_url.includes(process.env.MINIO_BUCKET || "medusa-media")) {
      const key = oldPost.media_url.split("/").pop();
      if (key) {
        try {
          await deleteFilesWorkflow(req.scope).run({
            input: { ids: [key] },
          });
        } catch (delErr) {
          console.warn("Failed to delete old image file:", delErr);
        }
      }
    }

    res.status(200).json({ post: updated, message: "Post updated successfully" });
  } catch (error: any) {
    console.error("Error updating instagram post:", error);
    res.status(500).json({
      error: "Failed to update instagram post.",
      message: error.message,
    });
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const id = req.params.id;
  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    const postData = await service.retrieveInstagramPost(id);

    if (!postData) {
      return res.status(404).json({
        error: "Not Found",
        message: `Instagram post with id ${id} not found.`,
      });
    }

    const deleted = await service.deleteInstagramPosts(id);

    if (postData?.media_url && postData.media_url.includes(process.env.MINIO_BUCKET || "medusa-media")) {
      const key = postData.media_url.split("/").pop();
      if (key) {
        try {
          await deleteFilesWorkflow(req.scope).run({
            input: { ids: [key] },
          });
        } catch (delErr) {
          console.warn("Failed to delete media file:", delErr);
        }
      }
    }

    res.status(200).json({ post: deleted, message: "Instagram post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting instagram post:", error);
    res.status(500).json({
      error: "Failed to delete instagram post.",
      message: error.message,
    });
  }
}
