import { MedusaService } from "@medusajs/framework/utils";
import Blog from "./models/blog";
import BlogSeo from "./models/blog_seo";

class BlogModuleService extends MedusaService({
  Blog,
  BlogSeo,
}) {}

export default BlogModuleService;
