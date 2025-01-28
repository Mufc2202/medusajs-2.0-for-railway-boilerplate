import { Metadata } from "next"
import Image from "next/image"
import PageHeader from "@modules/layout/components/page-header"
import History1 from "@images/history/Dolgins-Historical-Photos-1.jpg"
import History2 from "@images/history/Dolgins-Historical-Photos-2.jpg"
import History3 from "@images/history/Dolgins-Historical-Photos-3.jpg"
import History4 from "@images/history/Dolgins-Historical-Photos-4.jpg"
import History5 from "@images/history/Dolgins-Historical-Photos-5.jpg"
import History7 from "@images/history/Dolgins-Historical-Photos-7.jpg"
import History8 from "@images/history/Dolgins-Historical-Photos-8.jpg"
import History9 from "@images/history/Dolgins-Historical-Photos-9.jpg"
import History10 from "@images/history/Dolgins-Historical-Photos-10.jpg"
import History11 from "@images/history/Dolgins-Historical-Photos-11.jpg"
import History12 from "@images/history/Dolgins-Historical-Photos-12.jpg"
import History14 from "@images/history/Dolgins-Historical-Photos-14.jpg"
import History15 from "@images/history/Dolgins-Historical-Photos-15.jpg"
import History16 from "@images/history/Dolgins-Historical-Photos-16.jpg"
import History17 from "@images/history/Dolgins-Historical-Photos-17.jpg"
import History18 from "@images/history/Dolgins-Historical-Photos-18.jpg"
import History19 from "@images/history/Dolgins-Historical-Photos-19.jpg"
import History20 from "@images/history/Dolgins-Historical-Photos-20.jpg"
import History21 from "@images/history/Dolgins-Historical-Photos-21.jpg"
import History22 from "@images/history/Dolgins-Historical-Photos-22.jpg"
import History23 from "@images/history/Dolgins-Historical-Photos-23.jpg"
import History24 from "@images/history/Dolgins-Historical-Photos-24.jpg"
import History25 from "@images/history/Dolgins-Historical-Photos-25.jpg"
import History26 from "@images/history/Dolgins-Historical-Photos-26.jpg"
import History27 from "@images/history/Dolgins-Historical-Photos-27.jpg"
import History28 from "@images/history/Dolgins-Historical-Photos-28.jpg"
import History29 from "@images/history/Dolgins-Historical-Photos-29.jpg"
import History30 from "@images/history/Dolgins-Historical-Photos-30.jpg"
import History31 from "@images/history/Dolgins-Historical-Photos-31.svg"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Dolgin's History | Dolgins Jewelry`,
    description:
      "For generations, the Dolginow family has helped Kansas City and beyond with fine jewelry including diamond engagement rings. See pictures from our past stores including our large catalog showrooms.",
  } as Metadata

  return metadata
}

export function History() {
  return (
    <div>
      <PageHeader
        name="Dolgins History"
        subtitle="We Go Back"
        tidbit="The Dolginow family has operated Dolgins on varies scales and in
              different locations in and around Kansas City."
      />
      <section className="dark:bg-white dark:dolginsblue">
        <div className="container max-w-5xl px-4 py-12 mx-auto">
          <div className="grid gap-4 mx-4 sm:grid-cols-12">
            <div className="relative col-span-12 px-4 space-y-6 sm:col-span-9">
              <div className="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gold">
                <div className="flex flex-col grow sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Starting Out
                  </h3>
                  <time className="text-xs tracking-wide dark:text-dolginslightblue">
                    1920s
                  </time>
                  <p className="mt-3">
                    Dolgins began as a small pawn shop in downtown Kansas City
                    in the 1920s with Louis Dolginow running the operation.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History15}
                        alt="Louis Dolginow and family at the pawnshop in downtown Kansas City."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History16}
                        alt="Inside the pawnshop of the Dolginow family in the 1930s."
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    David Takes Over
                  </h3>
                  <time className="text-xs tracking-wide dark:text-dolginslightblue">
                    1930s
                  </time>
                  <p className="mt-3">
                    David Dolgins joins the family business with a vision and
                    motivation for expansion.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History3}
                        alt="David Dolginow in front of a register at North Kansas City Dolgins store in the 1950s."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History14}
                        alt="David Dolginow's business card in the 1950s"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Moving to NKC
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Mar 1966
                  </time>
                  <p className="mt-3">
                    After decades of operating in downtown Kansas City, David
                    and his wife Dolly move Dolgins to North Kansas City and
                    move beyond the pawn model.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History24}
                        alt="Richard Dolginow's Dolgins business card"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History17}
                        alt="Dolgins store at 1000 Burlington Ave"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History12}
                        alt="Dolgins Catalog from the 1970s"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Expanding Dolgins
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Mar 1975
                  </time>
                  <p className="mt-3">
                    With the success of the North Kansas City store, Dolgins
                    expands the catalog operation and begins opening more
                    locations. Yale and Richard Dolginow take over from David
                    and Dolly.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History2}
                        alt="Yale, Dolly, and Richard Dolginow planning a new Dolgins location."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History4}
                        alt="Dolgins announcement of new location in Johnson County."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History9}
                        alt="Dolgins parking lot from the 1970s"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Marsha Joins
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    1977
                  </time>
                  <p className="mt-3">
                    Marsha Loveland joins Dolgins as a jeweler apprentice after
                    completing her coursework at University of Kansas. She
                    apprentices for two years gaining valuable bench
                    jewelry-making experience.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History10}
                        alt="Marsha at the bench in the Dolgins Shop."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History11}
                        alt="Dolgins jewelry shop in North Kansas City on Halloween."
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Selling The Catalog Showroom
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Feb 1980
                  </time>
                  <p className="mt-3">
                    Ready for a new chapter, the Dolginow family sells their
                    stake in catalog showroom to Best Products.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History26}
                        alt="Listing of Dolgins stores when Dolgins was sold"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History25}
                        alt="Dolgins catalog from the 1980s"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History18}
                        alt="Sign featuring found David Dolginow"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    D Jewels at The Elms
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    May 1980
                  </time>
                  <p className="mt-3">
                    Richard Dolginow opens a small boutique jewelry store in the
                    lobby of the Elms hotel.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History19}
                        alt="Front door where the jewelry shop at the Elms was located."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History20}
                        alt="Inside and showroom on the Elms Hotel Jewelry boutique"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History21}
                        alt="Vault custom painted from the Elms shop"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History5}
                        alt="D Jewels in the Elms Hotel Logo"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Back To Johnson County
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Sept 1988
                  </time>
                  <p className="mt-3">
                    Richard Dolginow brings Dolgins back to Overland Park by
                    opening up a custom jewelry office in Windmill office park.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History30}
                        alt="Jewelry shop of Diamond Expressions in the late 1980s featuring Tim Gwen, master jeweler"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Storefront In Regency Park
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Aug 1992
                  </time>
                  <p className="mt-3">
                    Richard expands beyond custom jewelry into a storefront with
                    Diamond Expressions in Regency Park in Overland Park selling
                    and crafting fine jewelry.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History28}
                        alt="Sign of Diamond Expressions in the 1990s"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History23}
                        alt="Front sign of Diamond Expressions"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History7}
                        alt="Diamond Expressions business card and logo"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    From Diamond Expression To Dolgins
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Jul 2005
                  </time>
                  <p className="mt-3">
                    Naming rights to Dolgins become available again, and Diamond
                    Expressions becomes Dolgins again.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History29}
                        alt="Expanded showroom photo of Dolgins Diamond Center"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History8}
                        alt="Logo after changing the name from Diamond Expressions to Dolgins."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History27}
                        alt="Photo of the storeroom at Diamond Expressions"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Moving To An Office
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Aug 2009
                  </time>
                  <p className="mt-3">
                    Richard moves from a storefront back to an office focusing
                    on custom jewelry.
                  </p>
                  <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History22}
                        alt="Richard Dolginow evaluating a diamond."
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History1}
                        alt="Richard Dolginow evaluating a necklace"
                      />
                    </li>
                    <li>
                      <Image
                        className="mx-auto w-auto h-30 lg:h-36 object-scale-down"
                        src={History31}
                        alt="Richard Dolgin Private Jeweler logo"
                      />
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    Joining The Business
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    Aug 2012
                  </time>
                  <p className="mt-3">
                    Joseph Dolginow, the fourth generation Dolginow, joins
                    Richard full-time in the custom jewelry office.
                  </p>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-gold">
                  <h3 className="text-xl font-semibold tracking-wide">
                    4th Generation Take Over
                  </h3>
                  <time className="text-xs tracking-wide uppercase dark:text-dolginslightblue">
                    April 2020
                  </time>
                  <p className="mt-3">
                    Joseph Dolginow takes over for Richard and continues the
                    family tradition focusing on fine custom jewelry, beautiful
                    diamonds, and engagement rings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default History
