import { MedusaService } from "@medusajs/framework/utils";
import InstagramPost from "./models/instagram-post";

class InstagramFeedModuleService extends MedusaService({
  InstagramPost,
}) {}

export default InstagramFeedModuleService;
