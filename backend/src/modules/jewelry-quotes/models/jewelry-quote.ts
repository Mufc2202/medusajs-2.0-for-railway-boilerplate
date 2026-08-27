import { model } from "@medusajs/framework/utils";
import JewelryQuoteRevision from "./jewelry-quote-revision";

const JewelryQuote = model.define("jewelry_quote", {
  id: model.id({ prefix: "jq" }).primaryKey(),
  customer_id: model.text().nullable(),
  customer_name: model.text(),
  customer_email: model.text().nullable(),
  customer_phone: model.text().nullable(),
  title: model.text(),
  currency_code: model.text().default("usd"),
  status: model.enum(["draft", "offered", "accepted", "declined", "expired"]).default("offered"),
  calculation_mode: model.enum(["retail_selling", "scrap_buying"]).default("retail_selling"),
  // Array of items (metals, karats, weights, units, diamonds, labor, wastage)
  items: model.json(),
  // Snapshot of spot prices used at calculation time
  spot_prices_snapshot: model.json(),
  // Financial breakdown values (in cents)
  base_metal_cost: model.bigNumber().default(0),
  wastage_cost: model.bigNumber().default(0),
  labor_cost: model.bigNumber().default(0),
  stone_cost: model.bigNumber().default(0),
  total_cost_price: model.bigNumber().default(0),
  profit_margin_percent: model.float().default(0),
  profit_amount: model.bigNumber().default(0),
  final_offered_price: model.bigNumber().default(0),
  notes: model.text().nullable(),
  valid_until: model.dateTime().nullable(),
  revisions: model.hasMany(() => JewelryQuoteRevision, {
    mappedBy: "quote",
  }),
});

export default JewelryQuote;
