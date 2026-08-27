import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import JewelryQuotesModuleService from "../../../../../modules/jewelry-quotes/service";
import { JEWELRY_QUOTES_MODULE } from "../../../../../modules/jewelry-quotes";

export async function POST(
  req: AuthenticatedMedusaRequest<{
    status: "draft" | "offered" | "accepted" | "declined" | "expired";
    notes?: string;
  }>,
  res: MedusaResponse
) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing required 'status' field." });
    }

    const quote = await jewelryService.retrieveJewelryQuote(id);
    if (!quote) {
      return res.status(404).json({ error: `Jewelry quote with id ${id} not found.` });
    }

    const updated = await jewelryService.updateJewelryQuotes({
      id,
      status,
      ...(notes && { notes }),
    });

    res.status(200).json({ quote: updated });
  } catch (error: any) {
    console.error(`Error updating status for quote ${req.params.id}:`, error);
    res.status(500).json({
      error: "Failed to update quote status",
      message: error.message,
    });
  }
}
