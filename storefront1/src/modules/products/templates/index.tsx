import React, { Suspense } from "react"
import Link from "next/link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
//import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
//import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Check if the product is in the Jewelry Repair category
  const isJewelryRepair = product.categories?.some(
    (category) => category.name === "Jewelry Repair"
  )

  // Check if the product is in the Jewelry Repair category
  const isDiamond = product.categories?.some(
    (category) => category.name === "Diamond"
  )

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          {!isJewelryRepair ? (
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          ) : null}
        </div>
      </div>
      <div
        className="content-container my-8 small:my-16"
        data-testid="related-products-container"
      >
        {!isDiamond ? (
          <div className="flex justify-center">
            <a href="/lab-diamonds-v-natural">
              <button className="mt-5 min-w-[10rem] rounded-md bg-dolginslightblue bg-gradient-to-br from-dolginsblue px-5 py-3 font-bold text-white shadow-xl shadow-gold">
                Learn More About Lab Grown Vs Natural Diamonds
              </button>
            </a>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default ProductTemplate
