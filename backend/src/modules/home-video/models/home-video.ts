import { model } from "@medusajs/framework/utils";

const HomeVideo = model.define("home_video", {
  id: model.id().primaryKey(),
  title: model.text().nullable(),
  subtitle: model.text().nullable(),
  video_url: model.text(),
  provider: model.text().default("vimeo"),
  thumbnail_url: model.text().nullable(),
  is_active: model.boolean().default(true),
  autoplay: model.boolean().default(false),
  muted: model.boolean().default(true),
  loop: model.boolean().default(false),
  metadata: model.json().nullable(),
});

export default HomeVideo;
