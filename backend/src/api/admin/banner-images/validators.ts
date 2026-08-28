import { z } from "zod";

export const CreateBannerSchema = z.object({
	name: z.string(),
	link: z.string().optional(),
	image: z.string().optional(),
	text: z.string(),
	isActive: z.string().optional(),
});

export const UpdateBannerSchema = z.object({
	name: z.string(),
	link: z.string().optional(),
	image: z.string().optional(),
	text: z.string(),
	isActive: z.string().optional(),
});
