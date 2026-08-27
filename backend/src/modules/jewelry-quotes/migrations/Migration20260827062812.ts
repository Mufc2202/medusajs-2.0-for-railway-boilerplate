import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260827062812 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "jewelry_spot_price" drop constraint if exists "jewelry_spot_price_metal_unique";`);
    this.addSql(`create table if not exists "jewelry_quote" ("id" text not null, "customer_id" text null, "customer_name" text not null, "customer_email" text null, "customer_phone" text null, "title" text not null, "currency_code" text not null default 'usd', "status" text check ("status" in ('draft', 'offered', 'accepted', 'declined', 'expired')) not null default 'offered', "calculation_mode" text check ("calculation_mode" in ('retail_selling', 'scrap_buying')) not null default 'retail_selling', "items" jsonb not null, "spot_prices_snapshot" jsonb not null, "base_metal_cost" numeric not null default 0, "wastage_cost" numeric not null default 0, "labor_cost" numeric not null default 0, "stone_cost" numeric not null default 0, "total_cost_price" numeric not null default 0, "profit_margin_percent" real not null default 0, "profit_amount" numeric not null default 0, "final_offered_price" numeric not null default 0, "notes" text null, "valid_until" timestamptz null, "raw_base_metal_cost" jsonb not null default '{"value":"0","precision":20}', "raw_wastage_cost" jsonb not null default '{"value":"0","precision":20}', "raw_labor_cost" jsonb not null default '{"value":"0","precision":20}', "raw_stone_cost" jsonb not null default '{"value":"0","precision":20}', "raw_total_cost_price" jsonb not null default '{"value":"0","precision":20}', "raw_profit_amount" jsonb not null default '{"value":"0","precision":20}', "raw_final_offered_price" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "jewelry_quote_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_jewelry_quote_deleted_at" ON "jewelry_quote" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "jewelry_quote_revision" ("id" text not null, "revision_number" integer not null default 1, "trigger_reason" text check ("trigger_reason" in ('initial_quote', 'spot_price_update', 'profit_margin_adjustment', 'item_edit', 'manual_override')) not null default 'initial_quote', "spot_prices_snapshot" jsonb not null, "items_snapshot" jsonb null, "profit_margin_percent" real not null default 0, "base_metal_cost" numeric not null default 0, "total_cost_price" numeric not null default 0, "final_offered_price" numeric not null default 0, "price_delta" numeric not null default 0, "notes" text null, "created_by_user_id" text null, "quote_id" text not null, "raw_base_metal_cost" jsonb not null default '{"value":"0","precision":20}', "raw_total_cost_price" jsonb not null default '{"value":"0","precision":20}', "raw_final_offered_price" jsonb not null default '{"value":"0","precision":20}', "raw_price_delta" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "jewelry_quote_revision_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_jewelry_quote_revision_quote_id" ON "jewelry_quote_revision" ("quote_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_jewelry_quote_revision_deleted_at" ON "jewelry_quote_revision" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "jewelry_spot_price" ("id" text not null, "metal" text check ("metal" in ('gold', 'silver', 'platinum', 'palladium')) not null, "price_per_troy_oz" real not null, "price_per_gram" real not null, "price_per_dwt" real not null, "currency_code" text not null default 'usd', "source" text not null default 'system_default', "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "jewelry_spot_price_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_jewelry_spot_price_metal_unique" ON "jewelry_spot_price" ("metal") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_jewelry_spot_price_deleted_at" ON "jewelry_spot_price" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "jewelry_quote_revision" add constraint "jewelry_quote_revision_quote_id_foreign" foreign key ("quote_id") references "jewelry_quote" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "jewelry_quote_revision" drop constraint if exists "jewelry_quote_revision_quote_id_foreign";`);

    this.addSql(`drop table if exists "jewelry_quote" cascade;`);

    this.addSql(`drop table if exists "jewelry_quote_revision" cascade;`);

    this.addSql(`drop table if exists "jewelry_spot_price" cascade;`);
  }

}
