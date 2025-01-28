import { Metadata } from "next"
import Image from "next/image"
import PageHeader from "@modules/layout/components/page-header"
import GIAReport from "@images/repairs/Dolgins-Jewelry-Example-GIA-Report.jpg"
import AppraisalExample from "@images/repairs/Dolgins-Jewelry-Example-Appraisal.jpg"
import DolginsCTA from "@modules/layout/components/dolgins-cta"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Insurance Appraisals For Jewelry | Dolgins Jewelry`,
    description:
      "As a gemologist, I appraise jewelry, diamonds, and engagement rings for insurance purposes for Kansas City from my Overland Park Jewelry store using GIA standards.",
  } as Metadata

  return metadata
}

const benefits = [
  "Replacement Cost",
  "Likihood of Going Missing",
  "Yearly Cost of Insurance",
  "Uniqueness of Particular Piece",
]

export function Appraisals() {
  return (
    <main>
      <PageHeader
        name="Jewelry Insurance Appraisals"
        subtitle="Love It But Insure It"
        tidbit="Using my decades of experience and following GIA standards, I
              appraise jewelry including wedding & engagement rings and diamonds
              for insurance purposes for Kansas City from my Overland Park
              jewelry store."
      />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-4 lg:px-8 sm:px-6">
          <div className="mx-auto max-w-3xlx">
            <div>
              <p className="text-md text-gray-500">
                An up-to-date jewelry appraisal is an important document used to
                establish the value of your diamonds, watches, antique jewelry,
                or other fine items. Most of the appraisal I do are for
                insurance companies, so that the piece can be added to an
                insurance policy. In the unfortunate event that the piece is
                stolen, broken, or lost, this appraisal will identify the piece
                and state its value, so it can be fairly replaced. In addition
                to insurance appraisals, families and lawyers often request
                jewelry appraisals for estate planning, or to divide jewelry on
                an equal basis.
              </p>
              <p className="mt-4 text-md text-gray-500">
                I have extensive experience as a jeweler and gemologist in the
                jewelry industry and, using that experience, can appraise any
                piece of jewelry including rare antique jewelry pieces. In the
                privacy of my Overland Park office, we can discuss your
                appraisal needs and get them accomplished. My appraisals include
                a complete description of the piece including important
                attributes about the gemstones, and an established value. A
                photo is especially important to any appraisal. If you lose your
                jewelry, having a quality photo of it allows for much easier
                replacement. Once I have appraised a piece, I will update that
                appraisal upon request and when the value has significantly
                changed.
              </p>
              <p className="mt-4 text-md text-gray-500">
                In addition, appraisals are included with most every piece of
                jewelry I sell. If you recently purchased an engagement ring and
                did not receive an appraisal, require it from your jeweler at{" "}
                <strong>no charge</strong>. I can appraise it for you, but that
                should be included in your purchase. Typically, jewelry valued
                under $1,000 is not appraised; I will advise you if I do not
                believe your item needs to be appraised.
              </p>
              <p className="mt-4 text-md text-gray-500">
                The price for appraisals varies by piece and depends on factors
                including if you having other work completed on your items, if
                you or I have an old appraisal, the number of items you have,
                and how complicated each item is to appraise. For one basic
                piece of jewelry, I charge $125, which includes a complete,
                professional cleaning.
              </p>
            </div>
          </div>
          <section className="mx-auto flex flex-row flex-wrap justify-center gap-x-1 gap-y-1 items-center">
            <Image
              src={AppraisalExample}
              className="max-w-sm"
              alt="Example of a Dolgins jewelry for Mr. Homer Simpson"
            />
            <Image
              src={GIAReport}
              className="max-w-sm"
              alt="Example of a GIA grading report for a roundd diamond"
            />
          </section>

          <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-base/7 font-semibold text-dolginsblue">
                Do I need to Insure It?
              </p>
              <h2 className="mt-2 text-5xl font-semibold tracking-tight text-dolginslightblue sm:text-7xl">
                When To Insure
              </h2>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                There are quite a few factor you should consider when deciding
                if you want to insure piece of jewelry:
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base/7 text-gray-500 sm:grid-cols-2 justify-items-center"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-7 w-5 flex-none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                I personally insure all jewelry that I own with a replacement
                cost over $1,000. However, these insurance policies are
                complicated with different companies offering different coverage
                and different claims management.
              </p>
            </div>
          </div>
        </div>
        <DolginsCTA
          title="Let's Talk Insurance"
          subtitle="Jewelry Insurance Questions?"
          text="Let me help you answer the questions and can guide you through not only what you will need to insure your piece but also what coverage is best."
        />
      </div>
    </main>
  )
}

export default Appraisals
