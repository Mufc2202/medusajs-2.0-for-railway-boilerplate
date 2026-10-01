import { MedusaService } from "@medusajs/framework/utils";
import HomeVideo from "./models/home-video";

class HomeVideoModuleService extends MedusaService({
  HomeVideo,
}) {}

export default HomeVideoModuleService;
