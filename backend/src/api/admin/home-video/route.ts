import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { HOME_VIDEO_MODULE } from "../../../modules/home-video";
import HomeVideoModuleService from "../../../modules/home-video/services";
import { DEFAULT_HOME_VIDEO } from "../../store/home-video/route";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  try {
    const homeVideoService: HomeVideoModuleService = req.scope.resolve(HOME_VIDEO_MODULE);
    const videos = await homeVideoService.listHomeVideos(
      {},
      { take: 1, order: { created_at: "DESC" } }
    );

    if (videos && videos.length > 0) {
      return res.status(200).json({ video: videos[0] });
    }

    return res.status(200).json({ video: DEFAULT_HOME_VIDEO });
  } catch (error: any) {
    console.error("Error fetching home video for admin:", error);
    return res.status(200).json({ video: DEFAULT_HOME_VIDEO });
  }
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  try {
    const homeVideoService: HomeVideoModuleService = req.scope.resolve(HOME_VIDEO_MODULE);
    const body = req.body as any;

    const existingVideos = await homeVideoService.listHomeVideos({}, { take: 1 });

    const payload = {
      title: body.title ?? null,
      subtitle: body.subtitle ?? null,
      video_url: body.video_url || DEFAULT_HOME_VIDEO.video_url,
      provider: body.provider || "vimeo",
      thumbnail_url: body.thumbnail_url ?? null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      autoplay: body.autoplay !== undefined ? Boolean(body.autoplay) : false,
      muted: body.muted !== undefined ? Boolean(body.muted) : true,
      loop: body.loop !== undefined ? Boolean(body.loop) : false,
    };

    let savedVideo;
    if (existingVideos && existingVideos.length > 0) {
      savedVideo = await homeVideoService.updateHomeVideos({
        id: existingVideos[0].id,
        ...payload,
      });
    } else {
      savedVideo = await homeVideoService.createHomeVideos(payload);
    }

    return res.status(200).json({ video: savedVideo });
  } catch (error: any) {
    console.error("Error updating home video:", error);
    return res.status(500).json({
      error: "Failed to update homepage video",
      message: error.message,
    });
  }
}
