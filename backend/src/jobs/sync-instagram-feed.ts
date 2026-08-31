import { MedusaContainer } from "@medusajs/types";
import { INSTAGRAM_FEED_MODULE } from "../modules/instagram-feed";
import InstagramFeedModuleService from "../modules/instagram-feed/services";

export default async function syncInstagramFeedJob(container: MedusaContainer) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return;
  }

  try {
    const service: InstagramFeedModuleService = container.resolve(
      INSTAGRAM_FEED_MODULE
    );

    const graphUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=20&access_token=${token}`;

    const apiRes = await fetch(graphUrl);
    if (!apiRes.ok) {
      console.warn("Instagram cron sync: Meta API returned status", apiRes.status);
      return;
    }

    const { data: mediaItems } = await apiRes.json();
    if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
      return;
    }

    const existingPosts = await service.listInstagramPosts({});

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
          display_order: 0,
        });
      }
    }

    console.log(`Instagram cron sync completed: checked ${mediaItems.length} media items.`);
  } catch (err) {
    console.error("Instagram cron sync job error:", err);
  }
}

export const config = {
  name: "sync-instagram-feed-job",
  schedule: "0 */12 * * *", // Runs every 12 hours
};
