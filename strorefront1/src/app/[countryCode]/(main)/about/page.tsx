import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PageHeader from "@modules/layout/components/page-header"
import History10 from "@images/history/Dolgins-Historical-Photos-10.jpg"
import History25 from "@images/history/Dolgins-Historical-Photos-25.jpg"
import History6 from "@images/history/Dolgins-Historical-Photos-6.jpg"
import History12 from "@images/history/Dolgins-Historical-Photos-12.jpg"
import History3 from "@images/history/Dolgins-Historical-Photos-3.jpg"
import History16 from "@images/history/Dolgins-Historical-Photos-16.jpg"
import History7 from "@images/history/Dolgins-Historical-Photos-7.jpg"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import Richardmary from "@images/about/richard-mary-2.jpg"
import Marsha1 from "@images/about/marsha-1.jpg"
import Marsha2 from "@images/about/marsha-2.jpg"
import Marsha3 from "@images/about/marsha-3.jpg"
import Marsha4 from "@images/about/marsha-4.jpg"
import Joseph1 from "@images/about/joseph-5.jpg"
import Joseph2 from "@images/about/joseph-2.jpg"
import Joseph3 from "@images/about/joseph-3.jpg"
import Joseph4 from "@images/about/joseph-4.jpg"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `About Dolgins Fine Jewelry | Dolgins Jewelry`,
    description:
      "Learn about me Joseph Dolgin & how my family has been helping Kansas City with jewelry for generations. See and learn about my current jewelry store in Overland Park",
  } as Metadata

  return metadata
}

const jpds = [
  {
    name: "Favorite Jewelry",
    description:
      "I proposed to my wife with a round diamond in a platinum cathedral solitaire ring. It still hits.",
  },
  {
    name: "Activity When Not Jeweling",
    description:
      "I have 3 children and a lovely wife, so everyday is an adventure. Also, I also enjoy jogging and making ice cream from scratch.",
  },
  {
    name: "Next Piece Of Jewelry",
    description:
      "Has to be an Alexandrite pinky ring. I am enamored with color change.",
  },
  {
    name: "Career Goal",
    description:
      "I want to sell a mens wedding band which features a diamond larger than the one his signigicant other wears.",
  },
]

const mls = [
  {
    name: "Favorite Jewelry",
    description:
      "I made a version our cactus core cuff bracelet, which I love.",
  },
  {
    name: "Activity When Not Jeweling",
    description:
      "Chasing goats; I have a herd of Nubian dairy goats, which I show at State Fair each year.",
  },
  {
    name: "Next Piece Of Jewelry",
    description:
      "A natured-inspired brooch to wear on my jean jacket or maybe a custom ring with my mom and grandmothers diamonds",
  },
  {
    name: "Where I Learned",
    description:
      "My first experience in jewelry-making was in high school at Shawnee Mission West. I, then, earned my degree in design from University of Kansas.",
  },
]

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
      <DolginsCTA
        title="We Want To Hear From You"
        subtitle="We Are Better In-Person."
        text="Reach out. We are excited to meet you and hear about your jewelry needs."
      />

      <div className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 py-12 px-4 sm:px-6 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet Joseph
            </h2>
            <p className="mt-4 text-gray-500">
              Joseph is the 4th generation of Dolginow's to run Dolgins Fine
              Jewelry in Kansas City. He inherited the current office from his
              dad Richard in April 2020. Joseph grew up helping clients at
              Diamond Expressions.
            </p>

            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {jpds.map((feature) => (
                <div key={feature.name} className="border-t border-gold pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <Image
              src={Joseph4}
              alt="Joseph Dolginow in the jewelry office evaluating a diamond ring."
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Joseph2}
              alt="Joseph Dolginow showing off a beautiful round diamond"
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Joseph3}
              alt="Joseph tired as he completes the Garmin Kansas City Marathon"
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Joseph1}
              alt="Joseph Dolginw with his family"
              className="rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 py-12 px-4 sm:px-6 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <Image
              src={Marsha1}
              alt="Marsha repairing some heavy equipment in the office."
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Marsha2}
              alt="Marsha setting round diamonds using a microscope."
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Marsha3}
              alt="Marsha evaluating the fit of diamonds into a gold ring mounting"
              className="rounded-lg bg-gray-100"
            />
            <Image
              src={Marsha4}
              alt="Marsha preparing a goat for Missouri State Fair"
              className="rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet Marsha
            </h2>
            <p className="mt-4 text-gray-500">
              Marsha has over 40 years experience on the bench. She began her
              career at Dolgin's in the late 1970s. She continues to hone her
              craft today and is always excited to make the next piece.
            </p>

            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {mls.map((feature) => (
                <div key={feature.name} className="border-t border-gold pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}

export default About
