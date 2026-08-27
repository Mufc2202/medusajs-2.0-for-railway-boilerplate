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

interface CalculatorItem {
  id: string;
  item_title: string;
  metal_type: "gold" | "silver" | "platinum" | "palladium";
  purity_karat: string;
  weight: number | string;
  unit: "dwt" | "g" | "ozt" | "tola" | "kg";
  labor_charge_per_unit: number | string;
  labor_charge_flat: number | string;
  wastage_percent: number | string;
  diamond_carats: number | string;
  diamond_points: number | string;
  diamond_price_per_carat: number | string;
  stone_notes: string;
}

const defaultItem: () => CalculatorItem = () => ({
  id: Math.random().toString(36).substring(2, 9),
  item_title: "",
  metal_type: "gold",
  purity_karat: "14k",
  weight: "",
  unit: "dwt",
  labor_charge_per_unit: "",
  labor_charge_flat: "",
  wastage_percent: "",
  diamond_carats: "",
  diamond_points: "",
  diamond_price_per_carat: "",
  stone_notes: "",
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
  const [mode, setMode] = useState<"retail_selling" | "scrap_buying">("retail_selling");
  const [items, setItems] = useState<CalculatorItem[]>([defaultItem()]);
  const [profitMargin, setProfitMargin] = useState<number>(20); // 20% default retail margin

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
  const [recalcSpotRates, setRecalcSpotRates] = useState<{
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  }>({ gold: 2685, silver: 31.5, platinum: 975, palladium: 990 });
  const [recalcMargin, setRecalcMargin] = useState<number>(20);
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
    setRecalcMargin(q.profit_margin_percent || 20);
    setRecalcNotes("");
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
    let totalWastageCost = 0;
    let totalLaborCost = 0;
    let totalStoneCost = 0;

    const itemResults = items.map((item) => {
      // 1. Weight conversions
      const weightNum = Number(item.weight) || 0;
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

      // 2. Purity factor
      const metalPurities = PURITY_OPTIONS[item.metal_type] || [];
      const purityMatch = metalPurities.find((p) => p.value === item.purity_karat);
      const purityFactor = purityMatch ? purityMatch.factor : 1.0;

      const pureOzt = ozt * purityFactor;
      const pureGrams = grams * purityFactor;
      const pureDwt = dwt * purityFactor;

      const spotPricePerOzt = spotRates[item.metal_type] || 0;
      const baseMetalCost = pureOzt * spotPricePerOzt;

      const wastageNum = Number(item.wastage_percent) || 0;
      const wastageCost = baseMetalCost * (wastageNum / 100.0);

      const laborFlatNum = Number(item.labor_charge_flat) || 0;
      const laborPerUnitNum = Number(item.labor_charge_per_unit) || 0;
      let laborCost = laborFlatNum;
      if (laborPerUnitNum > 0) {
        if (item.unit === "dwt") {
          laborCost += dwt * laborPerUnitNum;
        } else {
          laborCost += grams * laborPerUnitNum;
        }
      }

      let stoneCarats = Number(item.diamond_carats) || 0;
      const diamondPoints = Number(item.diamond_points) || 0;
      if (diamondPoints > 0) {
        stoneCarats += diamondPoints / 100.0;
      }
      const stonePricePerCarat = Number(item.diamond_price_per_carat) || 0;
      const stoneCost = stoneCarats * stonePricePerCarat;

      const itemCost = baseMetalCost + wastageCost + laborCost + stoneCost;

      totalPureOzt += pureOzt;
      totalPureGrams += pureGrams;
      totalPureDwt += pureDwt;
      totalBaseMetalCost += baseMetalCost;
      totalWastageCost += wastageCost;
      totalLaborCost += laborCost;
      totalStoneCost += stoneCost;

      return {
        ...item,
        ozt,
        grams,
        dwt,
        pureOzt,
        pureGrams,
        pureDwt,
        baseMetalCost,
        wastageCost,
        laborCost,
        stoneCost,
        itemCost,
      };
    });

    const totalCostPrice = totalBaseMetalCost + totalWastageCost + totalLaborCost + totalStoneCost;

    let profitAmount = 0;
    let finalOfferedPrice = 0;

    if (mode === "scrap_buying") {
      const payoutRatio = (profitMargin > 0 && profitMargin <= 100 ? profitMargin : 85) / 100.0;
      finalOfferedPrice = totalBaseMetalCost * payoutRatio;
      profitAmount = totalBaseMetalCost - finalOfferedPrice;
    } else {
      profitAmount = totalCostPrice * ((profitMargin || 0) / 100.0);
      finalOfferedPrice = totalCostPrice + profitAmount;
    }

    return {
      pure_metal_ozt: totalPureOzt,
      pure_metal_grams: totalPureGrams,
      pure_metal_dwt: totalPureDwt,
      base_metal_cost: totalBaseMetalCost,
      wastage_cost: totalWastageCost,
      labor_cost: totalLaborCost,
      stone_cost: totalStoneCost,
      total_cost_price: totalCostPrice,
      profit_margin_percent: profitMargin,
      profit_amount: profitAmount,
      final_offered_price: finalOfferedPrice,
      itemResults,
    };
  }, [items, spotRates, profitMargin, mode]);

  // Real-time recalculation simulation for a saved quote
  const recalcSimulation = useMemo(() => {
    if (!recalcQuote) return null;
    const rawItems = Array.isArray(recalcQuote.items)
      ? recalcQuote.items
      : (recalcQuote.items?.raw_items || []);
    if (!rawItems || rawItems.length === 0) return null;

    let totalPureOzt = 0;
    let totalBaseMetalCost = 0;
    let totalWastageCost = 0;
    let totalLaborCost = 0;
    let totalStoneCost = 0;

    rawItems.forEach((item: any) => {
      let grams = 0;
      const weight = Number(item.weight) || 0;
      switch (item.unit) {
        case "dwt": grams = weight * DWT_TO_GRAMS; break;
        case "g": grams = weight; break;
        case "ozt": grams = weight * TROY_OZ_TO_GRAMS; break;
        case "tola": grams = weight * 11.6638; break;
        case "kg": grams = weight * 1000.0; break;
        default: grams = weight;
      }
      const ozt = grams / TROY_OZ_TO_GRAMS;
      const dwt = ozt * TROY_OZ_TO_DWT;
      const metalPurities = PURITY_OPTIONS[item.metal_type] || [];
      const purityMatch = metalPurities.find((p) => p.value === item.purity_karat);
      const purityFactor = purityMatch ? purityMatch.factor : 1.0;
      const pureOzt = ozt * purityFactor;

      const spotPricePerOzt = Number((recalcSpotRates as any)[item.metal_type]) || 0;
      const baseMetalCost = pureOzt * spotPricePerOzt;
      const wastageCost = baseMetalCost * ((Number(item.wastage_percent) || 0) / 100.0);

      let laborCost = Number(item.labor_charge_flat) || 0;
      if (item.labor_charge_per_unit && Number(item.labor_charge_per_unit) > 0) {
        laborCost += (item.unit === "dwt" ? dwt : grams) * Number(item.labor_charge_per_unit);
      }

      let stoneCarats = Number(item.diamond_carats) || 0;
      if (item.diamond_points && Number(item.diamond_points) > 0) {
        stoneCarats += Number(item.diamond_points) / 100.0;
      }
      const stoneCost = stoneCarats * (Number(item.diamond_price_per_carat) || 0);

      totalPureOzt += pureOzt;
      totalBaseMetalCost += baseMetalCost;
      totalWastageCost += wastageCost;
      totalLaborCost += laborCost;
      totalStoneCost += stoneCost;
    });

    const totalCostPrice = totalBaseMetalCost + totalWastageCost + totalLaborCost + totalStoneCost;
    let finalOfferedPrice = 0;
    let profitAmount = 0;

    if (recalcQuote.calculation_mode === "scrap_buying") {
      const payoutRatio = (recalcMargin > 0 && recalcMargin <= 100 ? recalcMargin : 85) / 100.0;
      finalOfferedPrice = totalBaseMetalCost * payoutRatio;
      profitAmount = totalBaseMetalCost - finalOfferedPrice;
    } else {
      profitAmount = totalCostPrice * ((Number(recalcMargin) || 0) / 100.0);
      finalOfferedPrice = totalCostPrice + profitAmount;
    }

    const previousPrice = (Number(recalcQuote.final_offered_price) || 0) / 100;
    const priceDelta = finalOfferedPrice - previousPrice;
    const deltaPercent = previousPrice > 0 ? (priceDelta / previousPrice) * 100 : 0;

    return {
      totalPureOzt,
      baseMetalCost: totalBaseMetalCost,
      wastageCost: totalWastageCost,
      laborCost: totalLaborCost,
      stoneCost: totalStoneCost,
      totalCostPrice,
      profitAmount,
      finalOfferedPrice,
      previousPrice,
      priceDelta,
      deltaPercent,
    };
  }, [recalcQuote, recalcSpotRates, recalcMargin]);

  // Handle item changes
  const updateItem = (index: number, field: keyof CalculatorItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      // When metal type changes, update purity_karat to first option
      if (field === "metal_type") {
        copy[index].purity_karat = PURITY_OPTIONS[value as string]?.[0]?.value || "24k";
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

    // 3. Validate Items: check that every item has valid positive weight
    for (let idx = 0; idx < items.length; idx++) {
      const it = items[idx];
      const weightNum = Number(it.weight);
      if (
        it.weight === "" ||
        it.weight === null ||
        it.weight === undefined ||
        isNaN(weightNum) ||
        weightNum <= 0
      ) {
        toast.error("Invalid Item Weight", {
          description: `Please enter a valid weight (> 0) for Item #${idx + 1}.`,
        });
        return;
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
          calculation_mode: mode,
          items: items.map((i) => ({
            metal_type: i.metal_type,
            purity_karat: i.purity_karat,
            weight: Number(i.weight),
            unit: i.unit,
            labor_charge_per_unit: i.labor_charge_per_unit !== "" ? Number(i.labor_charge_per_unit) : 0,
            labor_charge_flat: i.labor_charge_flat !== "" ? Number(i.labor_charge_flat) : 0,
            wastage_percent: i.wastage_percent !== "" ? Number(i.wastage_percent) : 0,
            diamond_carats: i.diamond_carats !== "" ? Number(i.diamond_carats) : 0,
            diamond_points: i.diamond_points !== "" ? Number(i.diamond_points) : 0,
            diamond_price_per_carat: i.diamond_price_per_carat !== "" ? Number(i.diamond_price_per_carat) : 0,
            stone_notes: i.stone_notes || "",
            item_title: i.item_title?.trim() || `${i.purity_karat.toUpperCase()} ${i.metal_type.toUpperCase()} Piece`,
          })),
          spot_prices: spotRates,
          profit_margin_percent: Number(profitMargin),
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
        setProfitMargin(20);
        setMode("retail_selling");

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
      const res = await fetch(`/admin/jewelry-quotes/${recalcQuote.id}/recalculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spot_prices: recalcSpotRates,
          profit_margin_percent: Number(recalcMargin),
          trigger_reason: "spot_price_update",
          notes: recalcNotes || `Recalculated with Gold $${recalcSpotRates.gold}/oz, Margin ${recalcMargin}%`,
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
              Jewelry & Precious Metals Pricing calculator
            </Heading>
            <Badge color={isLiveRates ? "green" : "blue"} size="small">
              {isLiveRates ? "Live Market Active" : "US Benchmark Standards"}
            </Badge>
          </div>
          <Text className="text-ui-fg-subtle text-xs sm:text-sm mt-1">
            Real-time precious metal market benchmarks, DWT & Gram bench precision, Plumb gold karat standards, diamond costing, and customer quote revision history.
          </Text>
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
            className={`pb-3 pt-1 text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap outline-none ${
              activeTab === "calculator"
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
            className={`pb-3 pt-1 text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap outline-none ${
              activeTab === "quotes"
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
            {/* Mode Switch Card */}
            <Container className="p-4 sm:p-5 shadow-xs border border-ui-border-base space-y-3">
              <div>
                <Heading level="h2" className="text-sm sm:text-base font-semibold text-ui-fg-base">
                  Calculation Mode
                </Heading>
                <Text className="text-xs text-ui-fg-subtle mt-0.5">
                  Select your transaction type to automatically configure pricing formulas and margins.
                </Text>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Mode 1: Custom Jewelry Sale */}
                <div
                  onClick={() => {
                    setMode("retail_selling");
                    setProfitMargin(20);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    mode === "retail_selling"
                      ? "bg-ui-bg-base border-ui-border-interactive ring-1 ring-ui-border-interactive shadow-xs"
                      : "bg-ui-bg-subtle/60 border-ui-border-base hover:border-ui-border-strong hover:bg-ui-bg-subtle"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        mode === "retail_selling"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-ui-bg-base text-ui-fg-muted"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          mode === "retail_selling" ? "text-ui-fg-base" : "text-ui-fg-subtle"
                        }`}
                      >
                        Custom Jewelry Sale
                      </span>
                      <span className="text-[11px] text-ui-fg-muted block mt-0.5">
                        Base Metals + Labor + Benchwork + Profit %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mode 2: Scrap Metal Buy-Back */}
                <div
                  onClick={() => {
                    setMode("scrap_buying");
                    setProfitMargin(85);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    mode === "scrap_buying"
                      ? "bg-ui-bg-base border-ui-border-interactive ring-1 ring-ui-border-interactive shadow-xs"
                      : "bg-ui-bg-subtle/60 border-ui-border-base hover:border-ui-border-strong hover:bg-ui-bg-subtle"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        mode === "scrap_buying"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-ui-bg-base text-ui-fg-muted"
                      }`}
                    >
                      <CurrencyDollar className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          mode === "scrap_buying" ? "text-ui-fg-base" : "text-ui-fg-subtle"
                        }`}
                      >
                        Scrap Metal Buy-Back
                      </span>
                      <span className="text-[11px] text-ui-fg-muted block mt-0.5">
                        Melt Valuation × Refiner Payout %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Container>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item, idx) => (
                <Container key={item.id} className="p-4 sm:p-5 shadow-xs border border-ui-border-base relative space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <Badge color="blue" size="small">Item #{idx + 1}</Badge>
                      <input
                        type="text"
                        value={item.item_title}
                        onChange={(e) => updateItem(idx, "item_title", e.target.value)}
                        placeholder="e.g. 14K Diamond Engagement Ring"
                        className="text-xs sm:text-sm font-semibold border-b border-transparent hover:border-ui-border-base focus:border-ui-border-interactive px-1 py-0.5 bg-transparent outline-none flex-1"
                      />
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

                    {/* Karat / Purity */}
                    <div>
                      <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Purity / Karat</label>
                      <select
                        value={item.purity_karat}
                        onChange={(e) => updateItem(idx, "purity_karat", e.target.value)}
                        className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
                      >
                        {(PURITY_OPTIONS[item.metal_type] || []).map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
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

                  {/* Benchwork / Casting / Labor Additions (Retail Mode) */}
                  {mode === "retail_selling" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-ui-border-base">
                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Casting Wastage (%)</label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.wastage_percent}
                          onChange={(e) => updateItem(idx, "wastage_percent", e.target.value)}
                          placeholder="0"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">
                          Labor (${item.unit === "dwt" ? "/dwt" : "/g"})
                        </label>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          value={item.labor_charge_per_unit}
                          onChange={(e) => updateItem(idx, "labor_charge_per_unit", e.target.value)}
                          placeholder="0"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Flat Bench Fee ($)</label>
                        <Input
                          type="number"
                          step="5"
                          min="0"
                          value={item.labor_charge_flat}
                          onChange={(e) => updateItem(idx, "labor_charge_flat", e.target.value)}
                          placeholder="0"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ui-fg-subtle mb-1">Diamond / Gemstones</label>
                        <div className="flex gap-1.5">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.diamond_carats}
                            onChange={(e) => updateItem(idx, "diamond_carats", e.target.value)}
                            placeholder="0.00 Ct"
                            className="w-1/2 text-xs"
                            title="Carats"
                          />
                          <Input
                            type="number"
                            step="50"
                            min="0"
                            value={item.diamond_price_per_carat}
                            onChange={(e) => updateItem(idx, "diamond_price_per_carat", e.target.value)}
                            placeholder="$/Ct"
                            className="w-1/2 text-xs"
                            title="Price per Carat"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Container>
              ))}

              <Button variant="secondary" size="small" onClick={addItem} className="w-full border-dashed">
                <Plus className="mr-1" /> Add Another Item / Lot to Calculation
              </Button>
            </div>

            {/* Profit Margin / Payout Control Card */}
            <Container className="p-4 sm:p-5 shadow-xs border border-ui-border-base space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Heading level="h3" className="text-sm font-semibold text-ui-fg-base">
                    {mode === "retail_selling" ? "Jeweler Profit Margin / Markup (%)" : "Scrap Metal Buy-Back Payout Ratio (%)"}
                  </Heading>
                  <Text className="text-xs text-ui-fg-subtle">
                    {mode === "retail_selling"
                      ? "Markup applied over metal melt, casting wastage, labor & gemstones."
                      : "Percentage of live melt value paid to customer for scrap metal trade-in."}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={mode === "retail_selling" ? "0" : "50"}
                    max={mode === "retail_selling" ? "200" : "100"}
                    step="1"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                    className="w-28 sm:w-36 accent-ui-fg-interactive cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="500"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                      className="w-16 text-center font-bold text-xs"
                    />
                    <span className="text-xs font-semibold text-ui-fg-subtle">%</span>
                  </div>
                </div>
              </div>

              {mode === "retail_selling" && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ui-border-base text-xs items-center">
                  <span className="text-[11px] text-ui-fg-muted mr-1">Quick Presets:</span>
                  {[10, 15, 20, 25, 35, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setProfitMargin(preset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                        profitMargin === preset
                          ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent"
                          : "bg-ui-bg-base text-ui-fg-subtle border-ui-border-base hover:text-ui-fg-base"
                      }`}
                    >
                      {preset}% {preset === 100 && "(Keystone)"}
                    </button>
                  ))}
                </div>
              )}
            </Container>
          </div>

          {/* Right 4 Cols: Live Price Breakdown & Sticky Summary */}
          <div className="lg:col-span-4">
            <Container className="p-5 shadow-xs border border-ui-border-base bg-ui-bg-subtle sticky top-6 space-y-4">
              <div className="pb-3 border-b border-ui-border-base flex items-center justify-between">
                <Heading level="h2" className="text-base font-bold text-ui-fg-base">Calculation Summary</Heading>
                <Badge color="green" size="small">Live Valuation</Badge>
              </div>

              {/* Weights Summary */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-ui-bg-base border border-ui-border-base text-center">
                <div>
                  <Text className="text-[10px] uppercase font-bold text-ui-fg-subtle">Pure DWT</Text>
                  <Text className="text-xs sm:text-sm font-bold text-ui-fg-base">{calculationSummary.pure_metal_dwt.toFixed(2)} dwt</Text>
                </div>
                <div>
                  <Text className="text-[10px] uppercase font-bold text-ui-fg-subtle">Pure Grams</Text>
                  <Text className="text-xs sm:text-sm font-bold text-ui-fg-base">{calculationSummary.pure_metal_grams.toFixed(2)} g</Text>
                </div>
                <div>
                  <Text className="text-[10px] uppercase font-bold text-ui-fg-subtle">Pure Troy Oz</Text>
                  <Text className="text-xs sm:text-sm font-bold text-ui-fg-base">{calculationSummary.pure_metal_ozt.toFixed(4)} oz</Text>
                </div>
              </div>

              {/* Line Item Costs Breakdown */}
              <div className="space-y-2 text-xs border-b border-ui-border-base pb-3">
                <div className="flex justify-between text-ui-fg-subtle">
                  <span>Base Metal Melt Value:</span>
                  <span className="font-semibold text-ui-fg-base">${calculationSummary.base_metal_cost.toFixed(2)}</span>
                </div>

                {mode === "retail_selling" && (
                  <>
                    <div className="flex justify-between text-ui-fg-subtle">
                      <span>Casting Wastage Cost:</span>
                      <span className="font-semibold text-ui-fg-base">${calculationSummary.wastage_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ui-fg-subtle">
                      <span>Labor & Benchwork:</span>
                      <span className="font-semibold text-ui-fg-base">${calculationSummary.labor_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ui-fg-subtle">
                      <span>Diamonds & Gemstones:</span>
                      <span className="font-semibold text-ui-fg-base">${calculationSummary.stone_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-ui-fg-base border-t border-ui-border-base pt-2">
                      <span>Total Production Cost:</span>
                      <span>${calculationSummary.total_cost_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Jeweler Profit ({profitMargin}%):</span>
                      <span>+${calculationSummary.profit_amount.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {mode === "scrap_buying" && (
                  <div className="flex justify-between text-amber-600 font-semibold">
                    <span>Refiner Payout ({profitMargin}% of Melt):</span>
                    <span>${calculationSummary.final_offered_price.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Final Highlighted Quote Price */}
              <div className="p-4 rounded-xl bg-ui-bg-base border border-emerald-500/30 text-center shadow-xs">
                <Text className="text-[11px] uppercase font-bold tracking-wider text-ui-fg-subtle">
                  {mode === "retail_selling" ? "Offered Retail Price (USD)" : "Total Scrap Payout (USD)"}
                </Text>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  ${calculationSummary.final_offered_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <Text className="text-[10px] text-ui-fg-muted mt-1">
                  Calculated with Gold @ ${spotRates.gold}/oz
                </Text>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="large"
                  className="w-full font-bold shadow-xs"
                  onClick={() => {
                    setQuoteTitle(items[0]?.item_title || "Custom Jewelry Quote");
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
                    setProfitMargin(20);
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
                    <Table.HeaderCell>Mode</Table.HeaderCell>
                    <Table.HeaderCell>Gold Spot</Table.HeaderCell>
                    <Table.HeaderCell>Margin</Table.HeaderCell>
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
                          <Badge size="xsmall" color={q.calculation_mode === "scrap_buying" ? "orange" : "purple"}>
                            {q.calculation_mode === "scrap_buying" ? "Scrap Buy" : "Retail Sale"}
                          </Badge>
                        </Table.Cell>

                        <Table.Cell>
                          <Text className="text-xs font-mono">${goldSpot.toFixed(2)}/oz</Text>
                        </Table.Cell>

                        <Table.Cell>
                          <Text className="text-xs font-semibold">{q.profit_margin_percent}%</Text>
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
                  ⚠️ Quote total must be greater than $0.00. Please enter item weights before saving.
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
                  <Badge
                    color={recalcQuote.calculation_mode === "scrap_buying" ? "orange" : "blue"}
                    size="xsmall"
                  >
                    {recalcQuote.calculation_mode === "scrap_buying" ? "Scrap Buy-Back" : "Custom Jewelry"}
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

                  {/* Detailed Breakdown Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-ui-border-base">
                    <div className="p-2.5 rounded-lg bg-ui-bg-subtle/50 border border-ui-border-base">
                      <span className="block text-ui-fg-subtle text-[11px]">Pure Melt Value</span>
                      <span className="font-semibold text-xs text-ui-fg-base block mt-0.5">
                        ${recalcSimulation.baseMetalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ui-bg-subtle/50 border border-ui-border-base">
                      <span className="block text-ui-fg-subtle text-[11px]">Wastage & Labor</span>
                      <span className="font-semibold text-xs text-ui-fg-base block mt-0.5">
                        ${(recalcSimulation.wastageCost + recalcSimulation.laborCost).toFixed(2)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ui-bg-subtle/50 border border-ui-border-base">
                      <span className="block text-ui-fg-subtle text-[11px]">Stones & Diamonds</span>
                      <span className="font-semibold text-xs text-ui-fg-base block mt-0.5">
                        ${recalcSimulation.stoneCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ui-bg-subtle/50 border border-ui-border-base">
                      <span className="block text-ui-fg-subtle text-[11px]">Margin Added ({recalcMargin}%)</span>
                      <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        ${recalcSimulation.profitAmount.toFixed(2)}
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

                {/* 3. Margin & Markup Adjustments */}
                <Container className="p-5 shadow-xs border border-ui-border-base space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
                    <div>
                      <Heading level="h3" className="text-sm font-semibold text-ui-fg-base">
                        {recalcQuote.calculation_mode === "scrap_buying"
                          ? "Refiner Payout Rate (%)"
                          : "Jeweler Profit Margin / Markup (%)"}
                      </Heading>
                      <Text className="text-xs text-ui-fg-subtle mt-0.5">
                        {recalcQuote.calculation_mode === "scrap_buying"
                          ? "Percentage of pure melt valuation paid out to customer"
                          : "Markup percentage applied over total precious metals, wastage, labor & stones"}
                      </Text>
                    </div>

                    <div className="flex items-center gap-1.5 bg-ui-bg-subtle px-3 py-1.5 rounded-lg border border-ui-border-base">
                      <Input
                        type="number"
                        min="0"
                        max="500"
                        value={recalcMargin}
                        onChange={(e) => setRecalcMargin(parseFloat(e.target.value) || 0)}
                        className="w-16 text-xs font-bold text-right"
                      />
                      <span className="text-xs font-bold text-ui-fg-muted">%</span>
                    </div>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min="0"
                    max={recalcQuote.calculation_mode === "scrap_buying" ? "100" : "100"}
                    step="1"
                    value={recalcMargin}
                    onChange={(e) => setRecalcMargin(Number(e.target.value))}
                    className="w-full accent-ui-fg-interactive h-1.5 bg-ui-bg-subtle rounded-lg cursor-pointer"
                  />

                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <span className="text-[11px] text-ui-fg-muted mr-1 font-medium">Quick Presets:</span>
                    {(recalcQuote.calculation_mode === "scrap_buying"
                      ? [70, 75, 80, 85, 90, 95]
                      : [10, 15, 20, 25, 35, 50, 100]
                    ).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRecalcMargin(preset)}
                        className={`px-3 py-1 rounded-md text-xs font-medium border transition-all ${
                          recalcMargin === preset
                            ? "bg-ui-button-neutral text-ui-fg-on-color border-transparent font-semibold shadow-xs"
                            : "bg-ui-bg-subtle text-ui-fg-subtle hover:text-ui-fg-base border-ui-border-base hover:bg-ui-bg-base"
                        }`}
                      >
                        {preset}% {preset === 100 && "(Keystone)"}
                      </button>
                    ))}
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
                  <Badge size="xsmall" color={selectedQuote?.calculation_mode === "scrap_buying" ? "orange" : "purple"}>
                    {selectedQuote?.calculation_mode === "scrap_buying" ? "Scrap Buy-Back" : "Custom Retail"}
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
                                {item.metal_type?.toUpperCase()} - {item.purity_karat?.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Weight</span>
                                <span className="font-semibold text-ui-fg-base">
                                  {itemWeight} {itemUnit} ({weightGrams}g)
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Casting Wastage</span>
                                <span className="font-semibold text-ui-fg-base">
                                  {item.wastage_percent || 0}%
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Labor / Bench</span>
                                <span className="font-semibold text-ui-fg-base">
                                  ${item.labor_charge_per_unit || 0}/{itemUnit} + ${item.labor_charge_flat || 0}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-ui-fg-muted block uppercase font-bold">Diamonds / Stones</span>
                                <span className="font-semibold text-ui-fg-base">
                                  {Number(item.diamond_carats) > 0 ? `${item.diamond_carats} Ct @ $${item.diamond_price_per_carat || 0}/Ct` : "None"}
                                </span>
                              </div>
                            </div>

                            {item.stone_notes && (
                              <Text className="text-[11px] text-ui-fg-subtle italic border-t border-ui-border-base pt-1">
                                Notes: {item.stone_notes}
                              </Text>
                            )}
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

              {selectedQuote?.calculation_mode !== "scrap_buying" && (
                <>
                  <div className="flex justify-between text-ui-fg-subtle">
                    <span>Casting Wastage:</span>
                    <span className="font-semibold text-ui-fg-base">
                      ${((Number(selectedQuote?.wastage_cost) || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-ui-fg-subtle">
                    <span>Labor & Benchwork:</span>
                    <span className="font-semibold text-ui-fg-base">
                      ${((Number(selectedQuote?.labor_cost) || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-ui-fg-subtle">
                    <span>Diamonds & Gemstones:</span>
                    <span className="font-semibold text-ui-fg-base">
                      ${((Number(selectedQuote?.stone_cost) || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-ui-fg-base border-t border-ui-border-base pt-2">
                    <span>Total Production Cost:</span>
                    <span>${((Number(selectedQuote?.total_cost_price) || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Jeweler Margin ({selectedQuote?.profit_margin_percent}%):</span>
                    <span>+${((Number(selectedQuote?.profit_amount) || 0) / 100).toFixed(2)}</span>
                  </div>
                </>
              )}

              {selectedQuote?.calculation_mode === "scrap_buying" && (
                <div className="flex justify-between text-amber-600 font-semibold pt-1 border-t border-ui-border-base">
                  <span>Refiner Scrap Payout ({selectedQuote?.profit_margin_percent}% of Melt):</span>
                  <span>${((Number(selectedQuote?.final_offered_price) || 0) / 100).toFixed(2)}</span>
                </div>
              )}
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
