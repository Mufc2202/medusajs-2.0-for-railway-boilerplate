import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  CurrencyDollar,
  Sparkles,
  SparklesSolid,
  ArrowPath,
  Plus,
  Trash,
  Clock,
  CheckCircle,
  XCircle,
  PencilSquare,
  Eye,
  EllipsisHorizontal,
} from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Input,
  Select,
  Tabs,
  Table,
  Drawer,
  FocusModal,
  IconButton,
  Tooltip,
  DropdownMenu,
  toast,
  Toaster,
} from "@medusajs/ui";
import { useState, useEffect, useMemo, useRef } from "react";

// US Metal Alloy Purities
const METAL_OPTIONS = [
  { value: "gold", label: "Gold (Au)" },
  { value: "silver", label: "Silver (Ag)" },
  { value: "platinum", label: "Platinum (Pt)" },
  { value: "palladium", label: "Palladium (Pd)" },
];

const PURITY_OPTIONS: Record<string, Array<{ value: string; label: string; factor: number }>> = {
  gold: [
    { value: "24k", label: "24K (99.9% Pure Fine Gold)", factor: 0.999 },
    { value: "22k", label: "22K (91.67% Fine)", factor: 0.9167 },
    { value: "21k", label: "21K (87.5% Standard)", factor: 0.875 },
    { value: "18k", label: "18K (75.0% Fine Jewelry)", factor: 0.75 },
    { value: "14k", label: "14K Plumb (58.33% - US Standard)", factor: 0.5833 },
    { value: "10k", label: "10K (41.67% - US FTC Minimum)", factor: 0.4167 },
    { value: "9k", label: "9K (37.5% Foreign Gold)", factor: 0.375 },
    { value: "8k", label: "8K (33.33% Foreign Gold)", factor: 0.3333 },
  ],
  silver: [
    { value: "fine_999", label: ".999 Fine Silver (99.9%)", factor: 0.999 },
    { value: "sterling_925", label: ".925 Sterling Silver (US Standard)", factor: 0.925 },
    { value: "coin_900", label: ".900 US Coin Silver (Pre-1965 90%)", factor: 0.9 },
    { value: "european_800", label: ".800 European Silver (80%)", factor: 0.8 },
  ],
  platinum: [
    { value: "pt_950", label: "Pt 950 (95.0% US Luxury/Bridal)", factor: 0.95 },
    { value: "pt_900", label: "Pt 900 (90/10 Pt/Ir US Bench Standard)", factor: 0.9 },
    { value: "pt_850", label: "Pt 850 (85.0%)", factor: 0.85 },
  ],
  palladium: [
    { value: "pd_950", label: "Pd 950 (95.0%)", factor: 0.95 },
    { value: "pd_500", label: "Pd 500 (50.0%)", factor: 0.5 },
  ],
};

const UNIT_OPTIONS = [
  { value: "dwt", label: "DWT (Pennyweight - US Bench)" },
  { value: "g", label: "Grams (g)" },
  { value: "ozt", label: "Troy Ounces (ozt)" },
  { value: "tola", label: "Tola (11.66g)" },
  { value: "kg", label: "Kilograms (kg)" },
];

const TROY_OZ_TO_GRAMS = 31.1034768;
const TROY_OZ_TO_DWT = 20.0;
const DWT_TO_GRAMS = 1.55517384;

// Refiner settlement rates
const REFINER_RATES: Record<string, number> = {
  gold: 0.98,
  silver: 0.85,
  platinum: 0.90,
  palladium: 0.90,
};

const formatCategoryName = (category: string) => {
  switch (category) {
    case "Scrap Metal":
      return "scrap metal";
    case "Diamonds/gem stone":
      return "diamond/gemstone";
    case "Melee":
      return "melee";
    case "Complete Piece":
      return "complete piece";
    default:
      return (category || "scrap metal").toLowerCase();
  }
};

const ITEM_CATEGORY_OPTIONS = [
  { value: "Scrap Metal", label: "Scrap Metal" },
  { value: "Diamonds/gem stone", label: "Diamonds / Gemstones" },
  { value: "Melee", label: "Melee" },
  { value: "Complete Piece", label: "Complete Piece" },
];

const NON_SCRAP_CATEGORIES = new Set(["Diamonds/gem stone", "Melee", "Complete Piece"]);

export const isScrapMetalItem = (category?: string) => {
  if (!category) return true;
  return !NON_SCRAP_CATEGORIES.has(category);
};

const STANDARD_PURITY_PRESETS: Record<string, Array<{ label: string; percent: number }>> = {
  gold: [
    { label: "10K (41.7%)", percent: 41.67 },
    { label: "14K (58.3%)", percent: 58.33 },
    { label: "18K (75.0%)", percent: 75.0 },
    { label: "22K (91.7%)", percent: 91.67 },
    { label: "24K (99.9%)", percent: 99.9 },
  ],
  silver: [
    { label: ".925 Sterling", percent: 92.5 },
    { label: ".900 Coin", percent: 90.0 },
    { label: ".999 Fine", percent: 99.9 },
  ],
  platinum: [
    { label: "Pt 900 (90%)", percent: 90.0 },
    { label: "Pt 950 (95%)", percent: 95.0 },
  ],
  palladium: [
    { label: "Pd 500 (50%)", percent: 50.0 },
    { label: "Pd 950 (95%)", percent: 95.0 },
  ],
};

interface CalculatorItem {
  id: string;
  item_title: string;
  description: string;
  metal_type: "gold" | "silver" | "platinum" | "palladium";
  purity_percent: number | string;
  purity_karat?: string;
  weight: number | string;
  unit: "dwt" | "g" | "ozt" | "tola" | "kg";
  estimated_wholesale_cost: number | string;
  payout_ratio: number | string;
  labor_charge_per_unit?: number | string;
  labor_charge_flat?: number | string;
  wastage_percent?: number | string;
  diamond_carats?: number | string;
  diamond_points?: number | string;
  diamond_price_per_carat?: number | string;
  stone_notes?: string;
}

const defaultItem: () => CalculatorItem = () => ({
  id: Math.random().toString(36).substring(2, 9),
  item_title: "Scrap Metal",
  description: "",
  metal_type: "gold",
  purity_percent: 58.33,
  weight: "",
  unit: "dwt",
  estimated_wholesale_cost: "",
  payout_ratio: 85,
});

const PriceCalculatorPage = () => {
  // Spot rates state (USD per troy oz)
  const [spotRates, setSpotRates] = useState<{
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  }>({
    gold: 2685.0,
    silver: 31.5,
    platinum: 975.0,
    palladium: 990.0,
  });

  const [loadingSpot, setLoadingSpot] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [tempRates, setTempRates] = useState({ ...spotRates });
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  // Calculator state
  const [mode, setMode] = useState<"retail_selling" | "scrap_buying">("scrap_buying");
  const [items, setItems] = useState<CalculatorItem[]>([defaultItem()]);
  const [profitMargin, setProfitMargin] = useState<number | string>(85); // 85% default scrap margin

  // Quotes & navigation state
  const [activeTab, setActiveTab] = useState<"calculator" | "quotes">("calculator");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [quoteSearch, setQuoteSearch] = useState("");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("all");

  // Save quote drawer state
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [existingCustomers, setExistingCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerSearchInput, setCustomerSearchInput] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const [autoCreateInMedusa, setAutoCreateInMedusa] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);

  // Click outside customer dropdown handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Quote details / history drawer
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Recalculate modal for a saved quote
  const [recalcQuote, setRecalcQuote] = useState<any | null>(null);
  const [isRecalcModalOpen, setIsRecalcModalOpen] = useState(false);
  const [recalcItems, setRecalcItems] = useState<CalculatorItem[]>([]);
  const [recalcSpotRates, setRecalcSpotRates] = useState<{
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  }>({ gold: 2685, silver: 31.5, platinum: 975, palladium: 990 });
  const [recalcMargin, setRecalcMargin] = useState<number>(85);
  const [recalcNotes, setRecalcNotes] = useState("");
  const [recalculating, setRecalculating] = useState(false);

  const openRecalculateModal = (q: any) => {
    setRecalcQuote(q);
    setRecalcSpotRates({
      gold: Number(Number(spotRates.gold || q.spot_prices_snapshot?.gold || 2685.0).toFixed(2)),
      silver: Number(Number(spotRates.silver || q.spot_prices_snapshot?.silver || 31.5).toFixed(2)),
      platinum: Number(Number(spotRates.platinum || q.spot_prices_snapshot?.platinum || 975.0).toFixed(2)),
      palladium: Number(Number(spotRates.palladium || q.spot_prices_snapshot?.palladium || 990.0).toFixed(2)),
    });
    setRecalcMargin(q.profit_margin_percent || 85);
    setRecalcNotes("");

    // Initialize items for editing within the revision modal
    let raw: any[] = [];
    if (Array.isArray(q.items)) {
      raw = q.items;
    } else if (q.items && typeof q.items === "object") {
      if (Array.isArray(q.items.raw_items)) raw = q.items.raw_items;
      else if (Array.isArray(q.items.breakdown_items)) raw = q.items.breakdown_items;
      else raw = Object.values(q.items).filter((v: any) => v && typeof v === "object");
    } else if (typeof q.items === "string") {
      try {
        const parsed = JSON.parse(q.items);
        if (Array.isArray(parsed)) raw = parsed;
        else if (parsed?.raw_items && Array.isArray(parsed.raw_items)) raw = parsed.raw_items;
        else if (parsed?.breakdown_items && Array.isArray(parsed.breakdown_items)) raw = parsed.breakdown_items;
        else if (parsed && typeof parsed === "object") raw = Object.values(parsed);
      } catch {
        raw = [];
      }
    }

    const itemsFormatted: CalculatorItem[] = raw.map((it: any) => {
      let purityPct: any = it.purity_percent;
      if (purityPct === undefined || purityPct === null || isNaN(Number(purityPct))) {
        if (it.custom_purity_percent) {
          purityPct = it.custom_purity_percent;
        } else {
          const match = (PURITY_OPTIONS[it.metal_type || "gold"] || []).find((p) => p.value === it.purity_karat);
          purityPct = match ? Number((match.factor * 100).toFixed(2)) : 58.33;
        }
      }

      let category = it.item_title || "Scrap Metal";
      let description = it.description || "";
      if (!ITEM_CATEGORY_OPTIONS.some((opt) => opt.value === category)) {
        const catLower = category.toLowerCase();
        if (catLower.includes("diamond") || catLower.includes("gem")) {
          category = "Diamonds/gem stone";
        } else if (catLower.includes("melee")) {
          category = "Melee";
        } else if (catLower.includes("complete")) {
          category = "Complete Piece";
        } else {
          // Preserve custom title in description if description was empty
          if (!description && category !== "Scrap Metal") {
            description = category;
          }
          category = "Scrap Metal";
        }
      }

      return {
        id: Math.random().toString(36).substring(2, 9),
        item_title: category,
        description,
        metal_type: it.metal_type || "gold",
        purity_percent: purityPct,
        weight: it.weight !== undefined && it.weight !== null ? it.weight : (it.weight_input || ""),
        unit: it.unit || "dwt",
        estimated_wholesale_cost: it.estimated_wholesale_cost || "",
        payout_ratio: it.payout_ratio !== undefined && it.payout_ratio !== null ? it.payout_ratio : (q.profit_margin_percent || 85),
      };
    });
    setRecalcItems(itemsFormatted.length > 0 ? itemsFormatted : [defaultItem()]);
    setIsRecalcModalOpen(true);
  };

  // Fetch spot rates from backend (live market API with on-spot/DB fallback)
  const fetchSpotRates = async (syncLive = false) => {
    try {
      setLoadingSpot(true);
      const url = syncLive ? "/admin/jewelry-spot-prices?sync_live=true" : "/admin/jewelry-spot-prices";
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiveRates(Boolean(data.is_live));
        if (data.spot_prices && Array.isArray(data.spot_prices)) {
          const goldObj = data.spot_prices.find((p: any) => p.metal === "gold");
          const silverObj = data.spot_prices.find((p: any) => p.metal === "silver");
          const platObj = data.spot_prices.find((p: any) => p.metal === "platinum");
          const palObj = data.spot_prices.find((p: any) => p.metal === "palladium");

          const updated = {
            gold: goldObj ? Number(goldObj.price_per_troy_oz) : 2685.0,
            silver: silverObj ? Number(silverObj.price_per_troy_oz) : 31.5,
            platinum: platObj ? Number(platObj.price_per_troy_oz) : 975.0,
            palladium: palObj ? Number(palObj.price_per_troy_oz) : 990.0,
          };
          setSpotRates(updated);
          setTempRates(updated);

          if (syncLive && data.is_live) {
            toast.success("Live Market Spot Prices Synced", {
              description: `Gold: $${updated.gold.toFixed(2)}/oz • Silver: $${updated.silver.toFixed(2)}/oz`,
            });
          } else if (syncLive && !data.is_live) {
            toast.info("Using Stored Spot Prices", {
              description: "Live market API unavailable. Using stored benchmark rates.",
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch spot rates from API, using defaults:", err);
    } finally {
      setLoadingSpot(false);
    }
  };

  // Fetch quotes list
  const fetchQuotes = async () => {
    try {
      setLoadingQuotes(true);
      let url = "/admin/jewelry-quotes";
      const params = new URLSearchParams();
      if (quoteSearch) params.append("search", quoteSearch);
      if (quoteStatusFilter !== "all") params.append("status", quoteStatusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  // Fetch customers from Medusa Customer Module
  const fetchCustomers = async (search = "") => {
    try {
      setLoadingCustomers(true);
      let url = "/admin/customers?limit=50";
      if (search) url += `&q=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setExistingCustomers(json.customers || []);
      }
    } catch (err) {
      console.warn("Could not fetch customers list:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!customerSearchInput.trim()) return existingCustomers;
    const q = customerSearchInput.toLowerCase().trim();
    return existingCustomers.filter((c) => {
      const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
      const email = (c.email || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [existingCustomers, customerSearchInput]);

  useEffect(() => {
    fetchSpotRates();
    fetchQuotes();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [quoteSearch, quoteStatusFilter]);

  // Save updated spot rates
  const handleSaveSpotRates = async () => {
    try {
      setLoadingSpot(true);
      const res = await fetch("/admin/jewelry-spot-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prices: [
            { metal: "gold", price_per_troy_oz: Number(tempRates.gold) },
            { metal: "silver", price_per_troy_oz: Number(tempRates.silver) },
            { metal: "platinum", price_per_troy_oz: Number(tempRates.platinum) },
            { metal: "palladium", price_per_troy_oz: Number(tempRates.palladium) },
          ],
        }),
      });
      if (res.ok) {
        setSpotRates({ ...tempRates });
        setShowRatesModal(false);
        toast.success("Spot Prices Updated", {
          description: `Benchmark rates updated: Gold $${Number(tempRates.gold).toFixed(2)}/oz`,
        });
      } else {
        const errData = await res.json();
        toast.error("Failed to update spot rates", {
          description: errData.message || errData.error || "Unknown error",
        });
      }
    } catch (err: any) {
      console.error("Error saving spot rates:", err);
      toast.error("Error updating spot rates", { description: err.message });
    } finally {
      setLoadingSpot(false);
    }
  };

  // Calculate summary in real time
  const calculationSummary = useMemo(() => {
    let totalPureOzt = 0;
    let totalPureGrams = 0;
    let totalPureDwt = 0;
    let totalBaseMetalCost = 0;
    let totalWholesaleCost = 0;
    let totalOfferedPrice = 0;
    let totalProfitAmount = 0;

    const itemResults = items.map((item) => {
      const isScrapMetal = isScrapMetalItem(item.item_title);
      // 1. Weight conversions (only for scrap metal)
      const weightNum = isScrapMetal ? (Number(item.weight) || 0) : 0;
      let grams = 0;
      switch (item.unit) {
        case "dwt":
          grams = weightNum * DWT_TO_GRAMS;
          break;
        case "g":
          grams = weightNum;
          break;
        case "ozt":
          grams = weightNum * TROY_OZ_TO_GRAMS;
          break;
        case "tola":
          grams = weightNum * 11.6638;
          break;
        case "kg":
          grams = weightNum * 1000.0;
          break;
        default:
          grams = weightNum;
      }
      const ozt = grams / TROY_OZ_TO_GRAMS;
      const dwt = ozt * TROY_OZ_TO_DWT;

      // 2. Purity factor (from standard purity percent)
      const purityPct = Number(item.purity_percent);
      const purityFactor = isScrapMetal && !isNaN(purityPct) && purityPct > 0 ? purityPct / 100.0 : 1.0;

      const pureOzt = isScrapMetal ? ozt * purityFactor : 0;
      const pureGrams = isScrapMetal ? grams * purityFactor : 0;
      const pureDwt = isScrapMetal ? dwt * purityFactor : 0;

      const spotPricePerOzt = spotRates[item.metal_type] || 0;
      const refinerRate = REFINER_RATES[item.metal_type?.toLowerCase()] ?? 1.0;
      const baseMetalCost = isScrapMetal ? pureOzt * spotPricePerOzt * refinerRate : 0;

      const wholesaleCost = !isScrapMetal ? (Number(item.estimated_wholesale_cost) || 0) : 0;
      const itemBaseValuation = baseMetalCost + wholesaleCost;

      const itemPayoutRatio = (item.payout_ratio !== undefined && item.payout_ratio !== "" && !isNaN(Number(item.payout_ratio)))
        ? Number(item.payout_ratio)
        : 85;

      const itemOfferedPrice = itemBaseValuation * (itemPayoutRatio / 100.0);
      const individualProfit = itemBaseValuation - itemOfferedPrice;

      totalPureOzt += pureOzt;
      totalPureGrams += pureGrams;
      totalPureDwt += pureDwt;
      totalBaseMetalCost += baseMetalCost;
      totalWholesaleCost += wholesaleCost;
      totalOfferedPrice += itemOfferedPrice;
      totalProfitAmount += individualProfit;

      return {
        ...item,
        ozt,
        grams,
        dwt,
        pureOzt,
        pureGrams,
        pureDwt,
        baseMetalCost,
        wholesaleCost,
        itemBaseValuation,
        itemPayoutRatio,
        itemOfferedPrice,
        individualProfit,
      };
    });

    const totalBaseValuation = totalBaseMetalCost + totalWholesaleCost;
    const effectiveMargin = totalBaseValuation > 0
      ? (totalOfferedPrice / totalBaseValuation) * 100.0
      : 85;

    return {
      pure_metal_ozt: totalPureOzt,
      pure_metal_grams: totalPureGrams,
      pure_metal_dwt: totalPureDwt,
      base_metal_cost: totalBaseMetalCost,
      estimated_wholesale_cost: totalWholesaleCost,
      total_base_valuation: totalBaseValuation,
      profit_margin_percent: Number(effectiveMargin.toFixed(1)),
      profit_amount: totalProfitAmount,
      final_offered_price: totalOfferedPrice,
      itemResults,
    };
  }, [items, spotRates]);

  // Real-time recalculation simulation for a saved quote
  const recalcSimulation = useMemo(() => {
    if (!recalcQuote) return null;
    const currentItems = recalcItems && recalcItems.length > 0
      ? recalcItems
      : (Array.isArray(recalcQuote.items) ? recalcQuote.items : (recalcQuote.items?.raw_items || []));
    if (!currentItems || currentItems.length === 0) return null;

    let totalPureOzt = 0;
    let totalBaseMetalCost = 0;
    let totalWholesaleCost = 0;
    let totalOfferedPrice = 0;
    let totalProfitAmount = 0;

    currentItems.forEach((item: any) => {
      const isScrapMetal = isScrapMetalItem(item.item_title);
      let grams = 0;
      const weight = isScrapMetal ? (Number(item.weight) || 0) : 0;
      switch (item.unit) {
        case "dwt": grams = weight * DWT_TO_GRAMS; break;
        case "g": grams = weight; break;
        case "ozt": grams = weight * TROY_OZ_TO_GRAMS; break;
        case "tola": grams = weight * 11.6638; break;
        case "kg": grams = weight * 1000.0; break;
        default: grams = weight;
      }
      const ozt = grams / TROY_OZ_TO_GRAMS;

      let purityFactor = 1.0;
      if (isScrapMetal) {
        if (item.purity_percent !== undefined && item.purity_percent !== null && !isNaN(Number(item.purity_percent))) {
          purityFactor = Number(item.purity_percent) / 100.0;
        } else {
          const metalPurities = PURITY_OPTIONS[item.metal_type] || [];
          const purityMatch = metalPurities.find((p) => p.value === item.purity_karat);
          purityFactor = purityMatch ? purityMatch.factor : 1.0;
        }
      } else {
        purityFactor = 0;
      }

      const pureOzt = isScrapMetal ? ozt * purityFactor : 0;
      const spotPricePerOzt = Number((recalcSpotRates as any)[item.metal_type]) || 0;
      const refinerRate = REFINER_RATES[item.metal_type?.toLowerCase()] ?? 1.0;
      const baseMetalCost = isScrapMetal ? pureOzt * spotPricePerOzt * refinerRate : 0;
      const wholesaleCost = !isScrapMetal ? (Number(item.estimated_wholesale_cost) || 0) : 0;
      const itemValuation = baseMetalCost + wholesaleCost;

      const itemPayoutRatio = (item.payout_ratio !== undefined && item.payout_ratio !== "" && !isNaN(Number(item.payout_ratio)))
        ? Number(item.payout_ratio)
        : (recalcMargin > 0 && recalcMargin <= 100 ? recalcMargin : 85);

      const itemOffered = itemValuation * (itemPayoutRatio / 100.0);
      const indProfit = itemValuation - itemOffered;

      totalPureOzt += pureOzt;
      totalBaseMetalCost += baseMetalCost;
      totalWholesaleCost += wholesaleCost;
      totalOfferedPrice += itemOffered;
      totalProfitAmount += indProfit;
    });

    const totalBaseValuation = totalBaseMetalCost + totalWholesaleCost;
    const effectiveMargin = totalBaseValuation > 0
      ? (totalOfferedPrice / totalBaseValuation) * 100.0
      : (recalcMargin || 85);

    const previousPrice = (Number(recalcQuote.final_offered_price) || 0) / 100;
    const priceDelta = totalOfferedPrice - previousPrice;
    const deltaPercent = previousPrice > 0 ? (priceDelta / previousPrice) * 100 : 0;

    return {
      totalPureOzt,
      baseMetalCost: totalBaseMetalCost,
      estimated_wholesale_cost: totalWholesaleCost,
      total_base_valuation: totalBaseValuation,
      effectiveMargin: Number(effectiveMargin.toFixed(1)),
      profitAmount: totalProfitAmount,
      finalOfferedPrice: totalOfferedPrice,
      previousPrice,
      priceDelta,
      deltaPercent,
    };
  }, [recalcQuote, recalcSpotRates, recalcMargin, recalcItems]);

  // Handle item changes
  const updateItem = (index: number, field: keyof CalculatorItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "metal_type") {
        const presets = STANDARD_PURITY_PRESETS[value as string] || [];
        if (presets.length > 0) {
          copy[index].purity_percent = presets[0].percent;
        }
      }
      if (field === "item_title") {
        if (value !== "Scrap Metal") {
          copy[index].weight = "";
        } else {
          copy[index].estimated_wholesale_cost = "";
        }
      }
      return copy;
    });
  };

  const updateRecalcItem = (index: number, field: keyof CalculatorItem, value: any) => {
    setRecalcItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "metal_type") {
        const presets = STANDARD_PURITY_PRESETS[value as string] || [];
        if (presets.length > 0) {
          copy[index].purity_percent = presets[0].percent;
        }
      }
      if (field === "item_title") {
        if (value !== "Scrap Metal") {
          copy[index].weight = "";
        } else {
          copy[index].estimated_wholesale_cost = "";
        }
      }
      return copy;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, defaultItem()]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Quote to DB
  const handleSaveQuote = async () => {
    // 1. Customer & Title validation
    if (!customerName?.trim() || !quoteTitle?.trim()) {
      toast.error("Required fields missing", {
        description: "Please select or enter a customer name and quote title.",
      });
      return;
    }

    // 2. Total Quoted Price validation: Cannot store $0.00 quotes
    if (calculationSummary.final_offered_price <= 0) {
      toast.error("Invalid Quote Total", {
        description: "Calculated quote price must be greater than $0.00 to save.",
      });
      return;
    }

    // 3. Validate Items:
    // - Scrap metal items require positive weight (> 0)
    // - Non-scrap items (Melee, Complete Piece, Diamonds/gem stone) require estimated wholesale cost (> 0)
    for (let idx = 0; idx < items.length; idx++) {
      const it = items[idx];
      const isScrap = isScrapMetalItem(it.item_title);

      if (isScrap) {
        const weightNum = Number(it.weight);
        if (
          it.weight === "" ||
          it.weight === null ||
          it.weight === undefined ||
          isNaN(weightNum) ||
          weightNum <= 0
        ) {
          toast.error("Invalid Item Weight", {
            description: `Please enter a valid weight (> 0) for Item #${idx + 1} (${it.item_title || "Scrap Metal"}).`,
          });
          return;
        }
      } else {
        const costNum = Number(it.estimated_wholesale_cost);
        if (
          it.estimated_wholesale_cost === "" ||
          it.estimated_wholesale_cost === null ||
          it.estimated_wholesale_cost === undefined ||
          isNaN(costNum) ||
          costNum <= 0
        ) {
          toast.error("Invalid Wholesale Cost", {
            description: `Please enter a valid estimated wholesale cost (> $0.00) for Item #${idx + 1} (${it.item_title}).`,
          });
          return;
        }
      }
    }

    try {
      setSavingQuote(true);
      const res = await fetch("/admin/jewelry-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerMode === "existing" ? (selectedCustomerId || undefined) : undefined,
          customer_name: customerName.trim(),
          customer_email: customerEmail?.trim() || undefined,
          customer_phone: customerPhone?.trim() || undefined,
          create_customer_if_missing: customerMode === "new" ? autoCreateInMedusa : false,
          title: quoteTitle.trim(),
          currency_code: "usd",
          calculation_mode: "scrap_buying",
          items: items.map((i) => ({
            item_title: i.item_title || "Scrap Metal",
            description: i.description?.trim() || "",
            metal_type: i.metal_type,
            purity_percent: Number(i.purity_percent) || 0,
            weight: Number(i.weight) || 0,
            unit: i.unit,
            estimated_wholesale_cost: Number(i.estimated_wholesale_cost) || 0,
            payout_ratio: Number(i.payout_ratio) || 85,
          })),
          spot_prices: spotRates,
          profit_margin_percent: calculationSummary.profit_margin_percent,
          notes: quoteNotes,
        }),
      });

      if (res.ok) {
        // Reset Drawer fields
        setIsSaveDrawerOpen(false);
        setSelectedCustomerId(null);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setQuoteTitle("");
        setQuoteNotes("");

        // Reset Live Price Calculator form
        setItems([defaultItem()]);
        setProfitMargin(85);
        setMode("scrap_buying");

        fetchQuotes();
        toast.success("Quote Saved Successfully", {
          description: `Quote created for ${customerName} ($${calculationSummary.final_offered_price.toFixed(2)})`,
        });
      } else {
        const errData = await res.json();
        toast.error("Failed to save quote", {
          description: errData.message || errData.error || "Database error",
        });
      }
    } catch (err: any) {
      toast.error("Error saving quote", { description: err.message });
    } finally {
      setSavingQuote(false);
    }
  };

  // Execute Recalculation on a saved quote
  const handleRecalculateQuote = async () => {
    if (!recalcQuote) return;
    try {
      setRecalculating(true);
      const newPrice = recalcSimulation?.finalOfferedPrice || 0;
      const effectiveMargin = recalcSimulation?.effectiveMargin || recalcMargin;
      const res = await fetch(`/admin/jewelry-quotes/${recalcQuote.id}/recalculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: recalcItems.map((it) => ({
            item_title: it.item_title,
            description: it.description,
            metal_type: it.metal_type,
            purity_percent: Number(it.purity_percent) || 0,
            weight: Number(it.weight) || 0,
            unit: it.unit,
            estimated_wholesale_cost: Number(it.estimated_wholesale_cost) || 0,
            payout_ratio: Number(it.payout_ratio) || 85,
          })),
          spot_prices: recalcSpotRates,
          profit_margin_percent: effectiveMargin,
          trigger_reason: "spot_price_update",
          notes: recalcNotes || `Recalculated with Gold $${recalcSpotRates.gold}/oz, Margin ${effectiveMargin}%`,
        }),
      });

      if (res.ok) {
        setIsRecalcModalOpen(false);
        setRecalcQuote(null);
        setRecalcNotes("");
        fetchQuotes();
        toast.success("Quote Recalculated", {
          description: `Updated price to $${newPrice.toFixed(2)} with new revision recorded.`,
        });
      } else {
        const errData = await res.json();
        toast.error("Recalculation Failed", {
          description: errData.message || errData.error || "Unable to recalculate quote",
        });
      }
    } catch (err: any) {
      toast.error("Error recalculating quote", { description: err.message });
    } finally {
      setRecalculating(false);
    }
  };

  // Update Quote Status
  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    try {
      const res = await fetch(`/admin/jewelry-quotes/${quoteId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchQuotes();
        toast.success("Status Updated", {
          description: `Quote status changed to ${newStatus}.`,
        });
      } else {
        const errData = await res.json();
        toast.error("Status Update Failed", { description: errData.message || errData.error });
      }
    } catch (err: any) {
      console.error("Error updating quote status:", err);
      toast.error("Error updating status", { description: err.message });
    }
  };

  // Delete Quote
  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const res = await fetch(`/admin/jewelry-quotes/${quoteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchQuotes();
        toast.success("Quote Deleted", {
          description: "Quote and its revision history have been removed.",
        });
      } else {
        const errData = await res.json();
        toast.error("Delete Failed", { description: errData.message || errData.error });
      }
    } catch (err: any) {
      console.error("Error deleting quote:", err);
      toast.error("Error deleting quote", { description: err.message });
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ui-border-base pb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Heading level="h1" className="text-xl sm:text-2xl font-bold text-ui-fg-base flex items-center gap-2">
              <CurrencyDollar className="text-ui-fg-interactive" />
              Buying Jewelry Calculator
            </Heading>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="small"
            onClick={() => fetchSpotRates(true)}
            disabled={loadingSpot}
            className="whitespace-nowrap shrink-0"
          >
            <ArrowPath className={`mr-1.5 ${loadingSpot ? "animate-spin" : ""}`} /> Refresh Rates
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowRatesModal(true)}
            className="whitespace-nowrap shrink-0"
          >
            <PencilSquare className="mr-1.5" /> Adjust Spot Prices
          </Button>
        </div>
      </div>

      {/* Spot Price Ticker Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gold */}
        <Container className="p-4 flex flex-col justify-between shadow-xs border border-ui-border-base">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Gold (Au)</span>
            <Badge color="orange" size="xsmall">Plumb 10k-24k</Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">${spotRates.gold.toFixed(2)}</span>
            <span className="text-xs text-ui-fg-subtle"> / ozt</span>
          </div>
          <div className="text-xs text-ui-fg-muted flex justify-between border-t border-ui-border-base pt-2">
            <span>${(spotRates.gold / TROY_OZ_TO_DWT).toFixed(2)}/dwt</span>
            <span>${(spotRates.gold / TROY_OZ_TO_GRAMS).toFixed(2)}/g</span>
          </div>
        </Container>

        {/* Silver */}
        <Container className="p-4 flex flex-col justify-between shadow-xs border border-ui-border-base">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Silver (Ag)</span>
            <Badge color="grey" size="xsmall">.925 / .900 Coin</Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">${spotRates.silver.toFixed(2)}</span>
            <span className="text-xs text-ui-fg-subtle"> / ozt</span>
          </div>
          <div className="text-xs text-ui-fg-muted flex justify-between border-t border-ui-border-base pt-2">
            <span>${(spotRates.silver / TROY_OZ_TO_DWT).toFixed(2)}/dwt</span>
            <span>${(spotRates.silver / TROY_OZ_TO_GRAMS).toFixed(2)}/g</span>
          </div>
        </Container>

        {/* Platinum */}
        <Container className="p-4 flex flex-col justify-between shadow-xs border border-ui-border-base">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Platinum (Pt)</span>
            <Badge color="blue" size="xsmall">950 / 900 Pt/Ir</Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">${spotRates.platinum.toFixed(2)}</span>
            <span className="text-xs text-ui-fg-subtle"> / ozt</span>
          </div>
          <div className="text-xs text-ui-fg-muted flex justify-between border-t border-ui-border-base pt-2">
            <span>${(spotRates.platinum / TROY_OZ_TO_DWT).toFixed(2)}/dwt</span>
            <span>${(spotRates.platinum / TROY_OZ_TO_GRAMS).toFixed(2)}/g</span>
          </div>
        </Container>

        {/* Palladium */}
        <Container className="p-4 flex flex-col justify-between shadow-xs border border-ui-border-base">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Palladium (Pd)</span>
            <Badge color="purple" size="xsmall">950 / 500</Badge>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">${spotRates.palladium.toFixed(2)}</span>
            <span className="text-xs text-ui-fg-subtle"> / ozt</span>
          </div>
          <div className="text-xs text-ui-fg-muted flex justify-between border-t border-ui-border-base pt-2">
            <span>${(spotRates.palladium / TROY_OZ_TO_DWT).toFixed(2)}/dwt</span>
            <span>${(spotRates.palladium / TROY_OZ_TO_GRAMS).toFixed(2)}/g</span>
          </div>
        </Container>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="border-b border-ui-border-base mt-1">
        <div className="flex items-center gap-x-8 -mb-px overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`pb-3 pt-1 text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap outline-none ${activeTab === "calculator"
              ? "border-ui-fg-base text-ui-fg-base font-semibold"
              : "border-transparent text-ui-fg-muted hover:text-ui-fg-base hover:border-ui-border-strong font-medium"
              }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "calculator" ? "text-ui-fg-interactive" : "text-ui-fg-muted"}`} />
            <span>Live Price Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quotes")}
            className={`pb-3 pt-1 text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap outline-none ${activeTab === "quotes"
              ? "border-ui-fg-base text-ui-fg-base font-semibold"
              : "border-transparent text-ui-fg-muted hover:text-ui-fg-base hover:border-ui-border-strong font-medium"
              }`}
          >
            <Clock className="w-4 h-4 text-ui-fg-muted" />
            <span>Customer Quotes & History Log</span>
            <Badge size="xsmall" color="grey" className="ml-1 font-mono">
              {quotes.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Calculator */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Item configuration */}
          <div className="lg:col-span-8 space-y-4">
            {/* Section Header */}
            <Container className="p-4 sm:p-5 shadow-xs border border-ui-border-base">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                    <CurrencyDollar className="w-4 h-4" />
                  </div>
                  <Heading level="h2" className="text-sm sm:text-base font-semibold text-ui-fg-base">
                    Quote To Buy Jewelry
                  </Heading>
                </div>
                <Text className="text-xs text-ui-fg-subtle mt-1">
                  Configure jewelry pieces, lot types, metals, purity, and wholesale costs to compute live valuations and customer payout offers.
                </Text>
              </div>
            </Container>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item, idx) => {
                const isScrapMetal = isScrapMetalItem(item.item_title);
                return (
                <Container key={item.id} className="p-4 sm:p-5 shadow-xs border border-ui-border-base relative space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <Badge color="blue" size="small">Item #{idx + 1}</Badge>
                      <select
                        value={item.item_title}
                        onChange={(e) => updateItem(idx, "item_title", e.target.value)}
                        className="text-xs sm:text-sm font-semibold p-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base outline-none cursor-pointer"
                      >
                        {ITEM_CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    {items.length > 1 && (
                      <IconButton
                        variant="transparent"
                        size="small"
                        onClick={() => removeItem(idx)}
                        className="text-ui-fg-muted hover:text-ui-fg-error"
                      >
                        <Trash />
                      </IconButton>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                      Description for Individual Item
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Broken 14K herringbone chain, missing clasp, 2 melee diamonds"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  {isScrapMetal ? (
                    <>
                      {/* Metal Specifications for Scrap Metal */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Metal Type */}
                        <div>
                          <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Metal Type</label>
                          <select
                            value={item.metal_type}
                            onChange={(e) => updateItem(idx, "metal_type", e.target.value)}
                            className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                          >
                            {METAL_OPTIONS.map((m) => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Standard Editable Purity (%) */}
                        <div>
                          <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                            Purity (%) *
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="e.g. 58.33"
                              value={item.purity_percent}
                              onChange={(e) => updateItem(idx, "purity_percent", e.target.value)}
                              className="text-xs font-medium pr-7"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                              %
                            </span>
                          </div>
                          {/* Purity Quick Preset Chips */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(STANDARD_PURITY_PRESETS[item.metal_type] || []).map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => updateItem(idx, "purity_percent", preset.percent)}
                                className={`px-1.5 py-0.5 rounded text-[10px] border transition-all ${Number(item.purity_percent) === preset.percent
                                  ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold shadow-xs"
                                  : "bg-ui-bg-subtle text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base hover:bg-ui-bg-base"
                                  }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Weight */}
                        <div>
                          <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Weight *</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.weight}
                            onChange={(e) => updateItem(idx, "weight", e.target.value)}
                            className="text-xs font-medium"
                          />
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Weight Unit</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(idx, "unit", e.target.value)}
                            className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                          >
                            {UNIT_OPTIONS.map((u) => (
                              <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Margin (%) for Scrap Metal */}
                      <div className="pt-3 border-t border-ui-border-base max-w-sm">
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                          Margin (%)
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            placeholder="85"
                            value={item.payout_ratio}
                            onChange={(e) => updateItem(idx, "payout_ratio", e.target.value)}
                            className="text-xs font-medium pr-7"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                            %
                          </span>
                        </div>
                        {/* Margin Quick Presets */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {[70, 75, 80, 85, 90, 95].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => updateItem(idx, "payout_ratio", preset)}
                              className={`px-1.5 py-0.5 rounded text-[10px] border transition-all ${Number(item.payout_ratio) === preset
                                ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold shadow-xs"
                                : "bg-ui-bg-subtle text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base hover:bg-ui-bg-base"
                                }`}
                            >
                              {preset}%
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-ui-fg-muted block mt-1">
                          Margin percentage applied to this line item
                        </span>
                      </div>
                    </>
                  ) : (
                    /* Estimated Wholesale Cost & Individual Item Margin (%) for non-scrap items */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                          Estimated Wholesale Cost ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                            $
                          </span>
                          <Input
                            type="number"
                            step="10"
                            min="0"
                            placeholder="0.00"
                            value={item.estimated_wholesale_cost}
                            onChange={(e) => updateItem(idx, "estimated_wholesale_cost", e.target.value)}
                            className="text-xs font-medium pl-6"
                          />
                        </div>
                        <span className="text-[10px] text-ui-fg-muted block mt-1">
                          Wholesale benchmark value for diamonds, gems, or complete pieces
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                          Margin (%)
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            placeholder="85"
                            value={item.payout_ratio}
                            onChange={(e) => updateItem(idx, "payout_ratio", e.target.value)}
                            className="text-xs font-medium pr-7"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                            %
                          </span>
                        </div>
                        {/* Margin Quick Presets */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {[70, 75, 80, 85, 90, 95].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => updateItem(idx, "payout_ratio", preset)}
                              className={`px-1.5 py-0.5 rounded text-[10px] border transition-all ${Number(item.payout_ratio) === preset
                                ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold shadow-xs"
                                : "bg-ui-bg-subtle text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base hover:bg-ui-bg-base"
                                }`}
                            >
                              {preset}%
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-ui-fg-muted block mt-1">
                          Margin percentage applied to this line item
                        </span>
                      </div>
                    </div>
                  )}
                </Container>
              );
              })}

              <Button variant="secondary" size="small" onClick={addItem} className="w-full border-dashed">
                <Plus className="mr-1" /> Add Another Item / Lot to Calculation
              </Button>
            </div>
          </div>

          {/* Right 4 Cols: Live Price Breakdown & Sticky Summary */}
          <div className="lg:col-span-4">
            <Container className="p-5 shadow-xs border border-ui-border-base bg-ui-bg-subtle sticky top-6 space-y-4">
              <div className="pb-3 border-b border-ui-border-base flex items-center justify-between">
                <Heading level="h2" className="text-base font-bold text-ui-fg-base">Calculation Summary</Heading>
              </div>

              {/* Itemized Margin Quote Breakdown */}
              <div className="space-y-2 text-xs border-b border-ui-border-base pb-3">
                {calculationSummary.itemResults.map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between text-ui-fg-subtle">
                    <span>
                      item #{idx + 1} - {formatCategoryName(item.item_title)} {item.itemPayoutRatio}%
                    </span>
                    <span className="font-semibold text-ui-fg-base">
                      ${item.itemOfferedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-ui-fg-subtle border-t border-ui-border-base pt-2">
                  <span>Total Base Valuation:</span>
                  <span className="font-semibold text-ui-fg-base">${calculationSummary.total_base_valuation.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                  <span>Margin Quoted:</span>
                  <span>{calculationSummary.profit_margin_percent}%</span>
                </div>

                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Jeweler Profit:</span>
                  <span>+${calculationSummary.profit_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Final Highlighted Quote Price */}
              <div className="p-4 rounded-xl bg-ui-bg-base border border-emerald-500/30 text-center shadow-xs">
                <Text className="text-[11px] uppercase font-bold tracking-wider text-ui-fg-subtle">
                  Buying Quote
                </Text>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  ${calculationSummary.final_offered_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="large"
                  className="w-full font-bold shadow-xs"
                  onClick={() => {
                    setQuoteTitle(items[0]?.item_title ? `${items[0].item_title} Purchase Quote` : "Buying Jewelry Quote");
                    setIsSaveDrawerOpen(true);
                  }}
                >
                  <CheckCircle className="mr-1.5" /> Save as Customer Quote
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  onClick={() => {
                    setItems([defaultItem()]);
                    setProfitMargin(85);
                  }}
                >
                  Reset Calculator
                </Button>
              </div>
            </Container>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Quotes & History Log */}
      {activeTab === "quotes" && (
        <Container className="divide-y divide-ui-border-base p-0 overflow-hidden shadow-xs border border-ui-border-base">
          {/* Header with Search and Filter */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
                Issued Customer Quotes & Revisions
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                Manage all quotes offered to customers. Re-calculate with 1-click as gold spot prices fluctuate.
              </Text>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Input
                type="search"
                placeholder="Search customer, title..."
                value={quoteSearch}
                onChange={(e) => setQuoteSearch(e.target.value)}
                className="w-56 text-xs"
              />
              <select
                value={quoteStatusFilter}
                onChange={(e) => setQuoteStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
              >
                <option value="all">All Statuses</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {loadingQuotes ? (
            <div className="py-16 text-center text-ui-fg-muted text-xs">
              <ArrowPath className="animate-spin inline-block mr-2" /> Loading customer quotes...
            </div>
          ) : quotes.length === 0 ? (
            <div className="py-16 text-center text-ui-fg-muted px-4">
              <Text className="text-xs">
                No quotes found. Calculate a price and click "Save as Customer Quote" to get started.
              </Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="pl-6">Quote / Title</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Gold Spot</Table.HeaderCell>
                    <Table.HeaderCell>Offered Price</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Revisions</Table.HeaderCell>
                    <Table.HeaderCell className="text-right pr-6">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {quotes.map((q) => {
                    const goldSpot = q.spot_prices_snapshot?.gold || 0;
                    const finalPrice = (Number(q.final_offered_price) || 0) / 100;
                    const revisionsCount = q.revisions?.length || 1;

                    let statusBadgeColor: any = "blue";
                    if (q.status === "accepted") statusBadgeColor = "green";
                    if (q.status === "declined") statusBadgeColor = "red";
                    if (q.status === "expired") statusBadgeColor = "grey";

                    return (
                      <Table.Row
                        key={q.id}
                        className="cursor-pointer hover:bg-ui-bg-subtle-hover transition-colors"
                        onClick={() => {
                          setSelectedQuote(q);
                          setIsHistoryDrawerOpen(true);
                        }}
                      >
                        <Table.Cell className="pl-6">
                          <div>
                            <Text className="font-semibold text-xs text-ui-fg-base hover:text-ui-fg-interactive transition-colors">
                              {q.title}
                            </Text>
                            <Text className="text-[10px] text-ui-fg-muted">
                              {new Date(q.created_at).toLocaleDateString()}
                            </Text>
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          <div>
                            <Text className="font-medium text-xs text-ui-fg-base">{q.customer_name}</Text>
                            {q.customer_email && (
                              <Text className="text-[10px] text-ui-fg-muted">{q.customer_email}</Text>
                            )}
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          <Text className="text-xs font-mono">${goldSpot.toFixed(2)}/oz</Text>
                        </Table.Cell>


                        <Table.Cell>
                          <Text className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            ${finalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </Text>
                        </Table.Cell>

                        <Table.Cell>
                          <Badge size="xsmall" color={statusBadgeColor}>
                            {q.status}
                          </Badge>
                        </Table.Cell>

                        <Table.Cell>
                          <Badge size="xsmall" color="grey">
                            Rev #{revisionsCount}
                          </Badge>
                        </Table.Cell>

                        <Table.Cell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenu.Trigger asChild>
                                <IconButton
                                  variant="transparent"
                                  size="small"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EllipsisHorizontal />
                                </IconButton>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content align="end">
                                <DropdownMenu.Item
                                  className="gap-x-2 text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedQuote(q);
                                    setIsHistoryDrawerOpen(true);
                                  }}
                                >
                                  <Eye className="w-3.5 h-3.5 text-ui-fg-subtle" />
                                  <span>View History & Details</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  className="gap-x-2 text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openRecalculateModal(q);
                                  }}
                                >
                                  <ArrowPath className="w-3.5 h-3.5 text-ui-fg-subtle" />
                                  <span>Re-calculate Price</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item
                                  className="gap-x-2 text-xs text-ui-fg-error focus:text-ui-fg-error cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteQuote(q.id);
                                  }}
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                  <span>Delete Quote</span>
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          )}
        </Container>
      )}

      {/* Adjust Spot Prices Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-ui-bg-base border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <Heading level="h2" className="text-lg font-bold border-b pb-2">
              Adjust US Spot Prices (USD / Troy Oz)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              Update precious metal benchmark spot prices. Calculations and new quotes will automatically use these rates.
            </Text>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">🟡 Gold (USD / ozt)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempRates.gold}
                  onChange={(e) => setTempRates({ ...tempRates, gold: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-md border bg-ui-bg-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">⚪ Silver (USD / ozt)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempRates.silver}
                  onChange={(e) => setTempRates({ ...tempRates, silver: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-md border bg-ui-bg-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">🔘 Platinum (USD / ozt)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempRates.platinum}
                  onChange={(e) => setTempRates({ ...tempRates, platinum: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-md border bg-ui-bg-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">🟣 Palladium (USD / ozt)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempRates.palladium}
                  onChange={(e) => setTempRates({ ...tempRates, palladium: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-md border bg-ui-bg-field"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-ui-border-base">
              <Button
                variant="secondary"
                size="small"
                onClick={async () => {
                  await fetchSpotRates(true);
                  setShowRatesModal(false);
                }}
                disabled={loadingSpot}
                className="text-xs"
              >
                <ArrowPath className={`mr-1.5 ${loadingSpot ? "animate-spin" : ""}`} /> Fetch Live Market Rates
              </Button>

              <div className="flex items-center gap-2 justify-end">
                <Button variant="secondary" size="small" onClick={() => setShowRatesModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="small" onClick={handleSaveSpotRates} disabled={loadingSpot}>
                  Save Spot Rates
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Quote Drawer */}
      <Drawer open={isSaveDrawerOpen} onOpenChange={setIsSaveDrawerOpen}>
        <Drawer.Content className="max-w-lg max-h-screen flex flex-col overflow-hidden">
          <Drawer.Header className="shrink-0">
            <Drawer.Title className="text-lg font-bold">Save Customer Price Quote</Drawer.Title>
            <Drawer.Description className="text-xs text-ui-fg-subtle">
              Store this calculation linked to a customer. All revisions and future recalculations will be tracked.
            </Drawer.Description>
          </Drawer.Header>

          <Drawer.Body className="space-y-4 py-4 flex-1 overflow-y-auto min-h-0">
            <div>
              <label className="block text-xs font-semibold text-ui-fg-base mb-1">Quote Title *</label>
              <Input
                placeholder="e.g. 14K Diamond Cuban Bracelet"
                value={quoteTitle}
                onChange={(e) => setQuoteTitle(e.target.value)}
              />
            </div>

            {/* Customer Mode Selection */}
            <div className="border border-ui-border-base rounded-xl p-4 bg-ui-bg-subtle space-y-3.5">
              <label className="text-xs font-semibold text-ui-fg-base block">Customer *</label>

              <Tabs
                value={customerMode}
                onValueChange={(val) => {
                  setCustomerMode(val as "existing" | "new");
                  if (val === "existing") {
                    fetchCustomers();
                  } else {
                    setSelectedCustomerId(null);
                    setCustomerName("");
                    setCustomerEmail("");
                    setCustomerPhone("");
                  }
                }}
              >
                <Tabs.List className="w-full grid grid-cols-2">
                  <Tabs.Trigger value="existing" className="text-xs">
                    Select Existing
                  </Tabs.Trigger>
                  <Tabs.Trigger value="new" className="text-xs">
                    + New Customer / Lead
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs>

              {/* Mode 1: Select Existing Customer */}
              {customerMode === "existing" && (
                <div className="space-y-2.5 pt-1">
                  {selectedCustomerId ? (
                    <div className="p-3.5 rounded-xl bg-ui-bg-base border border-ui-border-base flex items-center justify-between shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-ui-fg-base">{customerName}</span>
                          <Badge color="green" size="xsmall">Linked</Badge>
                        </div>
                        <span className="text-[11px] text-ui-fg-muted block mt-0.5">
                          {customerEmail || "No email"} {customerPhone ? `• ${customerPhone}` : ""}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedCustomerId(null);
                          setCustomerName("");
                          setCustomerEmail("");
                          setCustomerPhone("");
                          setCustomerSearchInput("");
                          setIsCustomerDropdownOpen(true);
                        }}
                        className="text-xs"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div ref={customerDropdownRef} className="relative">
                      <Input
                        type="search"
                        placeholder="Type customer name or email..."
                        value={customerSearchInput}
                        onFocus={() => setIsCustomerDropdownOpen(true)}
                        onChange={(e) => {
                          setCustomerSearchInput(e.target.value);
                          fetchCustomers(e.target.value);
                          setIsCustomerDropdownOpen(true);
                        }}
                        className="text-xs"
                      />

                      {/* Floating Instant Search Results Dropdown - only when focused & open */}
                      {isCustomerDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto border border-ui-border-base rounded-xl divide-y divide-ui-border-base bg-ui-bg-base shadow-xl z-50">
                          {loadingCustomers ? (
                            <div className="p-3 text-center text-xs text-ui-fg-muted">
                              <ArrowPath className="animate-spin inline mr-1.5 w-3.5 h-3.5" /> Searching customers...
                            </div>
                          ) : filteredCustomers.length === 0 ? (
                            <div className="p-3 text-center text-xs text-ui-fg-muted space-y-1.5">
                              <div>No customers found matching "{customerSearchInput}".</div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomerMode("new");
                                  setCustomerName(customerSearchInput);
                                  setIsCustomerDropdownOpen(false);
                                }}
                                className="text-xs text-ui-fg-interactive hover:underline font-semibold cursor-pointer"
                              >
                                + Create "{customerSearchInput}" as new customer
                              </button>
                            </div>
                          ) : (
                            filteredCustomers.map((cust) => {
                              const fullName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim() || "Customer";
                              return (
                                <button
                                  key={cust.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCustomerId(cust.id);
                                    setCustomerName(fullName === "Customer" ? cust.email : fullName);
                                    setCustomerEmail(cust.email || "");
                                    setCustomerPhone(cust.phone || "");
                                    setIsCustomerDropdownOpen(false);
                                  }}
                                  className="w-full p-2.5 text-left hover:bg-ui-bg-subtle-hover transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                  <div>
                                    <span className="font-semibold text-xs text-ui-fg-base group-hover:text-ui-fg-interactive block">
                                      {fullName}
                                    </span>
                                    <span className="text-[11px] text-ui-fg-muted">
                                      {cust.email || "No email"} {cust.phone ? `• ${cust.phone}` : ""}
                                    </span>
                                  </div>
                                  <span className="text-xs text-ui-fg-muted group-hover:text-ui-fg-interactive font-medium">
                                    Select ➔
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: New Customer / Lead */}
              {customerMode === "new" && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-ui-fg-base mb-1">Customer Full Name *</label>
                    <Input
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-ui-fg-base mb-1">Email</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ui-fg-base mb-1">Phone</label>
                      <Input
                        placeholder="(555) 000-0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-ui-fg-subtle pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCreateInMedusa}
                      onChange={(e) => setAutoCreateInMedusa(e.target.checked)}
                      className="rounded accent-ui-fg-interactive"
                    />
                    <span>Automatically create new customer profile in Medusa</span>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ui-fg-base mb-1">Notes / Special Instructions</label>
              <textarea
                rows={3}
                placeholder="e.g. Quoted with 0.5ct VS2 diamond; valid for 48 hours."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-hidden focus:border-ui-border-interactive transition-all"
              />
            </div>

            <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ui-fg-subtle font-medium">Total Quoted Price:</span>
                <span className={`font-extrabold text-base ${calculationSummary.final_offered_price > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ui-fg-muted"}`}>
                  ${calculationSummary.final_offered_price.toFixed(2)}
                </span>
              </div>
              {calculationSummary.final_offered_price <= 0 && (
                <div className="text-[11px] text-ui-fg-error font-medium bg-rose-500/10 border border-rose-500/20 p-2 rounded-md">
                  ⚠️ Quote total must be greater than $0.00. Please enter item details before saving.
                </div>
              )}
              <div className="flex justify-between text-ui-fg-muted pt-1 border-t border-ui-border-base">
                <span>Gold Spot Reference:</span>
                <span className="font-mono">${spotRates.gold}/oz</span>
              </div>
              <div className="flex justify-between text-ui-fg-muted">
                <span>Margin Applied:</span>
                <span className="font-semibold">{profitMargin}%</span>
              </div>
            </div>
          </Drawer.Body>

          <Drawer.Footer className="shrink-0 border-t border-ui-border-base">
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="small" onClick={() => setIsSaveDrawerOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleSaveQuote}
                disabled={savingQuote || calculationSummary.final_offered_price <= 0}
              >
                {savingQuote ? "Saving..." : "Save Quote"}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>

      {/* Medusa FocusModal for Recalculate Quote */}
      <FocusModal open={isRecalcModalOpen} onOpenChange={setIsRecalcModalOpen}>
        {recalcQuote && recalcSimulation && (
          <FocusModal.Content>
            <FocusModal.Header>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <FocusModal.Title className="text-sm font-semibold text-ui-fg-base">
                    Re-calculate Quote Price
                  </FocusModal.Title>
                  <Badge color="orange" size="xsmall">
                    Buying Jewelry
                  </Badge>
                </div>
                <div className="flex items-center gap-x-2">
                  <Button variant="secondary" size="small" onClick={() => setIsRecalcModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleRecalculateQuote}
                    disabled={recalculating}
                  >
                    {recalculating ? "Saving Revision..." : "Save Revision"}
                  </Button>
                </div>
              </div>
            </FocusModal.Header>

            <FocusModal.Body className="flex flex-col items-center overflow-y-auto p-4 sm:p-8 lg:p-10">
              <div className="flex w-full max-w-3xl flex-col gap-y-5">
                {/* Header Information */}
                <div>
                  <Heading level="h2" className="text-base sm:text-lg font-bold text-ui-fg-base">
                    Simulate & Update Pricing
                  </Heading>
                  <Text className="text-xs text-ui-fg-subtle mt-0.5">
                    Simulate live benchmark precious metal rates and profit margins for <strong>{recalcQuote.title}</strong> ({recalcQuote.customer_name}).
                  </Text>
                </div>

                {/* 1. Price Comparison Hero Card */}
                <Container className="p-5 shadow-xs border border-ui-border-base space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
                    <span className="text-xs font-semibold text-ui-fg-base uppercase tracking-wider">
                      Price Evaluation & Impact Preview
                    </span>
                    <Badge color="green" size="xsmall">Live Real-Time Impact</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    {/* Previous Price */}
                    <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base text-center space-y-1">
                      <span className="text-[11px] text-ui-fg-subtle block font-medium">Previous Quoted Price</span>
                      <span className="text-xl font-bold text-ui-fg-base block">
                        ${recalcSimulation.previousPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-ui-fg-muted block">
                        @ ${(recalcQuote.spot_prices_snapshot?.gold || 0).toFixed(0)}/oz Gold
                      </span>
                    </div>

                    {/* Price Difference Indicator */}
                    <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                      <span className="text-[11px] font-medium text-ui-fg-subtle">
                        {recalcSimulation.priceDelta >= 0 ? "➔ Price Increase" : "➔ Price Decrease"}
                      </span>
                      <Badge
                        size="base"
                        color={
                          recalcSimulation.priceDelta > 0
                            ? "green"
                            : recalcSimulation.priceDelta < 0
                              ? "red"
                              : "grey"
                        }
                        className="font-bold text-xs px-3 py-1 shadow-xs"
                      >
                        {recalcSimulation.priceDelta >= 0 ? "+" : ""}
                        ${recalcSimulation.priceDelta.toFixed(2)} (
                        {recalcSimulation.deltaPercent >= 0 ? "+" : ""}
                        {recalcSimulation.deltaPercent.toFixed(2)}%)
                      </Badge>
                      <span className="text-[10px] text-ui-fg-muted">
                        Simulated on new spot & margin
                      </span>
                    </div>

                    {/* New Price */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 ring-1 ring-emerald-500/20">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                        New Simulated Price
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        ${recalcSimulation.finalOfferedPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
                        @ ${recalcSpotRates.gold.toFixed(0)}/oz Gold
                      </span>
                    </div>
                  </div>
                </Container>

                {/* 2. Metal Benchmark Rates Adjustment */}
                <Container className="p-5 shadow-xs border border-ui-border-base space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ui-border-base pb-3">
                    <div>
                      <Heading level="h3" className="text-sm font-semibold text-ui-fg-base">
                        Precious Metal Benchmark Rates ($/ozt)
                      </Heading>
                      <Text className="text-xs text-ui-fg-subtle mt-0.5">
                        Simulate counter-offers or adjust for live precious metal spot rate fluctuations.
                      </Text>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setRecalcSpotRates({
                          gold: Number(Number(spotRates.gold || 2685.0).toFixed(2)),
                          silver: Number(Number(spotRates.silver || 31.5).toFixed(2)),
                          platinum: Number(Number(spotRates.platinum || 975.0).toFixed(2)),
                          palladium: Number(Number(spotRates.palladium || 990.0).toFixed(2)),
                        });
                      }}
                      className="text-xs shrink-0 self-start sm:self-auto"
                    >
                      <ArrowPath className="mr-1.5 w-3.5 h-3.5" /> Reset to Current Rates
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Gold */}
                    <div className="p-3 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-500">Gold (Au)</span>
                        <span className="text-[10px] text-ui-fg-muted font-mono font-medium">
                          ${(Number(recalcSpotRates.gold || 0) / 20).toFixed(2)}/dwt
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-ui-border-base bg-ui-bg-base px-2.5 py-1.5 focus-within:border-ui-border-interactive focus-within:ring-1 focus-within:ring-ui-border-interactive transition-all">
                        <span className="text-xs font-semibold text-ui-fg-muted mr-1.5">$</span>
                        <input
                          type="number"
                          step="0.1"
                          value={recalcSpotRates.gold}
                          onChange={(e) =>
                            setRecalcSpotRates((prev) => ({
                              ...prev,
                              gold: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-ui-fg-base focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Silver */}
                    <div className="p-3 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Silver (Ag)</span>
                        <span className="text-[10px] text-ui-fg-muted font-mono font-medium">
                          ${(Number(recalcSpotRates.silver || 0) / 31.1035).toFixed(2)}/g
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-ui-border-base bg-ui-bg-base px-2.5 py-1.5 focus-within:border-ui-border-interactive focus-within:ring-1 focus-within:ring-ui-border-interactive transition-all">
                        <span className="text-xs font-semibold text-ui-fg-muted mr-1.5">$</span>
                        <input
                          type="number"
                          step="0.05"
                          value={recalcSpotRates.silver}
                          onChange={(e) =>
                            setRecalcSpotRates((prev) => ({
                              ...prev,
                              silver: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-ui-fg-base focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Platinum */}
                    <div className="p-3 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-500">Platinum (Pt)</span>
                        <span className="text-[10px] text-ui-fg-muted font-mono font-medium">
                          ${(Number(recalcSpotRates.platinum || 0) / 20).toFixed(2)}/dwt
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-ui-border-base bg-ui-bg-base px-2.5 py-1.5 focus-within:border-ui-border-interactive focus-within:ring-1 focus-within:ring-ui-border-interactive transition-all">
                        <span className="text-xs font-semibold text-ui-fg-muted mr-1.5">$</span>
                        <input
                          type="number"
                          step="0.1"
                          value={recalcSpotRates.platinum}
                          onChange={(e) =>
                            setRecalcSpotRates((prev) => ({
                              ...prev,
                              platinum: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-ui-fg-base focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Palladium */}
                    <div className="p-3 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">Palladium (Pd)</span>
                        <span className="text-[10px] text-ui-fg-muted font-mono font-medium">
                          ${(Number(recalcSpotRates.palladium || 0) / 20).toFixed(2)}/dwt
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-ui-border-base bg-ui-bg-base px-2.5 py-1.5 focus-within:border-ui-border-interactive focus-within:ring-1 focus-within:ring-ui-border-interactive transition-all">
                        <span className="text-xs font-semibold text-ui-fg-muted mr-1.5">$</span>
                        <input
                          type="number"
                          step="0.1"
                          value={recalcSpotRates.palladium}
                          onChange={(e) =>
                            setRecalcSpotRates((prev) => ({
                              ...prev,
                              palladium: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-ui-fg-base focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </Container>

                {/* 3. Items & Individual Margins */}
                <Container className="p-5 shadow-xs border border-ui-border-base space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
                    <div>
                      <Heading level="h3" className="text-sm font-semibold text-ui-fg-base">
                        Line Items, Specifications & Margins ({recalcItems.length})
                      </Heading>
                      <Text className="text-xs text-ui-fg-subtle mt-0.5">
                        Adjust categories, metals, purity, wholesale cost, and individual margins for each line item.
                      </Text>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setRecalcItems((prev) => [...prev, defaultItem()])}
                      className="text-xs"
                    >
                      <Plus className="mr-1 w-3.5 h-3.5" /> Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recalcItems.map((item, idx) => {
                      const isRecalcScrapMetal = isScrapMetalItem(item.item_title);
                      return (
                      <div key={item.id || idx} className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/50 space-y-3">
                        <div className="flex items-center justify-between border-b border-ui-border-base pb-2.5">
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <Badge color="blue" size="small">Item #{idx + 1}</Badge>
                            <select
                              value={item.item_title}
                              onChange={(e) => updateRecalcItem(idx, "item_title", e.target.value)}
                              className="text-xs font-semibold p-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base outline-none cursor-pointer"
                            >
                              {ITEM_CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                              ))}
                            </select>
                          </div>
                          {recalcItems.length > 1 && (
                            <IconButton
                              variant="transparent"
                              size="small"
                              onClick={() => setRecalcItems((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-ui-fg-muted hover:text-ui-fg-error"
                            >
                              <Trash />
                            </IconButton>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">
                            Description
                          </label>
                          <Input
                            type="text"
                            placeholder="Item description or notes..."
                            value={item.description}
                            onChange={(e) => updateRecalcItem(idx, "description", e.target.value)}
                            className="text-xs"
                          />
                        </div>

                        {isRecalcScrapMetal ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                              {/* Metal Type */}
                              <div>
                                <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">Metal</label>
                                <select
                                  value={item.metal_type}
                                  onChange={(e) => updateRecalcItem(idx, "metal_type", e.target.value)}
                                  className="w-full text-xs p-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                                >
                                  {METAL_OPTIONS.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Purity (%) */}
                              <div>
                                <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">Purity (%)</label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={item.purity_percent}
                                    onChange={(e) => updateRecalcItem(idx, "purity_percent", e.target.value)}
                                    className="text-xs font-medium pr-7"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                                    %
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(STANDARD_PURITY_PRESETS[item.metal_type] || []).map((preset) => (
                                    <button
                                      key={preset.label}
                                      type="button"
                                      onClick={() => updateRecalcItem(idx, "purity_percent", preset.percent)}
                                      className={`px-1 py-0.5 rounded text-[9px] border transition-all ${Number(item.purity_percent) === preset.percent
                                        ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold"
                                        : "bg-ui-bg-base text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base"
                                        }`}
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Weight */}
                              <div>
                                <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">Weight</label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.weight}
                                  onChange={(e) => updateRecalcItem(idx, "weight", e.target.value)}
                                  className="text-xs font-medium"
                                />
                              </div>

                              {/* Unit */}
                              <div>
                                <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">Unit</label>
                                <select
                                  value={item.unit}
                                  onChange={(e) => updateRecalcItem(idx, "unit", e.target.value)}
                                  className="w-full text-xs p-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <option key={u.value} value={u.value}>{u.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Margin (%) for Scrap Metal */}
                            <div className="pt-2.5 border-t border-ui-border-base max-w-xs">
                              <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">
                                Margin (%)
                              </label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="1"
                                  min="0"
                                  max="100"
                                  value={item.payout_ratio}
                                  onChange={(e) => updateRecalcItem(idx, "payout_ratio", e.target.value)}
                                  className="text-xs font-medium pr-7"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                                  %
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {[70, 75, 80, 85, 90, 95].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => updateRecalcItem(idx, "payout_ratio", preset)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] border transition-all ${Number(item.payout_ratio) === preset
                                      ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold shadow-xs"
                                      : "bg-ui-bg-base text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base"
                                      }`}
                                  >
                                    {preset}%
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Estimated Wholesale Cost & Individual Item Margin (%) for non-scrap items */
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">
                                Estimated Wholesale Cost ($)
                              </label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  step="10"
                                  min="0"
                                  value={item.estimated_wholesale_cost}
                                  onChange={(e) => updateRecalcItem(idx, "estimated_wholesale_cost", e.target.value)}
                                  className="text-xs font-medium pl-6"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-ui-fg-subtle mb-1">
                                Margin (%)
                              </label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="1"
                                  min="0"
                                  max="100"
                                  value={item.payout_ratio}
                                  onChange={(e) => updateRecalcItem(idx, "payout_ratio", e.target.value)}
                                  className="text-xs font-medium pr-7"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-fg-muted pointer-events-none">
                                  %
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {[70, 75, 80, 85, 90, 95].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => updateRecalcItem(idx, "payout_ratio", preset)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] border transition-all ${Number(item.payout_ratio) === preset
                                      ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-bold shadow-xs"
                                      : "bg-ui-bg-base text-ui-fg-muted border-ui-border-base hover:text-ui-fg-base"
                                      }`}
                                  >
                                    {preset}%
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                    })}
                  </div>
                </Container>

                {/* 4. Revision Audit Note */}
                <Container className="p-5 shadow-xs border border-ui-border-base space-y-2">
                  <label className="block text-xs font-semibold text-ui-fg-base">
                    Revision Audit Note / Reason
                  </label>
                  <Input
                    placeholder={`e.g. Gold spot rate adjusted to $${recalcSpotRates.gold}/oz, updated customer offer.`}
                    value={recalcNotes}
                    onChange={(e) => setRecalcNotes(e.target.value)}
                    className="text-xs"
                  />
                  <span className="text-[11px] text-ui-fg-muted block">
                    Saving will create Revision #{(recalcQuote.revisions?.length || 1) + 1} with a permanent audit snapshot.
                  </span>
                </Container>
              </div>
            </FocusModal.Body>
          </FocusModal.Content>
        )}
      </FocusModal>

      {/* Quote History & Breakdown Drawer */}
      <Drawer open={isHistoryDrawerOpen} onOpenChange={setIsHistoryDrawerOpen}>
        <Drawer.Content className="max-w-xl max-h-screen flex flex-col overflow-hidden">
          <Drawer.Header className="shrink-0">
            <Drawer.Title className="text-lg font-bold">
              {selectedQuote?.title}
            </Drawer.Title>
            <Drawer.Description className="text-xs text-ui-fg-subtle">
              Customer: {selectedQuote?.customer_name} ({selectedQuote?.customer_email || "No email"})
            </Drawer.Description>
          </Drawer.Header>

          <Drawer.Body className="space-y-6 py-4 flex-1 overflow-y-auto min-h-0">
            {/* Current Quote Status & Price Card */}
            <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Text className="text-xs text-ui-fg-subtle">Current Quoted Price</Text>
                  <Badge size="xsmall" color="orange">
                    Buying Jewelry
                  </Badge>
                </div>
                <Text className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${((Number(selectedQuote?.final_offered_price) || 0) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-ui-fg-subtle">Status:</label>
                <select
                  value={selectedQuote?.status || "offered"}
                  onChange={(e) => {
                    handleUpdateStatus(selectedQuote.id, e.target.value);
                    setSelectedQuote({ ...selectedQuote, status: e.target.value });
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                >
                  <option value="draft">Draft</option>
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Quoted Items & Specifications */}
            {(() => {
              const quoteItems: any[] = (() => {
                if (!selectedQuote?.items) return [];
                const items = selectedQuote.items;
                if (Array.isArray(items)) return items;
                if (typeof items === "object") {
                  if (Array.isArray(items.raw_items)) return items.raw_items;
                  if (Array.isArray(items.breakdown_items)) return items.breakdown_items;
                  return Object.values(items).filter((v: any) => v && typeof v === "object");
                }
                if (typeof items === "string") {
                  try {
                    const parsed = JSON.parse(items);
                    if (Array.isArray(parsed)) return parsed;
                    if (parsed && Array.isArray(parsed.raw_items)) return parsed.raw_items;
                    if (parsed && Array.isArray(parsed.breakdown_items)) return parsed.breakdown_items;
                    if (parsed && typeof parsed === "object") return Object.values(parsed);
                  } catch {
                    return [];
                  }
                }
                return [];
              })();

              return (
                <div className="space-y-3">
                  <Heading level="h3" className="text-sm font-bold flex items-center justify-between text-ui-fg-base">
                    <span>📦 Quoted Jewelry Items & Specifications ({quoteItems.length})</span>
                    <span className="text-xs font-normal text-ui-fg-muted">Lot Details</span>
                  </Heading>

                  {quoteItems.length === 0 ? (
                    <div className="p-3 text-center text-xs text-ui-fg-muted border border-dashed rounded-lg">
                      No individual line items detailed for this quote.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {quoteItems.map((item: any, idx: number) => {
                        const itemWeight = item.weight !== undefined ? item.weight : item.weight_input || 0;
                        const itemUnit = item.unit || "dwt";
                        const weightGrams = itemUnit === "dwt"
                          ? (Number(itemWeight) * 1.55517).toFixed(2)
                          : itemUnit === "ozt"
                            ? (Number(itemWeight) * 31.1035).toFixed(2)
                            : Number(itemWeight).toFixed(2);

                        const purityDisplay = item.purity_percent !== undefined && item.purity_percent !== null
                          ? `${Number(item.purity_percent).toFixed(2)}%`
                          : (item.purity_karat || "-");
                        const wholesaleCost = Number(item.estimated_wholesale_cost || 0);
                        const itemMargin = item.payout_ratio !== undefined && item.payout_ratio !== null
                          ? `${item.payout_ratio}%`
                          : `${selectedQuote?.profit_margin_percent || 85}%`;

                        const isScrap = isScrapMetalItem(item.item_title);

                        return (
                          <div key={idx} className="p-3.5 rounded-lg border border-ui-border-base bg-ui-bg-base space-y-2 shadow-xs">
                            <div className="flex items-center justify-between border-b border-ui-border-base pb-2">
                              <div className="flex items-center gap-2">
                                <Badge color="blue" size="xsmall">Item #{idx + 1}</Badge>
                                <Text className="text-xs font-bold text-ui-fg-base">
                                  {item.item_title || `Item #${idx + 1}`}
                                </Text>
                              </div>
                              <Badge color="grey" size="xsmall">
                                {isScrap ? item.metal_type?.toUpperCase() : (item.item_title || "ITEM")}
                              </Badge>
                            </div>

                            {item.description && (
                              <Text className="text-xs text-ui-fg-subtle">
                                {item.description}
                              </Text>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                              {isScrap ? (
                                <>
                                  <div>
                                    <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Weight</span>
                                    <span className="font-semibold text-ui-fg-base">
                                      {itemWeight} {itemUnit} ({weightGrams}g)
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Purity (%)</span>
                                    <span className="font-semibold text-ui-fg-base">
                                      {purityDisplay}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Wholesale Cost</span>
                                  <span className="font-semibold text-ui-fg-base">
                                    ${wholesaleCost.toFixed(2)}
                                  </span>
                                </div>
                              )}

                              <div>
                                <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Margin</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                  {itemMargin}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Financial Cost Breakdown Card */}
            <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle space-y-2 text-xs">
              <Heading level="h3" className="text-xs font-bold uppercase tracking-wider text-ui-fg-muted pb-1 border-b border-ui-border-base">
                Cost & Financial Breakdown
              </Heading>

              <div className="flex justify-between text-ui-fg-subtle pt-1">
                <span>Base Metal Melt Value:</span>
                <span className="font-semibold text-ui-fg-base">
                  ${((Number(selectedQuote?.base_metal_cost) || 0) / 100).toFixed(2)}
                </span>
              </div>

              {Number(selectedQuote?.stone_cost || 0) > 0 && (
                <div className="flex justify-between text-ui-fg-subtle">
                  <span>Estimated Wholesale Cost:</span>
                  <span className="font-semibold text-ui-fg-base">
                    ${((Number(selectedQuote?.stone_cost) || 0) / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-ui-fg-subtle">
                <span>Margin Quoted (Effective):</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {selectedQuote?.profit_margin_percent}%
                </span>
              </div>

              <div className="flex justify-between font-bold text-base text-emerald-600 dark:text-emerald-400 border-t border-ui-border-base pt-2">
                <span>Buying Quote (USD):</span>
                <span>${((Number(selectedQuote?.final_offered_price) || 0) / 100).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-ui-fg-muted pt-0.5">
                <span>Jeweler Profit:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-500">
                  +${((Number(selectedQuote?.profit_amount) || 0) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Revision Timeline */}
            <div>
              <Heading level="h3" className="text-sm font-bold mb-3 flex items-center gap-2 text-ui-fg-base">
                <Clock className="text-ui-fg-interactive" /> Price History & Revision Timeline
              </Heading>

              <div className="space-y-3">
                {(selectedQuote?.revisions || []).map((rev: any, idx: number) => {
                  const revPrice = (Number(rev.final_offered_price) || 0) / 100;
                  const delta = (Number(rev.price_delta) || 0) / 100;
                  const goldAtRev = rev.spot_prices_snapshot?.gold || 0;

                  return (
                    <div key={rev.id || idx} className="p-3.5 rounded-lg border border-ui-border-base bg-ui-bg-base relative shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge color="grey" size="xsmall">
                            Revision #{rev.revision_number || idx + 1}
                          </Badge>
                          <span className="font-semibold text-ui-fg-base capitalize">
                            {(rev.trigger_reason || "quote").replace(/_/g, " ")}
                          </span>
                        </div>
                        <span className="text-[10px] text-ui-fg-muted">
                          {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-ui-fg-subtle">Gold Spot: </span>
                          <span className="font-mono font-semibold">${goldAtRev.toFixed(2)}/oz</span>
                          <span className="mx-2 text-ui-fg-muted">•</span>
                          <span className="text-ui-fg-subtle">Margin: </span>
                          <span className="font-semibold">{rev.profit_margin_percent}%</span>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                            ${revPrice.toFixed(2)}
                          </span>
                          {delta !== 0 && (
                            <span className={`block text-[10px] font-semibold ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {delta > 0 ? `+` : ``}${delta.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {rev.notes && (
                        <Text className="text-[11px] text-ui-fg-subtle mt-1.5 border-t border-ui-border-base pt-1 italic">
                          "{rev.notes}"
                        </Text>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Drawer.Body>

          <Drawer.Footer className="shrink-0 border-t border-ui-border-base">
            <Button variant="secondary" size="small" onClick={() => setIsHistoryDrawerOpen(false)}>
              Close
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>

      <Toaster />
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Gold Price Calculator",
  icon: SparklesSolid,
});

export default PriceCalculatorPage;
