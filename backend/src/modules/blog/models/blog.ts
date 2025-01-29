import { model } from "@medusajs/framework/utils";

const Blog = model.define("blog", {
	id: model.id().primaryKey(),
	title: model.text(),
	subtitle: model.text().nullable(),
	handle: model.text().unique(),
	image: model.text().nullable(),
	content: model.text(),
});

export default Blog;
