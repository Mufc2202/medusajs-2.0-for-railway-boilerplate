import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductCategoryDetailsModule from "../modules/product-category-details";

export default defineLink(ProductModule.linkable.productCategory, {
	linkable: ProductCategoryDetailsModule.linkable.categoryDetails,
	deleteCascade: true,
});
