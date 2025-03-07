import { HttpTypes } from "@medusajs/types"
//import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageHeader from "@modules/layout/components/page-header"

import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <PageHeader
          name={product.title}
          subtitle={product.subtitle}
          tidbit={product.description}
        />
        {/* 
        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text> 

        <div className="prose">
          <Markdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ node, ...props }) => (
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "0px",
                    minHeight: "18px",
                  }}
                  {...props}
                />
              ),
            }}
          >
            {product.description}
          </Markdown>
        </div>*/}
      </div>
    </div>
  )
}

export default ProductInfo
