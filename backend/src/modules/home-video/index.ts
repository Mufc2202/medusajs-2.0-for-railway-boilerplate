import { Module } from "@medusajs/framework/utils";
import HomeVideoModuleService from "./services";

export const HOME_VIDEO_MODULE = "homeVideoModule";

export default Module(HOME_VIDEO_MODULE, {
  service: HomeVideoModuleService,
});
