import { Migration } from '@mikro-orm/migrations';

export class Migration20260831120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "instagram_post" (
      "id" text not null,
      "caption" text null,
      "media_type" text not null default 'IMAGE',
      "media_url" text not null,
      "thumbnail_url" text null,
      "permalink" text null,
      "instagram_id" text null,
      "likes_count" integer not null default 0,
      "comments_count" integer not null default 0,
      "is_visible" boolean not null default true,
      "is_pinned" boolean not null default false,
      "display_order" integer not null default 0,
      "product_id" text null,
      "product_title" text null,
      "product_handle" text null,
      "product_thumbnail" text null,
      "product_price" text null,
      "custom_cta_text" text null,
      "custom_cta_link" text null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "instagram_post_pkey" primary key ("id")
    );`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_instagram_post_deleted_at" ON "instagram_post" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_instagram_post_is_visible" ON "instagram_post" (is_visible);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_instagram_post_is_pinned" ON "instagram_post" (is_pinned);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "instagram_post" cascade;`);
  }

}
