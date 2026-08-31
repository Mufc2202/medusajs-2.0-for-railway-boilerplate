import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import type { FileDTO } from "@medusajs/framework/types";
import { INSTAGRAM_FEED_MODULE } from "../../../modules/instagram-feed";
import InstagramFeedModuleService from "../../../modules/instagram-feed/services";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    
    // List all posts
    const posts = await service.listInstagramPosts({}, {
      order: {
        is_pinned: "DESC",
        display_order: "ASC",
        created_at: "DESC",
      },
    });

    res.status(200).json({ posts, count: posts.length });
  } catch (error: any) {
    console.error("Error getting instagram posts:", error);
    res.status(500).json({
      error: "Failed to get instagram posts.",
      message: error.message,
    });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    const files = req.files as Express.Multer.File[];

    let media_url = (req.body as any)?.media_url || "";

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
        media_url = result[0].url;
      }
    }

    const body = req.body as any;

    if (!media_url && body?.media_url) {
      media_url = body.media_url;
    }

    // Auto-derive media_url from embed code or permalink if not uploaded
    if (!media_url) {
      const linkSource = (body?.permalink || "") + " " + (body?.caption || "") + " " + (body?.embed_code || "");
      const match = linkSource.match(/(?:https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+))/i);
      if (match && match[1]) {
        media_url = `https://www.instagram.com/p/${match[1]}/embed/`;
      }
    }

    if (!media_url) {
      return res.status(400).json({
        error: "Bad Request",
        message: "An image file upload, media URL, or Instagram post/embed link is required.",
      });
    }

    // Clean up permalink if an embed code was passed as permalink
    let cleanPermalink = body.permalink || "https://www.instagram.com/dolgins_jewelry/";
    const permalinkMatch = cleanPermalink.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]+)/i);
    if (permalinkMatch && permalinkMatch[1]) {
      cleanPermalink = permalinkMatch[1] + "/";
    }

    const post = await service.createInstagramPosts({
      caption: body.caption || null,
      media_type: body.media_type || (cleanPermalink.includes("/reel/") ? "VIDEO" : "IMAGE"),
      media_url: media_url,
      thumbnail_url: body.thumbnail_url || null,
      permalink: cleanPermalink,
      instagram_id: body.instagram_id || null,
      likes_count: body.likes_count ? Number(body.likes_count) : 0,
      comments_count: body.comments_count ? Number(body.comments_count) : 0,
      is_visible: body.is_visible === "false" || body.is_visible === false ? false : true,
      is_pinned: body.is_pinned === "true" || body.is_pinned === true ? true : false,
      display_order: body.display_order ? Number(body.display_order) : 0,
      product_id: body.product_id || null,
      product_title: body.product_title || null,
      product_handle: body.product_handle || null,
      product_thumbnail: body.product_thumbnail || null,
      product_price: body.product_price || null,
      custom_cta_text: body.custom_cta_text || null,
      custom_cta_link: body.custom_cta_link || null,
      metadata: body.metadata ? (typeof body.metadata === "string" ? JSON.parse(body.metadata) : body.metadata) : null,
    });

    res.status(200).json({ post, message: "Instagram post created successfully" });
  } catch (error: any) {
    console.error("Error creating instagram post:", error);
    res.status(500).json({
      error: "Failed to create instagram post.",
      message: error.message,
    });
  }
}
