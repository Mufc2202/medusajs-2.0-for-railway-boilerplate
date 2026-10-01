import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261001113820 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "home_video" ("id" text not null, "title" text null, "subtitle" text null, "video_url" text not null, "provider" text not null default 'vimeo', "thumbnail_url" text null, "is_active" boolean not null default true, "autoplay" boolean not null default false, "muted" boolean not null default true, "loop" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "home_video_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_home_video_deleted_at" ON "home_video" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "home_video" cascade;`);
  }

}
