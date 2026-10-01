import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { BUSINESS_CARD_MODULE } from "../../../modules/business-card";
import BusinessCardModuleService from "../../../modules/business-card/services";

export const DEFAULT_BUSINESS_CARD = {
  first_name: "Joseph",
  last_name: "Dolginow",
  company: "Joseph Dolgin Jeweler LLC",
  bio: "Custom Fine Jewelry, Jewelry Repair, Appraisals",
  phone: "(913) 228-2808",
  email: "joseph@dolgins.com",
  website: "dolgins.com",
  street: "West 119th Street 4901",
  city: "Leawood",
  state: "KS",
  zip: "66209",
  country: "United States",
  color_primary: "#222943",
  color_accent: "#C7A88C",
  avatar_url: "https://qrcgcustomers.s3-eu-west-1.amazonaws.com/account51902472/59042606_1.png?0.2004734367969231",
  is_active: true,
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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
    console.error("Error fetching business card for store:", error);
    return res.status(200).json({ card: DEFAULT_BUSINESS_CARD });
  }
}
