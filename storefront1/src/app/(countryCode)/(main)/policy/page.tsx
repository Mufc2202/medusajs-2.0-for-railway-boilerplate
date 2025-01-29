import { Metadata } from "next"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Terms & Conditions & Store Policies - Dolgins Fine Jewelry Store`,
    description:
      "Terms & Conditions & Store PoliciesStore policies, terms, and conditions for Dolgin's Jewelry store in Overland Park, Kansas. Contact us for more details.",
  } as Metadata

  return metadata
}

export function Contact() {
  return (
    <main>
      <PageHeader
        name="Store Policies"
        subtitle="Terms, Conditions, Etc."
        tidbit="At Dolgins, we are small independent jeweler who aims to please.
              Here is some basic information on how we operate."
      />
      <section className="mx-auto max-w-3xl text-base leading-7">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shipping
        </h2>
        <p className="mt-6 text-xl leading-8">
          Dolgins has many clients who do not live within driving distance. We
          are capable of shipping our fine jewelry anywhere within the United
          States. We mostly ship via Fedex or USPS though do use other carriers
          too. All our jewelry is shipped insured through{" "}
          <a
            className="text-dolginslightblue"
            href="https://jewelersmutual.com"
          >
            Jewelers Mutual
          </a>
          . Someone over the age of 21 will have to sign for it.
        </p>
        <p className="mt-6 text-xl leading-8">
          The price of shipping varies from $50 to many thousands. We coordinate
          shipping when your jewelry is ready. And shipping is never free though
          some stores include it in the price.
        </p>
      </section>
      <DolginsCTA
        title="Want To Know ..."
        subtitle="Ask Us Your Question"
        text="We will work with you in a cordial manner to resolve any issue fairly. Do not hesitate to reach out."
      />
      <section className="mx-auto max-w-3xl text-base leading-7">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Returns
        </h2>
        <p className="mt-6 text-xl leading-8">
          At Dolgins, we love jewelry and want you to love yours. We accept
          returns and usually discuss the terms during the purchase because each
          case is unique. Often, we care more about executing someone's gesture
          or thought than getting the exact piece correct. In those
          circumstances, we want the surprise and can figure out the perfect
          piece later.
        </p>
        <p className="mt-6 text-xl leading-8">
          Dolgins is NOT a corporate entity either. While we do not want to be
          abused, we also know not all returns can happen within 30 days. We are
          happy to work reasonably and honestly.
        </p>
      </section>
    </main>
  )
}

export default Contact
