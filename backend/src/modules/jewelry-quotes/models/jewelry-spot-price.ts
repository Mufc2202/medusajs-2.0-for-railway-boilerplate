import { model } from "@medusajs/framework/utils";

const JewelrySpotPrice = model.define("jewelry_spot_price", {
  id: model.id({ prefix: "jsp" }).primaryKey(),
  metal: model.enum(["gold", "silver", "platinum", "palladium"]).unique(),
  price_per_troy_oz: model.float(), // Price per Troy Oz in USD (e.g. 2680.50)
  price_per_gram: model.float(), // Price per Gram in USD
  price_per_dwt: model.float(), // Price per Pennyweight (DWT) in USD
  currency_code: model.text().default("usd"),
  source: model.text().default("system_default"), // "live_api", "manual_override", "system_default"
  notes: model.text().nullable(),
});

export default JewelrySpotPrice;
