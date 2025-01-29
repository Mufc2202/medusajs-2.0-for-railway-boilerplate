import { defineLink } from "@medusajs/framework/utils";
import BlogModule from "../modules/blog";
import UserModule from "@medusajs/medusa/user";

export default defineLink(BlogModule.linkable.blog, {
	linkable: UserModule.linkable.user,
});
