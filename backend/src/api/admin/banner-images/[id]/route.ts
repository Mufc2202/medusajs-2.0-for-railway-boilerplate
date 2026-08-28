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
import { BANNER_TYPE } from "../type";
import BannerModuleService from "../../../../modules/banner/services";
import { BANNER_MODULE } from "../../../../modules/banner";

export async function PUT(
	req: AuthenticatedMedusaRequest<BANNER_TYPE>,
	res: MedusaResponse
) {
	const id = req.params.id;

	try {
		const bannerModuleService: BannerModuleService =
			req.scope.resolve(BANNER_MODULE);
		const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

		const {
			data: [oldBanner],
		} = await query.graph({
			entity: "banner",
			fields: ["*"],
			filters: { id },
		});

		console.log({ files: req.files, body: req.body, oldBanner });

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

		const data = await bannerModuleService.updateBanners({
			...oldBanner,
			id,
			...req.body,
			...{ isActive: req?.body?.isActive === "true" ? true : false },
			...(upload_result?.[0]?.url ? { image: upload_result?.[0]?.url } : {}),
		});

		if (
			(upload_result?.[0]?.url || req.body?.image === "") &&
			oldBanner?.image
		) {
			const key = oldBanner.image
				.split(`/${process.env.MINIO_S3_BUCKET! || process.env.S3_BUCKET!}/`)
				.at(-1);

			if (key)
				await deleteFilesWorkflow(req.scope).run({
					input: {
						ids: [key],
					},
				});
		}

		res.status(200).json(data);
	} catch (error) {
		console.error("Error updating banner:", error);
		res
			.status(500)
			.json({ error: "Failed to update banner.", message: error.message });
	}
}
export async function GET(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
) {
	const id = req.params.id;
	try {
		const bannerModuleService: BannerModuleService =
			req.scope.resolve(BANNER_MODULE);
		const bannerList = await bannerModuleService.retrieveBanner(id);
		res.status(200).json({ bannerList });
	} catch (error) {
		console.error(`Error getting banner with id ${id}:`, error);
		res
			.status(500)
			.json({ error: "Failed to get banner.", message: error.message });
	}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	try {
		const bannerModuleService: BannerModuleService =
			req.scope.resolve(BANNER_MODULE);

		const bannerData = await bannerModuleService.retrieveBanner(req.params.id);

		if (!bannerData)
			return res.status(400).json({
				error: "Not Found",
				message: `Banner Not Found with id ${req.params.id}`,
			});

		const banner = await bannerModuleService.deleteBanners(req.params.id);

		if (bannerData?.image) {
			const key = bannerData.image
				.split(`/${process.env.MINIO_S3_BUCKET! || process.env.S3_BUCKET!}/`)
				.at(-1);

			if (key)
				await deleteFilesWorkflow(req.scope).run({
					input: {
						ids: [key],
					},
				});
		}

		res.status(200).json({ banner, message: "Banner deleted successfully" });
	} catch (error) {
		console.error("Error deleting banner:", error);
		res
			.status(500)
			.json({ error: "Failed to delete banner.", message: error.message });
	}
}
