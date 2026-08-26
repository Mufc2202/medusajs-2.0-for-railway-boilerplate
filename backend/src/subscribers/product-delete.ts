import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { ProductEvents } from '@medusajs/utils'

export default async function productDeleteHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
    const productId = data.id

    // Check if MeiliSearch service is available
    let meiliSearchService: any
    try {
        meiliSearchService = container.resolve('@rokmohar/medusa-plugin-meilisearch')
    } catch (error) {
        // MeiliSearch service not available, skip deletion
        return
    }

    await meiliSearchService.deleteDocument('products', productId)
}

export const config: SubscriberConfig = {
    event: ProductEvents.PRODUCT_DELETED
}
