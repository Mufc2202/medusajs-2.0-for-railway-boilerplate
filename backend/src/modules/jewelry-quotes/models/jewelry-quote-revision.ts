import { model } from "@medusajs/framework/utils";
import JewelryQuote from "./jewelry-quote";

const JewelryQuoteRevision = model.define("jewelry_quote_revision", {
  id: model.id({ prefix: "jqr" }).primaryKey(),
  revision_number: model.number().default(1),
  trigger_reason: model.enum([
    "initial_quote",
    "spot_price_update",
    "profit_margin_adjustment",
    "item_edit",
    "manual_override",
  ]).default("initial_quote"),
  spot_prices_snapshot: model.json(),
  items_snapshot: model.json().nullable(),
  profit_margin_percent: model.float().default(0),
  base_metal_cost: model.bigNumber().default(0),
  total_cost_price: model.bigNumber().default(0),
  final_offered_price: model.bigNumber().default(0),
  price_delta: model.bigNumber().default(0), // change from previous revision in cents
  notes: model.text().nullable(),
  created_by_user_id: model.text().nullable(),
  quote: model.belongsTo(() => JewelryQuote, {
    mappedBy: "revisions",
  }),
});

export default JewelryQuoteRevision;
