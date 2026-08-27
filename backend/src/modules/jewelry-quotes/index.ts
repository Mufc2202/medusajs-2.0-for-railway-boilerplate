import JewelryQuotesModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const JEWELRY_QUOTES_MODULE = "jewelryQuotesModuleService";

export default Module(JEWELRY_QUOTES_MODULE, {
  service: JewelryQuotesModuleService,
});
