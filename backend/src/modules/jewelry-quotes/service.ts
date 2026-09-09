import { MedusaService } from "@medusajs/framework/utils";
import JewelryQuote from "./models/jewelry-quote";
import JewelryQuoteRevision from "./models/jewelry-quote-revision";
import JewelrySpotPrice from "./models/jewelry-spot-price";

// Purity fractions based on US Jeweler FTC / ASTM Standards
export const METAL_PURITIES: Record<string, Record<string, number>> = {
  gold: {
    "24k": 0.999,
    "22k": 0.9167,
    "21k": 0.875,
    "18k": 0.75,
    "14k": 0.5833, // Plumb 14k (58.33%)
    "12k": 0.5,
    "10k": 0.4167, // US FTC Minimum Karat
    "9k": 0.375,
    "8k": 0.3333,
  },
  silver: {
    "fine_999": 0.999,
    "sterling_925": 0.925,
    "coin_900": 0.9, // US Pre-1965 90% Coin Silver
    "european_800": 0.8,
  },
  platinum: {
    "pt_950": 0.95,
    "pt_900": 0.9, // 90/10 Pt/Ir US Bench Standard
    "pt_850": 0.85,
    "pt_800": 0.8,
  },
  palladium: {
    "pd_950": 0.95,
    "pd_500": 0.5,
  },
};

// Unit conversions to Troy Ounces & Grams
export const TROY_OZ_TO_GRAMS = 31.1034768;
export const TROY_OZ_TO_DWT = 20.0; // 1 Troy Oz = 20 Pennyweight
export const DWT_TO_GRAMS = 1.55517384; // 1 Pennyweight = 1.55517 Grams

export const REFINER_RATES: Record<string, number> = {
  gold: 0.98,
  silver: 0.85,
  platinum: 0.90,
  palladium: 0.90,
};

const NON_SCRAP_CATEGORIES = new Set(["Diamonds/gem stone", "Melee", "Complete Piece"]);

export const isScrapMetalItem = (category?: string) => {
  if (!category) return true;
  return !NON_SCRAP_CATEGORIES.has(category);
};

export interface JewelryItemInput {
  metal_type: "gold" | "silver" | "platinum" | "palladium";
  purity_karat?: string;
  custom_purity_percent?: number;
  purity_percent?: number;
  weight: number;
  unit: "dwt" | "g" | "ozt" | "tola" | "kg";
  labor_charge_per_unit?: number;
  labor_charge_flat?: number;
  wastage_percent?: number;
  // Diamond / Stone components
  diamond_carats?: number;
  diamond_points?: number;
  diamond_price_per_carat?: number;
  stone_notes?: string;
  item_title?: string;
  description?: string;
  estimated_wholesale_cost?: number;
  payout_ratio?: number;
}

export interface SpotPricesMap {
  gold: number; // in $/troy oz
  silver: number;
  platinum: number;
  palladium: number;
}

export interface CalculationBreakdown {
  pure_metal_ozt: number;
  pure_metal_grams: number;
  base_metal_cost: number; // in USD (decimal)
  estimated_wholesale_cost?: number;
  wastage_cost: number;
  labor_cost: number;
  stone_cost: number;
  total_cost_price: number;
  profit_margin_percent: number;
  profit_amount: number;
  final_offered_price: number;
  item_calculations: Array<{
    item_title?: string;
    description?: string;
    metal_type: string;
    purity_karat?: string;
    purity_percent?: number;
    purity_factor: number;
    weight_input: number;
    unit: string;
    weight_in_grams: number;
    weight_in_dwt: number;
    weight_in_ozt: number;
    pure_metal_ozt: number;
    spot_price_per_ozt: number;
    base_metal_cost: number;
    estimated_wholesale_cost?: number;
    item_base_valuation?: number;
    payout_ratio?: number;
    item_offered_price?: number;
    individual_profit?: number;
    wastage_cost: number;
    labor_cost: number;
    stone_cost: number;
    item_total_cost: number;
  }>;
}

class JewelryQuotesModuleService extends MedusaService({
  JewelryQuote,
  JewelryQuoteRevision,
  JewelrySpotPrice,
}) {
  /**
   * Convert any given weight and unit to Troy Ounces and Grams
   */
  convertWeight(weight: number, unit: "dwt" | "g" | "ozt" | "tola" | "kg"): { ozt: number; grams: number; dwt: number } {
    let grams = 0;
    switch (unit) {
      case "dwt":
        grams = weight * DWT_TO_GRAMS;
        break;
      case "g":
        grams = weight;
        break;
      case "ozt":
        grams = weight * TROY_OZ_TO_GRAMS;
        break;
      case "tola":
        grams = weight * 11.6638;
        break;
      case "kg":
        grams = weight * 1000.0;
        break;
      default:
        grams = weight;
    }
    const ozt = grams / TROY_OZ_TO_GRAMS;
    const dwt = ozt * TROY_OZ_TO_DWT;
    return { ozt, grams, dwt };
  }

  /**
   * Determine purity fraction (e.g. 14k -> 0.5833, 58.33% -> 0.5833)
   */
  getPurityFactor(metal: string, karat: string, customPercent?: number): number {
    if (customPercent !== undefined && customPercent !== null && customPercent > 0) {
      return customPercent / 100.0;
    }
    const metalPurities = METAL_PURITIES[metal.toLowerCase()];
    if (metalPurities && metalPurities[karat.toLowerCase()]) {
      return metalPurities[karat.toLowerCase()];
    }
    return 1.0;
  }

  /**
   * Calculate complete jewelry price breakdown according to US Jeweler formulas
   */
  calculateQuote(
    items: JewelryItemInput[],
    spotPrices: SpotPricesMap,
    profitMarginPercent: number = 0,
    calculationMode: "retail_selling" | "scrap_buying" = "retail_selling"
  ): CalculationBreakdown {
    let totalPureOzt = 0;
    let totalPureGrams = 0;
    let totalBaseMetalCost = 0;
    let totalWholesaleCost = 0;
    let totalWastageCost = 0;
    let totalLaborCost = 0;
    let totalStoneCost = 0;
    let totalScrapBuyingOfferedPrice = 0;
    let totalScrapBuyingProfit = 0;

    const itemCalculations = items.map((item) => {
      const isScrapMetal = isScrapMetalItem(item.item_title);
      const weightNum = isScrapMetal ? (Number(item.weight) || 0) : 0;
      const { ozt, grams, dwt } = this.convertWeight(weightNum, item.unit || "dwt");

      const purityPercent = typeof item.purity_percent === "number"
        ? item.purity_percent
        : item.custom_purity_percent;

      const purityFactor = isScrapMetal
        ? this.getPurityFactor(item.metal_type || "gold", item.purity_karat || "", purityPercent)
        : 0;
      const pureOzt = ozt * purityFactor;
      const pureGrams = grams * purityFactor;

      const spotPricePerOzt = spotPrices[item.metal_type] || 0;
      const refinerRate = REFINER_RATES[item.metal_type?.toLowerCase()] ?? 1.0;
      const baseMetalCost = isScrapMetal ? pureOzt * spotPricePerOzt * refinerRate : 0;

      const wastagePercent = item.wastage_percent || 0;
      const wastageCost = baseMetalCost * (wastagePercent / 100.0);

      // Labor / Benchwork calculation
      let laborCost = item.labor_charge_flat || 0;
      if (item.labor_charge_per_unit && item.labor_charge_per_unit > 0) {
        if (item.unit === "dwt") {
          laborCost += dwt * item.labor_charge_per_unit;
        } else {
          laborCost += grams * item.labor_charge_per_unit;
        }
      }

      // Diamond / Stone calculation (100 points = 1 carat)
      let stoneCarats = item.diamond_carats || 0;
      if (item.diamond_points && item.diamond_points > 0) {
        stoneCarats += item.diamond_points / 100.0;
      }
      const stoneCost = stoneCarats * (item.diamond_price_per_carat || 0);

      const estimatedWholesale = !isScrapMetal ? (Number(item.estimated_wholesale_cost) || 0) : 0;
      const itemBaseValuation = baseMetalCost + estimatedWholesale;

      // Individual item payout ratio (defaults to global margin if not provided)
      const itemPayoutRatio = typeof item.payout_ratio === "number" && item.payout_ratio >= 0
        ? item.payout_ratio
        : (profitMarginPercent > 0 && profitMarginPercent <= 100 ? profitMarginPercent : 85);

      const itemOfferedPrice = itemBaseValuation * (itemPayoutRatio / 100.0);
      const individualProfit = itemBaseValuation - itemOfferedPrice;

      totalScrapBuyingOfferedPrice += itemOfferedPrice;
      totalScrapBuyingProfit += individualProfit;

      const itemTotalCost = baseMetalCost + wastageCost + laborCost + stoneCost;

      totalPureOzt += pureOzt;
      totalPureGrams += pureGrams;
      totalBaseMetalCost += baseMetalCost;
      totalWholesaleCost += estimatedWholesale;
      totalWastageCost += wastageCost;
      totalLaborCost += laborCost;
      totalStoneCost += stoneCost;

      return {
        item_title: item.item_title,
        description: item.description,
        metal_type: item.metal_type,
        purity_karat: item.purity_karat,
        purity_percent: purityPercent,
        purity_factor: purityFactor,
        weight_input: item.weight,
        unit: item.unit,
        weight_in_grams: Number(grams.toFixed(4)),
        weight_in_dwt: Number(dwt.toFixed(4)),
        weight_in_ozt: Number(ozt.toFixed(5)),
        pure_metal_ozt: Number(pureOzt.toFixed(5)),
        spot_price_per_ozt: spotPricePerOzt,
        base_metal_cost: Number(baseMetalCost.toFixed(2)),
        estimated_wholesale_cost: Number(estimatedWholesale.toFixed(2)),
        item_base_valuation: Number(itemBaseValuation.toFixed(2)),
        payout_ratio: itemPayoutRatio,
        item_offered_price: Number(itemOfferedPrice.toFixed(2)),
        individual_profit: Number(individualProfit.toFixed(2)),
        wastage_cost: Number(wastageCost.toFixed(2)),
        labor_cost: Number(laborCost.toFixed(2)),
        stone_cost: Number(stoneCost.toFixed(2)),
        item_total_cost: Number(itemTotalCost.toFixed(2)),
      };
    });

    const totalCostPrice = totalBaseMetalCost + totalWastageCost + totalLaborCost + totalStoneCost;

    let profitAmount = 0;
    let finalOfferedPrice = 0;

    if (calculationMode === "scrap_buying") {
      finalOfferedPrice = totalScrapBuyingOfferedPrice;
      profitAmount = totalScrapBuyingProfit;
    } else {
      // Retail Custom Sale: Selling Price = Total Cost * (1 + Markup % / 100)
      profitAmount = totalCostPrice * (profitMarginPercent / 100.0);
      finalOfferedPrice = totalCostPrice + profitAmount;
    }

    return {
      pure_metal_ozt: Number(totalPureOzt.toFixed(5)),
      pure_metal_grams: Number(totalPureGrams.toFixed(4)),
      base_metal_cost: Number(totalBaseMetalCost.toFixed(2)),
      estimated_wholesale_cost: Number(totalWholesaleCost.toFixed(2)),
      wastage_cost: Number(totalWastageCost.toFixed(2)),
      labor_cost: Number(totalLaborCost.toFixed(2)),
      stone_cost: Number(totalStoneCost.toFixed(2)),
      total_cost_price: Number(totalCostPrice.toFixed(2)),
      profit_margin_percent: profitMarginPercent,
      profit_amount: Number(profitAmount.toFixed(2)),
      final_offered_price: Number(finalOfferedPrice.toFixed(2)),
      item_calculations: itemCalculations,
    };
  }

  /**
   * Default initial US spot prices if none exist in DB
   */
  getDefaultSpotPrices(): SpotPricesMap {
    return {
      gold: 2685.0, // USD per troy oz
      silver: 31.5,
      platinum: 975.0,
      palladium: 990.0,
    };
  }
}

export default JewelryQuotesModuleService;
