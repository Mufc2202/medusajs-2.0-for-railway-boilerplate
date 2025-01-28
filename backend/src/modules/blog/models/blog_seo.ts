import { model } from "@medusajs/framework/utils";
import Blog from "./blog";

const BlogSeo = model.define("blog_seo", {
  id: model.id().primaryKey(),
  meta_title: model.text().nullable(),
  meta_description: model.text().nullable(),
  meta_image: model.text().nullable(),
  blog: model.belongsTo(() => Blog, {
    mappedBy: "blogSeo",
  }),
});

export default BlogSeo;
