import { model } from "@medusajs/framework/utils";

const Banner = model.define("banner", {
	id: model.id().primaryKey(),
	name: model.text(),
	text: model.text(),
	link: model.text().nullable(),
	image: model.text().nullable(),
	metadata: model.json().nullable(),
	isActive: model.boolean().default(false),
});

export default Banner;
