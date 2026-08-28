import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
import { BANNER_MODULE } from "../../../modules/banner";
import BannerModuleService from "../../../modules/banner/services";

export async function GET(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
) {
	try {
		const bannerModuleService: BannerModuleService =
			req.scope.resolve(BANNER_MODULE);
		const bannerList = await bannerModuleService.listBanners();
		res.status(200).json({ bannerList });
	} catch (error) {
		console.error("Error getting banner:", error);
		res
			.status(500)
			.json({ error: "Failed to get banner.", message: error.message });
	}
}
