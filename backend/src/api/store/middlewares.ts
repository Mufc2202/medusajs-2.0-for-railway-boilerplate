import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework";
import upload from "api/middlewares/fileUploadMiddleware";
import { CreateBlogSchema, UpdateBlogSchema } from "api/admin/blogs/validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/product-seo/**",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/product-seo/**",
      method: "PUT",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/blog-seo/**",
      method: ["PUT", "POST"],
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/blogs",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateBlogSchema)],
    },
    {
      matcher: "/admin/blogs/*",
      method: "PUT",
      middlewares: [validateAndTransformBody(UpdateBlogSchema)],
    },
  ],
});
