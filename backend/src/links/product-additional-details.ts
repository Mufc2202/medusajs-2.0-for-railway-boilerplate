import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductAdditionalDetailsModule from "../modules/product-additional-details";

export default defineLink(ProductModule.linkable.product, {
	linkable: ProductAdditionalDetailsModule.linkable.additionalDetails,
	deleteCascade: true,
});
