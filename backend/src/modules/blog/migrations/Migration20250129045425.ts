import { Migration } from '@mikro-orm/migrations';

export class Migration20250129045425 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "blog" ("id" text not null, "title" text not null, "subtitle" text null, "handle" text not null, "image" text null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_handle_unique" ON "blog" (handle) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "blog" cascade;');
  }

}
