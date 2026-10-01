import { model } from "@medusajs/framework/utils";

const BusinessCard = model.define("business_card", {
  id: model.id().primaryKey(),
  first_name: model.text().default("Joseph"),
  last_name: model.text().default("Dolginow"),
  company: model.text().default("Joseph Dolgin Jeweler LLC"),
  bio: model.text().default("Custom Fine Jewelry, Jewelry Repair, Appraisals"),
  phone: model.text().default("(913) 228-2808"),
  email: model.text().default("joseph@dolgins.com"),
  website: model.text().default("dolgins.com"),
  street: model.text().default("West 119th Street 4901"),
  city: model.text().default("Leawood"),
  state: model.text().default("KS"),
  zip: model.text().default("66209"),
  country: model.text().default("United States"),
  color_primary: model.text().default("#222943"),
  color_accent: model.text().default("#C7A88C"),
  avatar_url: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
});

export default BusinessCard;
