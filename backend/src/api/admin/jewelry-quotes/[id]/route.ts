import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import JewelryQuotesModuleService from "../../../../modules/jewelry-quotes/service";
import { JEWELRY_QUOTES_MODULE } from "../../../../modules/jewelry-quotes";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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

    // Sort revisions in chronological order
    if (quote.revisions && Array.isArray(quote.revisions)) {
      quote.revisions.sort((a, b) => (a.revision_number || 0) - (b.revision_number || 0));
    }

    res.status(200).json({ quote });
  } catch (error: any) {
    console.error(`Error retrieving jewelry quote ${req.params.id}:`, error);
    res.status(500).json({
      error: "Failed to retrieve jewelry quote",
      message: error.message,
    });
  }
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const jewelryService: JewelryQuotesModuleService = req.scope.resolve(
      JEWELRY_QUOTES_MODULE
    );
    const { id } = req.params;

    // Delete revisions first
    const revisions = await jewelryService.listJewelryQuoteRevisions({
      quote: id,
    });
    if (revisions && revisions.length > 0) {
      await Promise.all(
        revisions.map((rev) => jewelryService.deleteJewelryQuoteRevisions(rev.id))
      );
    }

    // Delete quote
    await jewelryService.deleteJewelryQuotes(id);

    res.status(200).json({ id, deleted: true });
  } catch (error: any) {
    console.error(`Error deleting jewelry quote ${req.params.id}:`, error);
    res.status(500).json({
      error: "Failed to delete jewelry quote",
      message: error.message,
    });
  }
}
