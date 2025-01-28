import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductSeoModule from "../modules/product-seo";

export default defineLink(ProductModule.linkable.product, {
	linkable: ProductSeoModule.linkable.seoDetails,
	deleteCascade: true,
});
