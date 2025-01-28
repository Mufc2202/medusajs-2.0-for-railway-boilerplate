import { defineLink } from "@medusajs/framework/utils";
import BlogModule from "../modules/blog";
import SeoModule from "../modules/product-seo";

export default defineLink(BlogModule.linkable.blog, {
  linkable: SeoModule.linkable.seoDetails,
  deleteCascade: true,
});
