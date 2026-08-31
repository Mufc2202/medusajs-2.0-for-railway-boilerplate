import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { INSTAGRAM_FEED_MODULE } from "../../../modules/instagram-feed";
import InstagramFeedModuleService from "../../../modules/instagram-feed/services";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const service: InstagramFeedModuleService = req.scope.resolve(INSTAGRAM_FEED_MODULE);
    
    // Fetch all posts ordered by pinned, display_order, created_at
    const allPosts = await service.listInstagramPosts(
      {},
      {
        order: {
          is_pinned: "DESC",
          display_order: "ASC",
          created_at: "DESC",
        },
      }
    );

    // Filter strictly to visible posts
    const visiblePosts = allPosts.filter(
      (p: any) => p.is_visible === true || p.is_visible === "true"
    );

    res.status(200).json({
      handle: "dolgins_jewelry",
      profile_url: "https://www.instagram.com/dolgins_jewelry/",
      title: "Follow Our Journey",
      subtitle: "@dolgins_jewelry — Custom jewelry, engagement rings & fine jewelry moments in Overland Park & Kansas City",
      posts: visiblePosts,
      count: visiblePosts.length,
    });
  } catch (error: any) {
    console.error("Error getting store instagram feed:", error);
    res.status(500).json({
      error: "Failed to get instagram feed.",
      message: error.message,
    });
  }
}
