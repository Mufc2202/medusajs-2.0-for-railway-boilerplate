import Link from "next/link"
import Image from "next/image"

import About from "@images/category-grid/about-category.jpg"
import Best from "@images/category-grid/best-seller-category.jpg"
import Custom from "@images/category-grid/custom-category.jpg"
import Diamond from "@images/category-grid/diamonds-category.jpg"
import Gemstone from "@images/category-grid/gemstones-category.jpg"

const CategoryGrid = ({}) => {
  return (
    <div className="bg-white py-4 sm:py-16">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between mb-8 border-b-2 border-gold">
          <h2 className="text-5xl font-serif font-gold tracking-tight pb-2">
            Learn More
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <Link href="/categories/custom-jewelry">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
                <Image
                  alt="Marsha carving a wax for a custom ring with contouring diamond wedding band."
                  src={Custom}
                  className="h-80 object-cover object-left"
                />
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-dolginsblue border-b border-gold">
                    Custom Jewelry
                  </h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    When Unique Is Want You Want
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    These jewelry items are loved. They are often classic styles
                    that have been beloved jewelry for generations.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            </Link>
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
            <Link href="/categories/diamonds">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
                <Image
                  alt="Antique diamond engagement ring featuring single cut diamonds and an Old European Cut Round GIA graded"
                  src={Diamond}
                  className="h-80 object-cover object-left lg:object-right"
                />
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-dolginsblue border-b border-gold">
                    Diamonds
                  </h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    Lets Find Yours
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    We work together to find a perfect diamond for you whether
                    you want a lab-grown or natural. We sell high quality stones
                    that have been selected by our trained eyes.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
            </Link>
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
            <Link href="/categories/gemstones">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                <Image
                  alt="Comparing pink sapphire for an engagement ring in our jewelry store in Overland Park, Kansas"
                  src={Gemstone}
                  className="h-80 object-cover object-left"
                />
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-dolginsblue border-b border-gold">
                    Rubies & Sapphires & Emeralds
                  </h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    Gemstones That Color
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    Colored gemstones add pop.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
            </Link>
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white" />
            <Link href="/categories/best-sellers">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <Image
                  alt="Diamond solitaire earrings have been a best selling jewelry item from our jewelry store in Overland Park Kansas for generations."
                  src={Best}
                  className="h-80 object-cover"
                />
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-dolginsblue border-b border-gold">
                    Best Sellers
                  </h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    Favorites That Stay
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    These styles are (with reason) popular. Their style works.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </Link>
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <Link href="/about">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
                <Image alt="" src={About} className="h-80 object-cover" />
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-dolginsblue border-b border-gold">
                    About Dolgins
                  </h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                    Four Generations Of Jewelry
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    Aenean vulputate justo commodo auctor vehicula in malesuada
                    semper.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryGrid
