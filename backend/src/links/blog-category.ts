import BlogModule from "../modules/blog";
import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(BlogModule.linkable.blog, {
  linkable: ProductModule.linkable.productCategory,
  isList: true,
});
