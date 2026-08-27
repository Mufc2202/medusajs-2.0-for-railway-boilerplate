import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import JewelryQuotesModuleService, {
  TROY_OZ_TO_GRAMS,
  TROY_OZ_TO_DWT,
} from "../../../modules/jewelry-quotes/service";
import { JEWELRY_QUOTES_MODULE } from "../../../modules/jewelry-quotes";

async function fetchLiveMarketPrices(): Promise<Record<string, number> | null> {
  const metalSymbols: Record<string, string> = {
    gold: "XAU",
    silver: "XAG",
    platinum: "XPT",
    palladium: "XPD",
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const promises = Object.entries(metalSymbols).map(async ([metal, symbol]) => {
      const res = await fetch(`https://api.gold-api.com/price/${symbol}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Status ${res.status} for ${symbol}`);
      const data = await res.json();
      const price = Number(data.price);
      if (isNaN(price) || price <= 0) throw new Error(`Invalid price for ${symbol}`);
      return [metal, Number(price.toFixed(2))] as [string, number];
    });

    const results = await Promise.all(promises);
    clearTimeout(timeoutId);

    const pricesMap: Record<string, number> = {};
    for (const [metal, price] of results) {
      pricesMap[metal] = price;
    }
    return pricesMap;
  } catch (err) {
    console.warn("Live spot price API unreachable, falling back to database/bench defaults:", err);
    return null;
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );

    const syncLive = req.query.sync_live === "true" || req.query.refresh === "true";
    let isLiveSynced = false;

    // 1. Try to fetch live market prices if requested or if DB is empty
    let livePrices: Record<string, number> | null = null;
    let existingInDb = await jewelryService.listJewelrySpotPrices({});

    if (syncLive || !existingInDb || existingInDb.length === 0) {
      livePrices = await fetchLiveMarketPrices();
    }

    if (livePrices) {
      isLiveSynced = true;
      const metals = ["gold", "silver", "platinum", "palladium"] as const;
      const updatedList = [];

      for (const metal of metals) {
        const pricePerOz = livePrices[metal];
        if (!pricePerOz) continue;

        const pricePerGram = Number((pricePerOz / TROY_OZ_TO_GRAMS).toFixed(4));
        const pricePerDwt = Number((pricePerOz / TROY_OZ_TO_DWT).toFixed(4));

        const existing = existingInDb?.find((p) => p.metal === metal);
        if (existing) {
          const updated = await jewelryService.updateJewelrySpotPrices({
            id: existing.id,
            price_per_troy_oz: pricePerOz,
            price_per_gram: pricePerGram,
            price_per_dwt: pricePerDwt,
            source: "live_market_api",
            notes: "Real-time Live Market Spot Rate",
          });
          updatedList.push(updated);
        } else {
          const created = await jewelryService.createJewelrySpotPrices({
            metal,
            price_per_troy_oz: pricePerOz,
            price_per_gram: pricePerGram,
            price_per_dwt: pricePerDwt,
            currency_code: "usd",
            source: "live_market_api",
            notes: "Real-time Live Market Spot Rate",
          });
          updatedList.push(created);
        }
      }

      return res.status(200).json({
        spot_prices: updatedList,
        is_live: true,
        source: "live_market_api",
      });
    }

    // 2. Fallback: Return stored DB prices if available
    if (existingInDb && existingInDb.length > 0) {
      return res.status(200).json({
        spot_prices: existingInDb,
        is_live: false,
        source: existingInDb[0]?.source || "database",
      });
    }

    // 3. Fallback: If DB is empty and live API failed, initialize system defaults
    const defaults = jewelryService.getDefaultSpotPrices();
    const initialRecords = await Promise.all([
      jewelryService.createJewelrySpotPrices({
        metal: "gold",
        price_per_troy_oz: defaults.gold,
        price_per_gram: Number((defaults.gold / TROY_OZ_TO_GRAMS).toFixed(4)),
        price_per_dwt: Number((defaults.gold / TROY_OZ_TO_DWT).toFixed(4)),
        currency_code: "usd",
        source: "system_default",
        notes: "US Market Standard Benchmark",
      }),
      jewelryService.createJewelrySpotPrices({
        metal: "silver",
        price_per_troy_oz: defaults.silver,
        price_per_gram: Number((defaults.silver / TROY_OZ_TO_GRAMS).toFixed(4)),
        price_per_dwt: Number((defaults.silver / TROY_OZ_TO_DWT).toFixed(4)),
        currency_code: "usd",
        source: "system_default",
        notes: "US Market Standard Benchmark",
      }),
      jewelryService.createJewelrySpotPrices({
        metal: "platinum",
        price_per_troy_oz: defaults.platinum,
        price_per_gram: Number((defaults.platinum / TROY_OZ_TO_GRAMS).toFixed(4)),
        price_per_dwt: Number((defaults.platinum / TROY_OZ_TO_DWT).toFixed(4)),
        currency_code: "usd",
        source: "system_default",
        notes: "US Market Standard Benchmark",
      }),
      jewelryService.createJewelrySpotPrices({
        metal: "palladium",
        price_per_troy_oz: defaults.palladium,
        price_per_gram: Number((defaults.palladium / TROY_OZ_TO_GRAMS).toFixed(4)),
        price_per_dwt: Number((defaults.palladium / TROY_OZ_TO_DWT).toFixed(4)),
        currency_code: "usd",
        source: "system_default",
        notes: "US Market Standard Benchmark",
      }),
    ]);

    return res.status(200).json({
      spot_prices: initialRecords,
      is_live: false,
      source: "system_default",
    });
  } catch (error: any) {
    console.error("Error fetching jewelry spot prices:", error);
    res.status(500).json({
      error: "Failed to retrieve jewelry spot prices",
      message: error.message,
    });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<{
    prices: Array<{
      metal: "gold" | "silver" | "platinum" | "palladium";
      price_per_troy_oz: number;
      notes?: string;
    }>;
  }>,
  res: MedusaResponse
) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );

    const { prices } = req.body;
    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({ error: "Invalid payload. 'prices' array is required." });
    }

    const updatedPrices = [];
    for (const item of prices) {
      const pricePerOz = Number(item.price_per_troy_oz);
      const pricePerGram = Number((pricePerOz / TROY_OZ_TO_GRAMS).toFixed(4));
      const pricePerDwt = Number((pricePerOz / TROY_OZ_TO_DWT).toFixed(4));

      const existing = await jewelryService.listJewelrySpotPrices({
        metal: item.metal,
      });

      if (existing && existing.length > 0) {
        const updated = await jewelryService.updateJewelrySpotPrices({
          id: existing[0].id,
          price_per_troy_oz: pricePerOz,
          price_per_gram: pricePerGram,
          price_per_dwt: pricePerDwt,
          source: "manual_override",
          notes: item.notes || "Updated by jeweler",
        });
        updatedPrices.push(updated);
      } else {
        const created = await jewelryService.createJewelrySpotPrices({
          metal: item.metal,
          price_per_troy_oz: pricePerOz,
          price_per_gram: pricePerGram,
          price_per_dwt: pricePerDwt,
          currency_code: "usd",
          source: "manual_override",
          notes: item.notes || "Updated by jeweler",
        });
        updatedPrices.push(created);
      }
    }

    res.status(200).json({ spot_prices: updatedPrices });
  } catch (error: any) {
    console.error("Error updating spot prices:", error);
    res.status(500).json({
      error: "Failed to update spot prices",
      message: error.message,
    });
  }
}
