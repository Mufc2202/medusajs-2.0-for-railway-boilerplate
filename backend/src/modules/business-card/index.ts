import { Module } from "@medusajs/framework/utils";
import BusinessCardModuleService from "./services";

export const BUSINESS_CARD_MODULE = "businessCardModule";

export default Module(BUSINESS_CARD_MODULE, {
  service: BusinessCardModuleService,
});
