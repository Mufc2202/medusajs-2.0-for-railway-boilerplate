import { model } from "@medusajs/framework/utils";

const InstagramPost = model.define("instagram_post", {
  id: model.id().primaryKey(),
  caption: model.text().nullable(),
  media_type: model.text().default("IMAGE"),
  media_url: model.text(),
  thumbnail_url: model.text().nullable(),
  permalink: model.text().nullable(),
  instagram_id: model.text().nullable(),
  likes_count: model.number().default(0),
  comments_count: model.number().default(0),
  is_visible: model.boolean().default(true),
  is_pinned: model.boolean().default(false),
  display_order: model.number().default(0),
  product_id: model.text().nullable(),
  product_title: model.text().nullable(),
  product_handle: model.text().nullable(),
  product_thumbnail: model.text().nullable(),
  product_price: model.text().nullable(),
  custom_cta_text: model.text().nullable(),
  custom_cta_link: model.text().nullable(),
  metadata: model.json().nullable(),
});

export default InstagramPost;
