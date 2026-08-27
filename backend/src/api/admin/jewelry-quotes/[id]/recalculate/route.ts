import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import JewelryQuotesModuleService, {
  JewelryItemInput,
  SpotPricesMap,
} from "../../../../../modules/jewelry-quotes/service";
import { JEWELRY_QUOTES_MODULE } from "../../../../../modules/jewelry-quotes";

export async function POST(
  req: AuthenticatedMedusaRequest<{
    spot_prices?: SpotPricesMap;
    profit_margin_percent?: number;
    items?: JewelryItemInput[];
    trigger_reason?:
      | "spot_price_update"
      | "profit_margin_adjustment"
      | "item_edit"
      | "manual_override";
    notes?: string;
  }>,
  res: MedusaResponse
) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );
    const { id } = req.params;

    const quote = await jewelryService.retrieveJewelryQuote(id, {
      relations: ["revisions"],
    });

    if (!quote) {
      return res.status(404).json({ error: `Jewelry quote with id ${id} not found.` });
    }

    // 1. Determine items to calculate (new items passed or existing raw items)
    let rawItems: JewelryItemInput[] = [];
    if (req.body.items && req.body.items.length > 0) {
      rawItems = req.body.items;
    } else if (quote.items && typeof quote.items === "object") {
      const itemsObj = quote.items as any;
      rawItems = itemsObj.raw_items || itemsObj;
    }

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: "No items found in quote to calculate." });
    }

    // 2. Determine new spot prices
    let spotPrices: SpotPricesMap = req.body.spot_prices || {
      gold: 2685.0,
      silver: 31.5,
      platinum: 975.0,
      palladium: 990.0,
    };

    if (!req.body.spot_prices) {
      const dbPrices = await jewelryService.listJewelrySpotPrices({});
      if (dbPrices && dbPrices.length > 0) {
        spotPrices = {
          gold: dbPrices.find((p) => p.metal === "gold")?.price_per_troy_oz || 2685.0,
          silver: dbPrices.find((p) => p.metal === "silver")?.price_per_troy_oz || 31.5,
          platinum: dbPrices.find((p) => p.metal === "platinum")?.price_per_troy_oz || 975.0,
          palladium: dbPrices.find((p) => p.metal === "palladium")?.price_per_troy_oz || 990.0,
        };
      }
    }

    // 3. Determine profit margin
    const profitMarginPercent =
      req.body.profit_margin_percent !== undefined
        ? req.body.profit_margin_percent
        : quote.profit_margin_percent || 0;

    // 4. Calculate updated breakdown
    const breakdown = jewelryService.calculateQuote(
      rawItems,
      spotPrices,
      profitMarginPercent,
      quote.calculation_mode as any
    );

    const baseMetalCostCents = Math.round(breakdown.base_metal_cost * 100);
    const wastageCostCents = Math.round(breakdown.wastage_cost * 100);
    const laborCostCents = Math.round(breakdown.labor_cost * 100);
    const stoneCostCents = Math.round(breakdown.stone_cost * 100);
    const totalCostPriceCents = Math.round(breakdown.total_cost_price * 100);
    const profitAmountCents = Math.round(breakdown.profit_amount * 100);
    const newFinalOfferedPriceCents = Math.round(breakdown.final_offered_price * 100);

    const previousPriceCents = Number(quote.final_offered_price) || 0;
    const priceDeltaCents = newFinalOfferedPriceCents - previousPriceCents;

    // 5. Determine next revision number
    const currentRevisions = quote.revisions || [];
    const nextRevisionNumber =
      currentRevisions.reduce(
        (max, rev) => Math.max(max, rev.revision_number || 0),
        0
      ) + 1;

    // 6. Determine trigger reason
    let triggerReason = req.body.trigger_reason;
    if (!triggerReason) {
      if (req.body.profit_margin_percent !== undefined && req.body.profit_margin_percent !== quote.profit_margin_percent) {
        triggerReason = "profit_margin_adjustment";
      } else {
        triggerReason = "spot_price_update";
      }
    }

    // 7. Create New Revision #N
    const newRevision = await jewelryService.createJewelryQuoteRevisions({
      quote_id: quote.id,
      revision_number: nextRevisionNumber,
      trigger_reason: triggerReason,
      spot_prices_snapshot: spotPrices as any,
      items_snapshot: rawItems as any,
      profit_margin_percent: profitMarginPercent,
      base_metal_cost: baseMetalCostCents,
      total_cost_price: totalCostPriceCents,
      final_offered_price: newFinalOfferedPriceCents,
      price_delta: priceDeltaCents,
      notes:
        req.body.notes ||
        `Recalculated with ${triggerReason.replace(/_/g, " ")}. Delta: $${(priceDeltaCents / 100).toFixed(2)}`,
      created_by_user_id: req.auth_context?.actor_id || null,
    });

    // 8. Update JewelryQuote entity
    const updatedQuote = await jewelryService.updateJewelryQuotes({
      id: quote.id,
      items: {
        raw_items: rawItems,
        breakdown_items: breakdown.item_calculations,
      },
      spot_prices_snapshot: spotPrices as any,
      base_metal_cost: baseMetalCostCents,
      wastage_cost: wastageCostCents,
      labor_cost: laborCostCents,
      stone_cost: stoneCostCents,
      total_cost_price: totalCostPriceCents,
      profit_margin_percent: profitMarginPercent,
      profit_amount: profitAmountCents,
      final_offered_price: newFinalOfferedPriceCents,
    });

    res.status(200).json({
      quote: {
        ...updatedQuote,
        latest_revision: newRevision,
        breakdown,
      },
      revision: newRevision,
    });
  } catch (error: any) {
    console.error(`Error recalculating quote ${req.params.id}:`, error);
    res.status(500).json({
      error: "Failed to recalculate jewelry quote",
      message: error.message,
    });
  }
}
