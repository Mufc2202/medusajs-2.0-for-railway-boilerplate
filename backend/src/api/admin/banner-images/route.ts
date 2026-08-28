import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { BANNER_MODULE } from "../../../modules/banner";
import BannerModuleService from "../../../modules/banner/services";
import type { FileDTO } from "@medusajs/framework/types";
import { BANNER_TYPE } from "./type";

export async function POST(
	req: AuthenticatedMedusaRequest<BANNER_TYPE>,
	res: MedusaResponse
) {
	try {
		const bannerModuleService: BannerModuleService =
			req.scope.resolve(BANNER_MODULE);

		const bannerImage = req.files as Express.Multer.File[];

		let upload_result: FileDTO[] | null = null;
		if (bannerImage && bannerImage?.length > 0) {
			const { result } = await uploadFilesWorkflow(req.scope).run({
				input: {
					files: bannerImage?.map((f) => ({
						filename: f.originalname,
						mimeType: f.mimetype,
						content: f.buffer.toString("binary"),
						access: "public",
					})),
				},
			});
			upload_result = result;
		}

		await bannerModuleService.createBanners({
			name: (req.body as any)?.name,
			text: (req.body as any)?.text,
			link: (req.body as any)?.link,
			image: upload_result?.[0].url,
			isActive: req?.body?.isActive === "true" ? true : false,
		});

		res.status(200).json("ok");
	} catch (error) {
		console.error("Error creating banner:", error);
		res
			.status(500)
			.json({ error: "Failed to create banner.", message: error.message });
	}
}
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
