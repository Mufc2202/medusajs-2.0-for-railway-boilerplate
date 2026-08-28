import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SeoModule from "../modules/product-seo";

export default defineLink(ProductModule.linkable.productCategory, {
	linkable: SeoModule.linkable.seoDetails,
	deleteCascade: true,
});
