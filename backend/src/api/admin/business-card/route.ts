import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { BUSINESS_CARD_MODULE } from "../../../modules/business-card";
import BusinessCardModuleService from "../../../modules/business-card/services";
import { DEFAULT_BUSINESS_CARD } from "../../store/business-card/route";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  try {
    const businessCardService: BusinessCardModuleService = req.scope.resolve(BUSINESS_CARD_MODULE);
    const cards = await businessCardService.listBusinessCards(
      {},
      { take: 1, order: { created_at: "DESC" } }
    );

    if (cards && cards.length > 0) {
      return res.status(200).json({ card: cards[0] });
    }

    return res.status(200).json({ card: DEFAULT_BUSINESS_CARD });
  } catch (error: any) {
    console.error("Error fetching business card for admin:", error);
    return res.status(200).json({ card: DEFAULT_BUSINESS_CARD });
  }
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  try {
    const businessCardService: BusinessCardModuleService = req.scope.resolve(BUSINESS_CARD_MODULE);
    const body = req.body as any;

    const existingCards = await businessCardService.listBusinessCards({}, { take: 1 });

    const payload = {
      first_name: body.first_name ?? DEFAULT_BUSINESS_CARD.first_name,
      last_name: body.last_name ?? DEFAULT_BUSINESS_CARD.last_name,
      company: body.company ?? DEFAULT_BUSINESS_CARD.company,
      bio: body.bio ?? DEFAULT_BUSINESS_CARD.bio,
      phone: body.phone ?? DEFAULT_BUSINESS_CARD.phone,
      email: body.email ?? DEFAULT_BUSINESS_CARD.email,
      website: body.website ?? DEFAULT_BUSINESS_CARD.website,
      street: body.street ?? DEFAULT_BUSINESS_CARD.street,
      city: body.city ?? DEFAULT_BUSINESS_CARD.city,
      state: body.state ?? DEFAULT_BUSINESS_CARD.state,
      zip: body.zip ?? DEFAULT_BUSINESS_CARD.zip,
      country: body.country ?? DEFAULT_BUSINESS_CARD.country,
      // Theme & Branding disabled for now (kept for future reference)
      // color_primary: body.color_primary || DEFAULT_BUSINESS_CARD.color_primary,
      // color_accent: body.color_accent || DEFAULT_BUSINESS_CARD.color_accent,
      // avatar_url: body.avatar_url ?? DEFAULT_BUSINESS_CARD.avatar_url,
      color_primary: DEFAULT_BUSINESS_CARD.color_primary,
      color_accent: DEFAULT_BUSINESS_CARD.color_accent,
      avatar_url: DEFAULT_BUSINESS_CARD.avatar_url,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    };

    let savedCard;
    if (existingCards && existingCards.length > 0) {
      savedCard = await businessCardService.updateBusinessCards({
        id: existingCards[0].id,
        ...payload,
      });
    } else {
      savedCard = await businessCardService.createBusinessCards(payload);
    }

    return res.status(200).json({ card: savedCard });
  } catch (error: any) {
    console.error("Error updating business card:", error);
    return res.status(500).json({
      error: "Failed to update business card configuration",
      message: error.message,
    });
  }
}
