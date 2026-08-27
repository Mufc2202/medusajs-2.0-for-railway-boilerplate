import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { CurrencyDollar, Plus, ArrowPath, Clock, Eye, CheckCircle, EllipsisHorizontal, Trash } from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Table,
  Drawer,
  FocusModal,
  Input,
  Tooltip,
  IconButton,
  DropdownMenu,
  toast,
} from "@medusajs/ui";
import { useState, useEffect, useMemo } from "react";

const DWT_TO_GRAMS = 1.55517384;
const TROY_OZ_TO_GRAMS = 31.1034768;
const TROY_OZ_TO_DWT = 20.0;

const PURITY_FACTORS: Record<string, number> = {
  "24k": 0.999,
  "22k": 0.9167,
  "18k": 0.75,
  "14k": 0.5833,
  "10k": 0.4167,
  "9k": 0.375,
  "8k": 0.333,
  "999": 0.999,
  "925": 0.925,
  "900": 0.9,
  "800": 0.8,
  "pt950": 0.95,
  "pt900": 0.9,
  "pt850": 0.85,
  "pd950": 0.95,
  "pd500": 0.5,
};

const CustomerJewelryQuotesWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Spot rates
  const [spotRates, setSpotRates] = useState<{
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  }>({ gold: 2685.0, silver: 31.5, platinum: 975.0, palladium: 990.0 });

  // Recalculate modal
  const [recalcQuote, setRecalcQuote] = useState<any | null>(null);
  const [isRecalcModalOpen, setIsRecalcModalOpen] = useState(false);
  const [recalcSpotRates, setRecalcSpotRates] = useState<{
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  }>({ gold: 2685.0, silver: 31.5, platinum: 975.0, palladium: 990.0 });
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

  // Real-time recalculation simulation
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
      const purityFactor = PURITY_FACTORS[item.purity_karat] || 1.0;
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

  // History drawer
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Quick New Quote Drawer
  const [isNewQuoteDrawerOpen, setIsNewQuoteDrawerOpen] = useState(false);
  const [newQuoteTitle, setNewQuoteTitle] = useState("Custom 14K Jewelry Quote");
  const [newMetal, setNewMetal] = useState<"gold" | "silver" | "platinum" | "palladium">("gold");
  const [newKarat, setNewKarat] = useState("14k");
  const [newWeight, setNewWeight] = useState(5.0);
  const [newUnit, setNewUnit] = useState<"dwt" | "g" | "ozt">("dwt");
  const [newLabor, setNewLabor] = useState(0);
  const [newWastage, setNewWastage] = useState(5);
  const [newDiamonds, setNewDiamonds] = useState(0);
  const [newDiamondPrice, setNewDiamondPrice] = useState(0);
  const [newMargin, setNewMargin] = useState(20);
  const [creatingQuote, setCreatingQuote] = useState(false);

  const customerId = data?.id;

  const fetchCustomerQuotes = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const res = await fetch(`/admin/jewelry-quotes?customer_id=${customerId}`);
      if (res.ok) {
        const json = await res.json();
        setQuotes(json.quotes || []);
      }
    } catch (err) {
      console.error("Error fetching customer quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpotRates = async () => {
    try {
      const res = await fetch("/admin/jewelry-spot-prices");
      if (res.ok) {
        const json = await res.json();
        if (json.spot_prices && Array.isArray(json.spot_prices)) {
          const goldObj = json.spot_prices.find((p: any) => p.metal === "gold");
          const silverObj = json.spot_prices.find((p: any) => p.metal === "silver");
          const platObj = json.spot_prices.find((p: any) => p.metal === "platinum");
          const palObj = json.spot_prices.find((p: any) => p.metal === "palladium");

          setSpotRates({
            gold: goldObj ? Number(goldObj.price_per_troy_oz) : 2685.0,
            silver: silverObj ? Number(silverObj.price_per_troy_oz) : 31.5,
            platinum: platObj ? Number(platObj.price_per_troy_oz) : 975.0,
            palladium: palObj ? Number(palObj.price_per_troy_oz) : 990.0,
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch spot rates:", err);
    }
  };

  useEffect(() => {
    fetchCustomerQuotes();
    fetchSpotRates();
  }, [customerId]);

  // Recalculate quote
  const handleRecalculate = async () => {
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
          notes: recalcNotes || `Recalculated from customer page at Gold $${recalcSpotRates.gold}/oz, Margin ${recalcMargin}%`,
        }),
      });

      if (res.ok) {
        setIsRecalcModalOpen(false);
        setRecalcQuote(null);
        fetchCustomerQuotes();
        toast.success("Quote Recalculated", {
          description: `Updated price to $${newPrice.toFixed(2)} with new revision logged.`,
        });
      } else {
        const errData = await res.json();
        toast.error("Recalculation Failed", {
          description: errData.message || errData.error,
        });
      }
    } catch (err: any) {
      toast.error("Error recalculating quote", { description: err.message });
    } finally {
      setRecalculating(false);
    }
  };

  // Delete quote
  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const res = await fetch(`/admin/jewelry-quotes/${quoteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCustomerQuotes();
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

  // Quick Quote live calculation
  const quickQuoteSimulation = useMemo(() => {
    const weightNum = Number(newWeight) || 0;
    if (weightNum <= 0) return { finalPrice: 0, baseMetalCost: 0 };

    const purityFactor = PURITY_FACTORS[newKarat] || 0.5833;
    let grams = weightNum;
    if (newUnit === "dwt") grams = weightNum * DWT_TO_GRAMS;
    else if (newUnit === "ozt") grams = weightNum * TROY_OZ_TO_GRAMS;

    const pureGrams = grams * purityFactor;
    const pureOzt = pureGrams / TROY_OZ_TO_GRAMS;
    const metalSpot = spotRates[newMetal as keyof typeof spotRates] || 2685.0;
    const baseMetalCost = pureOzt * metalSpot;

    const wastageCost = baseMetalCost * (Number(newWastage || 0) / 100);
    const laborCost = Number(newLabor || 0);
    const diamondCost = (Number(newDiamonds) || 0) * (Number(newDiamondPrice) || 0);

    const totalCost = baseMetalCost + wastageCost + laborCost + diamondCost;
    const profit = totalCost * (Number(newMargin || 0) / 100);
    const finalPrice = totalCost + profit;

    return { finalPrice, baseMetalCost, totalCost };
  }, [newMetal, newKarat, newWeight, newUnit, newLabor, newWastage, newDiamonds, newDiamondPrice, newMargin, spotRates]);

  // Create Quick Quote
  const handleCreateQuickQuote = async () => {
    if (!newQuoteTitle.trim()) {
      toast.error("Title required", { description: "Please enter a quote title." });
      return;
    }

    if (Number(newWeight) <= 0) {
      toast.error("Weight required", { description: "Please enter a valid weight (> 0)." });
      return;
    }

    if (quickQuoteSimulation.finalPrice <= 0) {
      toast.error("Invalid Quote Total", {
        description: "Calculated quote price must be greater than $0.00 to save.",
      });
      return;
    }

    try {
      setCreatingQuote(true);
      const customerFullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email;
      const res = await fetch("/admin/jewelry-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          customer_name: customerFullName,
          customer_email: data.email,
          customer_phone: data.phone,
          title: newQuoteTitle.trim(),
          currency_code: "usd",
          calculation_mode: "retail_selling",
          items: [
            {
              metal_type: newMetal,
              purity_karat: newKarat,
              weight: Number(newWeight),
              unit: newUnit,
              labor_charge_flat: Number(newLabor || 0),
              wastage_percent: Number(newWastage || 0),
              diamond_carats: Number(newDiamonds || 0),
              diamond_price_per_carat: Number(newDiamondPrice || 0),
              item_title: newQuoteTitle.trim(),
            },
          ],
          spot_prices: spotRates,
          profit_margin_percent: Number(newMargin),
          notes: `Created from customer profile for ${customerFullName}`,
        }),
      });

      if (res.ok) {
        setIsNewQuoteDrawerOpen(false);
        setNewQuoteTitle("");
        setNewWeight(0);
        fetchCustomerQuotes();
        toast.success("Quote Created", {
          description: `Quote linked to ${customerFullName} successfully.`,
        });
      } else {
        const errData = await res.json();
        toast.error("Failed to create quote", {
          description: errData.message || errData.error,
        });
      }
    } catch (err: any) {
      toast.error("Error creating quote", { description: err.message });
    } finally {
      setCreatingQuote(false);
    }
  };

  const totalQuotedValue = quotes.reduce(
    (acc, q) => acc + (Number(q.final_offered_price) || 0) / 100,
    0
  );

  return (
    <Container className="divide-y divide-ui-border-base p-0 mt-6 shadow-xs border border-ui-border-base overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-3">
        <div>
          <Heading level="h2" className="text-sm font-semibold flex items-center gap-2 text-ui-fg-base">
            <CurrencyDollar className="text-ui-fg-interactive" />
            Jewelry & Precious Metal Quotes
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mt-0.5">
            US Jeweler price estimates, gold spot benchmarks, and revision history for this customer.
          </Text>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="small"
            onClick={fetchCustomerQuotes}
            disabled={loading}
            className="whitespace-nowrap shrink-0"
          >
            <ArrowPath className={`mr-1.5 w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsNewQuoteDrawerOpen(true)}
            className="whitespace-nowrap shrink-0"
          >
            <Plus className="mr-1.5 w-3.5 h-3.5" /> New Quote
          </Button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-ui-bg-subtle/50">
        <div className="p-3.5 rounded-xl bg-ui-bg-base border border-ui-border-base shadow-xs space-y-1">
          <Text className="text-[11px] font-semibold text-ui-fg-subtle uppercase tracking-wider">Total Quotes</Text>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-ui-fg-base">{quotes.length}</span>
            <Badge size="xsmall" color="grey">{quotes.length === 1 ? "1 Quote" : `${quotes.length} Quotes`}</Badge>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ui-bg-base border border-ui-border-base shadow-xs space-y-1">
          <Text className="text-[11px] font-semibold text-ui-fg-subtle uppercase tracking-wider">Total Quoted Value</Text>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${totalQuotedValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <Badge size="xsmall" color="green">USD</Badge>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ui-bg-base border border-ui-border-base shadow-xs space-y-1">
          <Text className="text-[11px] font-semibold text-ui-fg-subtle uppercase tracking-wider">Live Gold Spot</Text>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-ui-fg-base">${spotRates.gold}/oz</span>
            <Badge size="xsmall" color="orange">Benchmark</Badge>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-ui-fg-muted">
          <ArrowPath className="animate-spin inline-block mr-2" /> Loading customer quotes...
        </div>
      ) : quotes.length === 0 ? (
        <div className="py-12 text-center text-xs text-ui-fg-muted px-4">
          <Text className="text-xs">No jewelry price quotes saved for this customer yet.</Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="pl-6">Quote Title</Table.HeaderCell>
                <Table.HeaderCell>Gold Spot (At Offer)</Table.HeaderCell>
                <Table.HeaderCell>Margin</Table.HeaderCell>
                <Table.HeaderCell>Offered Price</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Revisions</Table.HeaderCell>
                <Table.HeaderCell className="text-right pr-6">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {quotes.map((q) => {
                const finalPrice = (Number(q.final_offered_price) || 0) / 100;
                const goldSpot = q.spot_prices_snapshot?.gold || 0;
                const revCount = q.revisions?.length || 1;

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
                      <Badge size="xsmall" color={q.status === "accepted" ? "green" : "blue"}>
                        {q.status}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Badge size="xsmall" color="grey">Rev #{revCount}</Badge>
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
                              <span>View History Timeline</span>
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

      {/* Medusa FocusModal for Recalculate Customer Quote */}
      <FocusModal open={isRecalcModalOpen} onOpenChange={setIsRecalcModalOpen}>
        {recalcQuote && recalcSimulation && (
          <FocusModal.Content>
            <FocusModal.Header>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <FocusModal.Title className="text-sm font-semibold text-ui-fg-base">
                    Re-calculate Customer Quote
                  </FocusModal.Title>
                  <Badge
                    color={recalcQuote.calculation_mode === "scrap_buying" ? "orange" : "blue"}
                    size="xsmall"
                  >
                    {recalcQuote.calculation_mode === "scrap_buying" ? "Scrap Buy-Back" : "Custom Retail"}
                  </Badge>
                </div>
                <div className="flex items-center gap-x-2">
                  <Button variant="secondary" size="small" onClick={() => setIsRecalcModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleRecalculate}
                    disabled={recalculating}
                  >
                    {recalculating ? "Saving Revision..." : "Save Revision"}
                  </Button>
                </div>
              </div>
            </FocusModal.Header>

            <FocusModal.Body className="flex flex-col items-center overflow-y-auto p-4 sm:p-8 lg:p-10">
              <div className="flex w-full max-w-3xl flex-col gap-y-5">
                <div>
                  <Heading level="h2" className="text-base sm:text-lg font-bold text-ui-fg-base">
                    Simulate & Update Pricing
                  </Heading>
                  <Text className="text-xs text-ui-fg-subtle mt-0.5">
                    Adjust benchmark spot rates and profit margins for <strong>{recalcQuote.title}</strong>.
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
                    <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base text-center space-y-1">
                      <span className="text-[11px] text-ui-fg-subtle block font-medium">Previous Quoted Price</span>
                      <span className="text-xl font-bold text-ui-fg-base block">
                        ${recalcSimulation.previousPrice.toFixed(2)}
                      </span>
                    </div>

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
                        {recalcSimulation.deltaPercent.toFixed(1)}%)
                      </Badge>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 ring-1 ring-emerald-500/20">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                        New Simulated Price
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        ${recalcSimulation.finalOfferedPrice.toFixed(2)}
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
                        Adjust spot prices in real-time to simulate counter offers.
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
                          : "Jeweler Profit Margin (%)"}
                      </Heading>
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
                    Reason / Revision Note
                  </label>
                  <Input
                    placeholder={`e.g. Gold spot adjusted to $${recalcSpotRates.gold}/oz`}
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

      {/* History Drawer */}
      <Drawer open={isHistoryDrawerOpen} onOpenChange={setIsHistoryDrawerOpen}>
        <Drawer.Content className="max-w-lg max-h-screen flex flex-col overflow-hidden">
          <Drawer.Header className="shrink-0">
            <Drawer.Title className="text-lg font-bold">{selectedQuote?.title}</Drawer.Title>
            <Drawer.Description className="text-xs text-ui-fg-subtle">
              Revision History & Price Evolution Log
            </Drawer.Description>
          </Drawer.Header>

          <Drawer.Body className="space-y-6 py-4 flex-1 overflow-y-auto min-h-0">
            {/* Current Quoted Price */}
            <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Text className="text-xs text-ui-fg-subtle">Current Quoted Price</Text>
                  <Badge size="xsmall" color={selectedQuote?.calculation_mode === "scrap_buying" ? "orange" : "purple"}>
                    {selectedQuote?.calculation_mode === "scrap_buying" ? "Scrap Buy-Back" : "Custom Retail"}
                  </Badge>
                </div>
                <Text className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${((Number(selectedQuote?.final_offered_price) || 0) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </div>
              <Badge size="small" color={selectedQuote?.status === "accepted" ? "green" : "blue"}>
                {selectedQuote?.status || "offered"}
              </Badge>
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
                    <span>📦 Quoted Items & Specifications ({quoteItems.length})</span>
                  </Heading>

                  {quoteItems.length === 0 ? (
                    <div className="p-3 text-center text-xs text-ui-fg-muted border border-dashed rounded-lg">
                      No individual line items recorded.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {quoteItems.map((item: any, idx: number) => {
                        const itemWeight = item.weight !== undefined ? item.weight : item.weight_input || 0;
                        const itemUnit = item.unit || "dwt";
                        const weightGrams = itemUnit === "dwt"
                          ? (Number(itemWeight) * 1.55517).toFixed(2)
                          : itemUnit === "ozt"
                          ? (Number(itemWeight) * 31.1035).toFixed(2)
                          : Number(itemWeight).toFixed(2);

                        return (
                          <div key={idx} className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-base space-y-1.5 shadow-xs">
                            <div className="flex items-center justify-between border-b border-ui-border-base pb-1.5">
                              <Text className="text-xs font-bold text-ui-fg-base">
                                Item #{idx + 1}: {item.item_title || `${item.metal_type} ${item.purity_karat}`}
                              </Text>
                              <Badge color="grey" size="xsmall">
                                {item.metal_type?.toUpperCase()} {item.purity_karat?.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] text-ui-fg-muted block font-semibold">Weight</span>
                                <span>{itemWeight} {itemUnit} ({weightGrams}g)</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-ui-fg-muted block font-semibold">Bench & Labor</span>
                                <span>${item.labor_charge_per_unit || 0}/{itemUnit} + ${item.labor_charge_flat || 0}</span>
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

            {/* Price History & Revisions */}
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
                    <div key={rev.id || idx} className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-base shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <Badge color="grey" size="xsmall">
                          Revision #{rev.revision_number || idx + 1}
                        </Badge>
                        <span className="text-[10px] text-ui-fg-muted">
                          {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-ui-fg-subtle">Gold: </span>
                          <span className="font-mono font-semibold">${goldAtRev.toFixed(2)}/oz</span>
                          <span className="mx-2 text-ui-fg-muted">•</span>
                          <span className="text-ui-fg-subtle">Margin: </span>
                          <span className="font-semibold">{rev.profit_margin_percent}%</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">${revPrice.toFixed(2)}</span>
                          {delta !== 0 && (
                            <span className={`block text-[10px] ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {delta > 0 ? "+" : ""}${delta.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {rev.notes && (
                        <Text className="text-[10px] text-ui-fg-subtle mt-1.5 italic border-t border-ui-border-base pt-1">
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

      {/* Quick New Quote Drawer */}
      <Drawer open={isNewQuoteDrawerOpen} onOpenChange={setIsNewQuoteDrawerOpen}>
        <Drawer.Content className="max-w-md max-h-screen flex flex-col overflow-hidden">
          <Drawer.Header className="shrink-0">
            <Drawer.Title className="text-lg font-bold">New Quote for {data.first_name || "Customer"}</Drawer.Title>
            <Drawer.Description className="text-xs text-ui-fg-subtle">
              Calculate and save a price quote directly linked to this customer profile.
            </Drawer.Description>
          </Drawer.Header>

          <Drawer.Body className="space-y-4 py-4 flex-1 overflow-y-auto min-h-0">
            <div>
              <label className="block text-xs font-semibold text-ui-fg-base mb-1">Quote Title</label>
              <Input
                value={newQuoteTitle}
                onChange={(e) => setNewQuoteTitle(e.target.value)}
                placeholder="e.g. 14K Gold Diamond Ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Metal</label>
                <select
                  value={newMetal}
                  onChange={(e: any) => setNewMetal(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border bg-ui-bg-field"
                >
                  <option value="gold">Gold (Au)</option>
                  <option value="silver">Silver (Ag)</option>
                  <option value="platinum">Platinum (Pt)</option>
                  <option value="palladium">Palladium (Pd)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Karat / Purity</label>
                <select
                  value={newKarat}
                  onChange={(e) => setNewKarat(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border bg-ui-bg-field"
                >
                  <option value="14k">14K Plumb (58.33%)</option>
                  <option value="18k">18K Fine (75.0%)</option>
                  <option value="10k">10K (41.67%)</option>
                  <option value="24k">24K Pure (99.9%)</option>
                  <option value="sterling_925">.925 Sterling Silver</option>
                  <option value="pt_950">Pt 950 Platinum</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Weight</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Unit</label>
                <select
                  value={newUnit}
                  onChange={(e: any) => setNewUnit(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border bg-ui-bg-field"
                >
                  <option value="dwt">DWT (Pennyweight)</option>
                  <option value="g">Grams (g)</option>
                  <option value="ozt">Troy Oz (ozt)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Flat Bench Fee ($)</label>
                <Input
                  type="number"
                  value={newLabor}
                  onChange={(e) => setNewLabor(parseFloat(e.target.value) || 0)}
                  placeholder="$0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ui-fg-base mb-1">Jeweler Margin %</label>
                <Input
                  type="number"
                  value={newMargin}
                  onChange={(e) => setNewMargin(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Live Calculated Preview */}
            <div className="p-4 rounded-xl bg-ui-bg-subtle border border-ui-border-base space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ui-fg-subtle font-medium">Estimated Quoted Price:</span>
                <span className={`font-extrabold text-base ${quickQuoteSimulation.finalPrice > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ui-fg-muted"}`}>
                  ${quickQuoteSimulation.finalPrice.toFixed(2)}
                </span>
              </div>
              {quickQuoteSimulation.finalPrice <= 0 && (
                <div className="text-[11px] text-ui-fg-error font-medium bg-rose-500/10 border border-rose-500/20 p-2 rounded-md">
                  ⚠️ Price must be greater than $0.00. Please enter item weight.
                </div>
              )}
              <div className="flex justify-between text-ui-fg-muted pt-1 border-t border-ui-border-base">
                <span>Gold Spot Reference:</span>
                <span className="font-mono">${spotRates.gold}/oz</span>
              </div>
            </div>
          </Drawer.Body>

          <Drawer.Footer className="shrink-0 border-t border-ui-border-base">
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="small" onClick={() => setIsNewQuoteDrawerOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleCreateQuickQuote}
                disabled={creatingQuote || quickQuoteSimulation.finalPrice <= 0}
              >
                {creatingQuote ? "Creating..." : "Save Quote"}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details",
});

export default CustomerJewelryQuotesWidget;
