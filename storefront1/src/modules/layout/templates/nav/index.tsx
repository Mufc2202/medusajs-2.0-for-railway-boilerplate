"use client"
import Image from "next/image"
import Link from "next/link"
import Logo from "@images/logos/logolong-text-blue-symbol-color.svg"
import { Fragment, useState } from "react"
import { Dialog, Popover, Tab, Transition } from "@headlessui/react"
import Diamond from "@images/Navbar/icon-diamond.svg"
import WeddingRing from "@images/Navbar/icon-engagementring.svg"
import WatchRepair from "@images/Navbar/icon-watchrepair.svg"
import Appraisal from "@images/Navbar/icon-appraisal.svg"
import ReadyMade from "@images/Navbar/icon-readymade.svg"
import CustomRing from "@images/Navbar/icon-custom.svg"
import Buying from "@images/Navbar/icon-buying.svg"
import Repair from "@images/Navbar/icon-repair.svg"
import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { StoreCart } from "@medusajs/types"

//https://tailwindui.com/components/ecommerce/page-examples/storefront-pages
//With overlapping image tiles and perks

const navigation = {
  categories: [
    {
      name: "Jewelry",
      featured: [
        {
          name: "Engagement & Wedding Rings",
          href: "/t/wedding-rings",
          imageSrc: WeddingRing,
          imageAlt:
            "Engagement ring and wedding band in a jewelry box for a engagement proposal icon.",
        },
        {
          name: "Diamonds",
          href: "/t/diamonds",
          imageSrc: Diamond,
          imageAlt: "Sparkling diamond icon",
        },
        {
          name: "Custom-Made",
          href: "/t/custom-jewelry",
          imageSrc: CustomRing,
          imageAlt: "Designing a custom diamond engagement ring icon",
        },
        {
          name: "All Jewelry",
          href: "/store",
          imageSrc: ReadyMade,
          imageAlt:
            "Necklace on a display neck icon for jewelry ready for you to buy",
        },
      ],
    },
    {
      name: "Services",
      featured: [
        {
          name: "Sell Us Your Jewelry & Gold",
          href: "/buying-jewelry",
          imageSrc: Buying,
          imageAlt: "Exchanging a diamond ring for cash icon",
        },
        {
          name: "Jewelry Repairs",
          href: "/t/jewelry-repair",
          imageSrc: Repair,
          imageAlt: "Pliers working on an diamond engagement ring for repair",
        },
        {
          name: "Insurance Appraisals",
          href: "/jewelry-insurance-appraisal",
          imageSrc: Appraisal,
          imageAlt: "Official jewelry appraisal document icon",
        },
        {
          name: "Watch Repair",
          href: "/t/jewelry-repair/watches",
          imageSrc: WatchRepair,
          imageAlt: "Watch with the back removed and small screw driver",
        },
      ],
    },
  ],
  pages: [
    { name: "About", href: "/about" },
    { name: "Account", href: "/account", testid: "nav-search-link" },
    {
      name: "Search",
      href: "/search",
      testid: "nav-account-link",
      scroll: false,
    },
  ],
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

export default function Nav({ cartData }: { cartData: StoreCart | null }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "text-dolginsblue border-dolginsblue"
                                : "text-gray-900 border-transparent",
                              "flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-12 px-4 py-6"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative">
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md group-hover:opacity-75">
                                <Image
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-cover object-center"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block flex justify-center text-sm font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                        data-testid={page.testid}
                        //scroll={page.scroll}
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 items-center justify-left">
                  <div className="flex items-center lg:ml-8">
                    {/* Calll Now */}
                    <div className="ml-4 flow-root lg:ml-8">
                      <a
                        id="CallMobileNavTag"
                        href="tel:9132282808"
                        className="inline-block rounded-md shadow bg-dolginsblue py-2 px-4 text-center text-white hover:bg-dolginslightblue"
                      >
                        <span className="text-sm">Call</span>
                      </a>
                      <a
                        id="TextMobileNavTag"
                        href="sms:9132282808"
                        className="inline-block mx-4 rounded-md shadow bg-dolginsblue py-2 px-4 text-center text-white hover:bg-dolginslightblue"
                      >
                        <span className="text-sm">Text</span>
                      </a>
                      <a
                        id="EmailMobileNavTag"
                        href="mailto:joseph@dolgins.com"
                        className="inline-block rounded-md shadow bg-dolginsblue py-2 px-4 text-center text-white hover:bg-dolginslightblue"
                      >
                        <span className="text-sm">E-mail</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative">
        <nav aria-label="Top">
          {/* Top Headline/Announcement Bar */}
          {/* Secondary navigation */}
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo (lg+) */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center">
                  <Link href="/">
                    <span className="sr-only">Dolgins Jewelry Store</span>
                    <Image
                      className="h-8 w-auto"
                      src={Logo}
                      alt="Dolgins Jewelry Logo"
                      priority
                    />
                  </Link>
                </div>

                <div className="hidden h-full lg:flex">
                  {/* Flyout menus */}
                  <Popover.Group className="inset-x-0 bottom-0 px-4">
                    <div className="flex h-full justify-center space-x-8">
                      {navigation.categories.map((category) => (
                        <Popover key={category.name} className="flex">
                          {({ open, close }) => (
                            <>
                              <div className="relative flex">
                                <Popover.Button
                                  className={classNames(
                                    open
                                      ? "text-dolginsblue"
                                      : "text-gray-700 hover:text-gray-800",
                                    "relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out"
                                  )}
                                >
                                  {category.name}
                                  <span
                                    className={classNames(
                                      open ? "bg-dolginsblue" : "",
                                      "absolute inset-x-0 -bottom-px z-20 h-0.5 transition duration-200 ease-out"
                                    )}
                                    aria-hidden="true"
                                  />
                                </Popover.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute inset-x-0 top-full z-40 bg-white text-sm text-gray-500">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />
                                  {/* Fake border when menu is open */}
                                  <div
                                    className="absolute inset-0 top-0 mx-auto h-px max-w-7xl px-8"
                                    aria-hidden="true"
                                  >
                                    <div
                                      className={classNames(
                                        open ? "bg-gray-200" : "bg-transparent",
                                        "h-px w-full transition-colors duration-200 ease-out"
                                      )}
                                    />
                                  </div>

                                  <div className="relative">
                                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                      <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                        {category.featured.map((item) => (
                                          <div
                                            key={item.name}
                                            className="group relative"
                                          >
                                            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md group-hover:opacity-60">
                                              <Image
                                                src={item.imageSrc}
                                                alt={item.imageAlt}
                                                className="object-cover object-center"
                                              />
                                            </div>
                                            <Link
                                              href={item.href}
                                              onClick={close}
                                              className="mt-4 flex justify-center block font-medium text-gray-900"
                                            >
                                              <span
                                                className="absolute inset-0 z-10"
                                                aria-hidden="true"
                                              />
                                              {item.name}
                                            </Link>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      ))}

                      {navigation.pages.map((page) => (
                        <Link
                          key={page.name}
                          href={page.href}
                          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </Popover.Group>
                </div>

                {/* Mobile menu and search (lg-) */}
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setOpen(true)}
                  >
                    <span className="sr-only">Open menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* Logo (lg-) */}
                <Link href="/" className="lg:hidden">
                  <span className="sr-only">Dolgin Jewelry Store</span>
                  <Image
                    src={Logo}
                    alt="Dolgins Jewelry Store in Kansas City logo"
                    className="h-8 w-auto"
                    priority
                  />
                </Link>

                <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      {/* Calll Now */}
                      <div className="hidden md:block ml-4 flow-root lg:ml-8">
                        <a
                          id="CallDesktopNavTag"
                          href="tel:9132282808"
                          className="inline-block rounded-md shadow bg-dolginsblue py-2 px-4 text-center text-white hover:bg-dolginslightblue"
                        >
                          <span className="text-sm">Call</span>
                        </a>
                        <a
                          id="TextDesktopNavTag"
                          href="sms:9132282808"
                          className="inline-block mx-4 rounded-md shadow bg-dolginsblue py-2 px-4 text-center text-white hover:bg-dolginslightblue"
                        >
                          <span className="text-sm">Text</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="hidden small:flex items-center gap-x-6 h-full"></div>

                  <Suspense
                    fallback={
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base flex gap-2"
                        href="/cart"
                        data-testid="nav-cart-link"
                      >
                        Cart (0)
                      </LocalizedClientLink>
                    }
                  >
                    <CartButton cartData={cartData} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
