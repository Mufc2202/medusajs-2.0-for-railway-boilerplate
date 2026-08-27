import { defineLink } from "@medusajs/framework/utils";
import JewelryQuotesModule from "../modules/jewelry-quotes";
import CustomerModule from "@medusajs/medusa/customer";

export default defineLink(
  CustomerModule.linkable.customer,
  JewelryQuotesModule.linkable.jewelryQuote
);
