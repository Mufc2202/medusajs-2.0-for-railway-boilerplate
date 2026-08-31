import { Module } from "@medusajs/framework/utils";
import InstagramFeedModuleService from "./services";

export const INSTAGRAM_FEED_MODULE = "instagramFeedModule";

export default Module(INSTAGRAM_FEED_MODULE, {
  service: InstagramFeedModuleService,
});
