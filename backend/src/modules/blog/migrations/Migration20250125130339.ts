import { Migration } from '@mikro-orm/migrations';

export class Migration20250125130339 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "blog" ("id" text not null, "title" text not null, "subtitle" text null, "handle" text not null, "image" text null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_handle_unique" ON "blog" (handle) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "blog_seo" ("id" text not null, "meta_title" text null, "meta_description" text null, "meta_image" text null, "blog_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_seo_pkey" primary key ("id"));');
    this.addSql('alter table if exists "blog_seo" add constraint "blog_seo_blog_id_unique" unique ("blog_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_blog_seo_blog_id" ON "blog_seo" (blog_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_blog_seo_deleted_at" ON "blog_seo" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "blog_seo" add constraint "blog_seo_blog_id_foreign" foreign key ("blog_id") references "blog" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "blog_seo" drop constraint if exists "blog_seo_blog_id_foreign";');

    this.addSql('drop table if exists "blog" cascade;');

    this.addSql('drop table if exists "blog_seo" cascade;');
  }

}
