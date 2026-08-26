import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { IProductModuleService } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { ProductEvents } from '@medusajs/framework/utils';

export default async function productUpsertHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  const productId = data.id;

  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);
  
  // Check if MeiliSearch service is available
  let meiliSearchService: any;
  try {
    meiliSearchService = container.resolve('@rokmohar/medusa-plugin-meilisearch');
  } catch (error) {
    // MeiliSearch service not available, skip indexing
    return;
  }

  const product = await productModuleService.retrieveProduct(productId);
  await meiliSearchService.addDocuments('products', [product], 'products');
}

export const config: SubscriberConfig = {
  event: [ProductEvents.PRODUCT_CREATED, ProductEvents.PRODUCT_UPDATED]
}
