import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { INSTAGRAM_FEED_MODULE } from "../../../../modules/instagram-feed";
import InstagramFeedModuleService from "../../../../modules/instagram-feed/services";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      return res.status(200).json({
        success: false,
        configured: false,
        message:
          "Instagram Access Token is not configured in backend/.env. Refer to INSTAGRAM_LIVE_SYNC_GUIDE.md to obtain your 60-day token.",
      });
    }

    const service: InstagramFeedModuleService = req.scope.resolve(
      INSTAGRAM_FEED_MODULE
    );

    // Call Meta Graph API for Instagram media
    const graphUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=20&access_token=${token}`;

    const apiRes = await fetch(graphUrl);

    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({}));
      return res.status(400).json({
        success: false,
        configured: true,
        error: errorData?.error?.message || "Failed to fetch media from Meta Graph API.",
      });
    }

    const { data: mediaItems } = await apiRes.json();

    if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
      return res.status(200).json({
        success: true,
        configured: true,
        count: 0,
        message: "No posts found on connected Instagram account.",
      });
    }

    // Retrieve existing posts to avoid duplicates
    const existingPosts = await service.listInstagramPosts({});
    let syncedCount = 0;

    for (const item of mediaItems) {
      const mediaUrl =
        item.media_type === "VIDEO" && item.thumbnail_url
          ? item.thumbnail_url
          : item.media_url;

      if (!mediaUrl) continue;

      const existing = existingPosts.find(
        (p: any) =>
          (item.id && p.instagram_id === item.id) ||
          (item.permalink && p.permalink === item.permalink)
      );

      if (existing) {
        await service.updateInstagramPosts({
          id: existing.id,
          caption: item.caption || existing.caption,
          media_type: item.media_type || existing.media_type,
          media_url: mediaUrl,
          thumbnail_url: item.thumbnail_url || existing.thumbnail_url,
          permalink: item.permalink || existing.permalink,
          instagram_id: item.id || existing.instagram_id,
        });
      } else {
        await service.createInstagramPosts({
          caption: item.caption || null,
          media_type: item.media_type || "IMAGE",
          media_url: mediaUrl,
          thumbnail_url: item.thumbnail_url || null,
          permalink: item.permalink || "https://www.instagram.com/dolgins_jewelry/",
          instagram_id: item.id || null,
          likes_count: 0,
          comments_count: 0,
          is_visible: true,
          is_pinned: false,
          display_order: existingPosts.length + syncedCount + 1,
        });
        syncedCount++;
      }
    }

    res.status(200).json({
      success: true,
      configured: true,
      count: mediaItems.length,
      new_posts: syncedCount,
      message: `Successfully synced ${mediaItems.length} posts from @dolgins_jewelry!`,
    });
  } catch (error: any) {
    console.error("Error syncing Instagram feed:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error during Instagram sync.",
      message: error.message,
    });
  }
}
