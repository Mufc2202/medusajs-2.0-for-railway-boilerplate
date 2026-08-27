import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import JewelryQuotesModuleService, {
  JewelryItemInput,
  SpotPricesMap,
} from "../../../modules/jewelry-quotes/service";
import { JEWELRY_QUOTES_MODULE } from "../../../modules/jewelry-quotes";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const customerId = req.query.customer_id as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    // Fetch quotes with revisions
    const filters: Record<string, any> = {};
    if (customerId) {
      filters.customer_id = customerId;
    }
    if (status) {
      filters.status = status;
    }

    const quotes = await jewelryService.listJewelryQuotes(filters, {
      relations: ["revisions"],
      order: { created_at: "DESC" },
    });

    // If search term is present, filter by title or customer name
    let filteredQuotes = quotes;
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase();
      filteredQuotes = quotes.filter(
        (q) =>
          q.title?.toLowerCase().includes(searchLower) ||
          q.customer_name?.toLowerCase().includes(searchLower) ||
          q.customer_email?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      quotes: filteredQuotes,
      count: filteredQuotes.length,
    });
  } catch (error: any) {
    console.error("Error listing jewelry quotes:", error);
    res.status(500).json({
      error: "Failed to list jewelry quotes",
      message: error.message,
    });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<{
    customer_id?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    title: string;
    currency_code?: string;
    calculation_mode?: "retail_selling" | "scrap_buying";
    items: JewelryItemInput[];
    spot_prices?: SpotPricesMap;
    profit_margin_percent?: number;
    notes?: string;
    valid_until?: string;
    create_customer_if_missing?: boolean;
  }>,
  res: MedusaResponse
) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );
    const remoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );

    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      title,
      currency_code = "usd",
      calculation_mode = "retail_selling",
      items,
      profit_margin_percent = 0,
      notes,
      valid_until,
      create_customer_if_missing = true,
    } = req.body;

    if (!customer_name || !title || !items || items.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: customer_name, title, and at least 1 item are required.",
      });
    }

    // Resolve or Auto-Create Customer in Medusa Customer database
    let resolvedCustomerId: string | null = customer_id || null;
    if (!resolvedCustomerId && customer_email) {
      try {
        const customerModule = req.scope.resolve(Modules.CUSTOMER) as any;
        const existingCustomers = await customerModule.listCustomers({
          email: customer_email.toLowerCase().trim(),
        });

        if (existingCustomers && existingCustomers.length > 0) {
          resolvedCustomerId = existingCustomers[0].id;
        } else if (create_customer_if_missing) {
          const parts = customer_name.trim().split(" ");
          const firstName = parts[0] || customer_name;
          const lastName = parts.slice(1).join(" ") || "";

          const newCustomer = await customerModule.createCustomers({
            first_name: firstName,
            last_name: lastName,
            email: customer_email.toLowerCase().trim(),
            phone: customer_phone || null,
          });
          if (newCustomer) {
            resolvedCustomerId = newCustomer.id;
          }
        }
      } catch (custErr) {
        console.warn("Could not auto-create/lookup customer in Medusa Customer Module:", custErr);
      }
    }

    // Determine spot prices: use passed spot prices, or fetch latest from DB / defaults
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

    // Calculate exact pricing breakdown using US Jeweler formulas
    const breakdown = jewelryService.calculateQuote(
      items,
      spotPrices,
      profit_margin_percent,
      calculation_mode
    );

    // Convert decimal USD to cents (bigInt) for database consistency
    const baseMetalCostCents = Math.round(breakdown.base_metal_cost * 100);
    const wastageCostCents = Math.round(breakdown.wastage_cost * 100);
    const laborCostCents = Math.round(breakdown.labor_cost * 100);
    const stoneCostCents = Math.round(breakdown.stone_cost * 100);
    const totalCostPriceCents = Math.round(breakdown.total_cost_price * 100);
    const profitAmountCents = Math.round(breakdown.profit_amount * 100);
    const finalOfferedPriceCents = Math.round(breakdown.final_offered_price * 100);

    // 1. Create Jewelry Quote
    const quote = await jewelryService.createJewelryQuotes({
      customer_id: resolvedCustomerId,
      customer_name,
      customer_email: customer_email || null,
      customer_phone: customer_phone || null,
      title,
      currency_code,
      status: "offered",
      calculation_mode,
      items: {
        raw_items: items,
        breakdown_items: breakdown.item_calculations,
      },
      spot_prices_snapshot: spotPrices as any,
      base_metal_cost: baseMetalCostCents,
      wastage_cost: wastageCostCents,
      labor_cost: laborCostCents,
      stone_cost: stoneCostCents,
      total_cost_price: totalCostPriceCents,
      profit_margin_percent,
      profit_amount: profitAmountCents,
      final_offered_price: finalOfferedPriceCents,
      notes: notes || null,
      valid_until: valid_until ? new Date(valid_until) : null,
    });

    // 2. Create Initial Revision #1
    const revision = await jewelryService.createJewelryQuoteRevisions({
      quote_id: quote.id,
      revision_number: 1,
      trigger_reason: "initial_quote",
      spot_prices_snapshot: spotPrices as any,
      items_snapshot: items as any,
      profit_margin_percent,
      base_metal_cost: baseMetalCostCents,
      total_cost_price: totalCostPriceCents,
      final_offered_price: finalOfferedPriceCents,
      price_delta: 0,
      notes: "Initial quote created",
      created_by_user_id: req.auth_context?.actor_id || null,
    });

    // 3. If resolvedCustomerId provided, create Medusa Remote Link to Customer
    if (resolvedCustomerId && remoteLink) {
      try {
        await remoteLink.create({
          [Modules.CUSTOMER]: {
            customer_id: resolvedCustomerId,
          },
          [JEWELRY_QUOTES_MODULE]: {
            jewelry_quote_id: quote.id,
          },
        });
      } catch (linkError) {
        console.warn("Failed to create customer remote link (customer might not exist yet):", linkError);
      }
    }

    res.status(201).json({
      quote: {
        ...quote,
        revisions: [revision],
        breakdown,
      },
    });
  } catch (error: any) {
    console.error("Error creating jewelry quote:", error);
    res.status(500).json({
      error: "Failed to create jewelry quote",
      message: error.message,
    });
  }
}
