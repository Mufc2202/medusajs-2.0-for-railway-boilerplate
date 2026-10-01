import { MedusaService } from "@medusajs/framework/utils";
import BusinessCard from "./models/business-card";

class BusinessCardModuleService extends MedusaService({
  BusinessCard,
}) {}

export default BusinessCardModuleService;
