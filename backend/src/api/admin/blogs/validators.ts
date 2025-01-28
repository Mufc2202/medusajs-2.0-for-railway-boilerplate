import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  image: z.string().optional(),
  content: z.string(),
  categories: z.array(z.string()).optional(),
});

export const UpdateBlogSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  categories: z.array(z.string()).optional(),
});
