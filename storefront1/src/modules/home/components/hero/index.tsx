import Link from "next/link"
import Image from "next/image"
import CustomRing from "@images/index/custom-engagement-ring.jpg"
import TestimonialPhoto from "@images/index/testimonial-2.jpg"
import Repair from "@images/index/repairing.jpg"
import JPD from "@images/index/JPD-RingBox.jpg"
import Front1 from "@images/index/Front-rings-1.jpg"
import Front2 from "@images/index/Front-rings-2.jpg"
import Front3 from "@images/index/Front-rings-3.jpg"
import Front4 from "@images/index/Front-rings-4.jpg"
import Front5 from "@images/index/Front-rings-5.jpg"
import Front6 from "@images/index/Front-rings-6.jpg"
import Front7 from "@images/index/Front-rings-7.jpg"

const Hero = () => {
  return (
    <main>
      <section>
        <div className="grid grid-cols-4 grid-rows-1 gap-2 md:gap-6 px-8 py-4">
          <div
            className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
            aria-hidden="true"
          >
            <div
              className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-dolginslightblue to-gold opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="pt-16 md:pt-32">
            <Image
              src={Front7}
              alt="Round diamond engagement ring with side round brilliant diamonds graded by GIA"
              className="rounded-md shadow-xl shadow-gold"
              priority
            />
          </div>
          <div className="pt-2">
            <Image
              src={Front3}
              alt="Purple sapphire ring set in a rose gold with a round brilliant diamond halo"
              className="rounded-md shadow-xl shadow-gold"
              priority
            />
            <Image
              src={Front2}
              alt="Lab-grown elongated cushion cut diamond set in a rose gold solitaire engagement ring"
              className="rounded-md shadow-xl shadow-gold pt-4"
              priority
            />
          </div>
          <div className="pt-10">
            <Image
              src={Front5}
              alt="Emerald cut gallery-style eternity band set in platinum"
              className="rounded-md shadow-xl shadow-gold"
              priority
            />
            <Image
              src={Front4}
              alt="Oval ruby ring set in a graduated halo of round brilliant diamonds set in platinum"
              className="rounded-md shadow-xl shadow-gold pt-4"
              priority
            />
          </div>
          <div className="pt-4">
            <Image
              src={Front6}
              alt="Blue sapphire 3 stone ring set with round diamonds in platinum with a fluted shank"
              className="rounded-md shadow-xl shadow-gold"
              priority
            />
            <Image
              src={Front1}
              alt="Marquise diamond wide band custom-made bezel set in platinum"
              className="rounded-md shadow-xl shadow-gold pt-4"
              priority
            />
          </div>
        </div>
      </section>

      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <div className="absolute inset-auto h-36 w-96 scale-150 bg-gold opacity-20 blur-3xl"></div>
        <div className="absolute inset-auto h-36 w-96 translate-x-full scale-150 bg-dolginsblue opacity-20 blur-3xl"></div>
        <div className="w-full">
          <div className="px-10 flex flex-row gap-2 items-center">
            <div className="basis-2/3">
              <h1 className="text-5xl font-serif font-gold tracking-tight border-b-2 border-gold pb-2">
                Welcome
              </h1>
              <p className="mt-5">
                Kansas City has trusted Dolgins to design, create, craft, sell,
                buy, repair, and appraise the jewelry that marks and celebrates
                beautiful moments and relationships. In our jewelry store, we
                work with fine materials including diamonds, gold, platinum, and
                precious gemstones. Throughout our 4 generations, Dolgins has
                always taken pride in our work and the jewelry create.
              </p>
            </div>
            <div className="basis-1/3">
              <Image
                src={JPD}
                alt="Dolgins Jewelry Store Owner Joseph Dolginow holding a gold and diamond engagement ring in a jewelry box"
                className="place-self-center rounded-md shadow-xl shadow-gold"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Hero
