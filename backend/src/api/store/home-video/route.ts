import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { HOME_VIDEO_MODULE } from "../../../modules/home-video";
import HomeVideoModuleService from "../../../modules/home-video/services";

// Default client video details as rock-solid fallback
export const DEFAULT_HOME_VIDEO = {
  id: "default_home_video",
  title: "Handcrafted With Heritage & Care",
  subtitle: "Decades of custom fine jewelry design, diamond setting, and restoration in Overland Park & Kansas City.",
  video_url: "https://vimeo.com/1151439885/8c19318c2b",
  provider: "vimeo",
  thumbnail_url: null,
  is_active: true,
  autoplay: false,
  muted: true,
  loop: false,
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const homeVideoService: HomeVideoModuleService = req.scope.resolve(HOME_VIDEO_MODULE);
    
    // Retrieve current video configuration
    const videos = await homeVideoService.listHomeVideos(
      {},
      { take: 1, order: { created_at: "DESC" } }
    );

    if (videos && videos.length > 0) {
      return res.status(200).json({ video: videos[0] });
    }

    // Fallback to default only if no entry exists in DB at all
    return res.status(200).json({ video: DEFAULT_HOME_VIDEO });
  } catch (error: any) {
    console.warn("Could not query HomeVideo module (returning default):", error?.message || error);
    return res.status(200).json({ video: DEFAULT_HOME_VIDEO });
  }
}
