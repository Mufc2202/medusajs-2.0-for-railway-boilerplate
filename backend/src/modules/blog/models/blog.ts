import { model } from "@medusajs/framework/utils";
import BlogSeo from "./blog_seo";

const Blog = model.define("blog", {
	id: model.id().primaryKey(),
	title: model.text(),
	subtitle: model.text().nullable(),
	handle: model.text().unique(),
	image: model.text().nullable(),
	content: model.text(),
	blogSeo: model.hasOne(() => BlogSeo).nullable(),
});

export default Blog;
