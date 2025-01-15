import Image from "next/image"
import Link from "next/link"
import PageHeader from "@modules/layout/components/page-header"
import History10 from "/src/images/history/Dolgins-Historical-Photos-10.jpg"
import History25 from "/src/images/history/Dolgins-Historical-Photos-25.jpg"
import History6 from "/src/images/history/Dolgins-Historical-Photos-6.jpg"
import History12 from "/src/images/history/Dolgins-Historical-Photos-12.jpg"
import History3 from "/src/images/history/Dolgins-Historical-Photos-3.jpg"
import History16 from "/src/images/history/Dolgins-Historical-Photos-16.jpg"
import History7 from "/src/images/history/Dolgins-Historical-Photos-7.jpg"

export function About() {
  return (
    <main>
      <PageHeader
        name="About"
        subtitle="Know Your Jeweler"
        tidbit="At Dolgins, we are small independent jeweler who aims to please. Here is some basic information on how we operate."
      />
      <div className="relative overflow-hidden bg-white">
        <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="font text-4xl font-bold border-b-gold border-b-2 pb-3 tracking-tight text-dolginsblue sm:text-6xl">
                Dolgin's History
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                For four generations, the Dolginow family has run jewelry stores
                in Kansas City. See a timeline and photos of our different
                stores and offices.
              </p>
            </div>
            <div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <Image
                            src={History6}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History12}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History16}
                            alt=""
                            className="h-full w-full object-scale-down object-bottom"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History3}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History7}
                            alt=""
                            className="h-full w-full object-scale-down object-top"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History25}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <Image
                            src={History10}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/about/history"
                  className="inline-block rounded-md border border-transparent bg-dolginsblue py-3 px-8 text-center font-medium text-white hover:bg-dolginslightblue"
                >
                  Learn About Our History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default About
