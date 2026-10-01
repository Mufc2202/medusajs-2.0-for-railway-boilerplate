import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261001124424 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "business_card" ("id" text not null, "first_name" text not null default 'Joseph', "last_name" text not null default 'Dolginow', "company" text not null default 'Joseph Dolgin Jeweler LLC', "bio" text not null default 'Custom Fine Jewelry, Jewelry Repair, Appraisals', "phone" text not null default '(913) 228-2808', "email" text not null default 'joseph@dolgins.com', "website" text not null default 'dolgins.com', "street" text not null default 'West 119th Street 4901', "city" text not null default 'Leawood', "state" text not null default 'KS', "zip" text not null default '66209', "country" text not null default 'United States', "color_primary" text not null default '#222943', "color_accent" text not null default '#C7A88C', "avatar_url" text null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "business_card_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_business_card_deleted_at" ON "business_card" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "business_card" cascade;`);
  }

}
