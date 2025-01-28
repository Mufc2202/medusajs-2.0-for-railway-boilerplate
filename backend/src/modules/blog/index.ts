import BlogModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const BLOG_MODULE = "blogModuleService";

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
});
