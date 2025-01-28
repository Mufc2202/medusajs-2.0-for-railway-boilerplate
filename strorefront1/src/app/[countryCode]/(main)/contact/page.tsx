import { Metadata } from "next"
import Testimonial from "@modules/layout/components/testimonial"
import PageHeader from "@modules/layout/components/page-header"
import DolginsCTA from "@modules/layout/components/dolgins-cta"

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Contact US - Dolgins Fine Jewelry Store`,
    description:
      "Contact information for Dolgin's Jewelry store including office address, phone (913) 228-2808, text, and email.",
  } as Metadata

  return metadata
}

export function Contact() {
  return (
    <main>
      <PageHeader
        name="Contact Dolgins"
        subtitle="Best To Text Or Email"
        tidbit="We are excited to discuss jewelry with you. E-mails or texts are
                best; however, we will respond. Below is our office location as
                well. Please make an appointment."
      />
      <section className="lg:relative">
        <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
          <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
            <h1 className="text-4xl font-bold tracking-tight text-center text-dolginsblue sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">Visit Our Office</span>{" "}
              <span className="block text-dolginslightblue xl:inline">
                For Fine Jewelry
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-center text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              Dolgins Jewelry is located inside the US Bank Building in
              Hawthorne Plaza one block west of Roe and on the south side of
              119th street. We do{" "}
              <span className="text-gray-900">
                not have a sign or a storefront
              </span>{" "}
              but operate in a small and personable office.
            </p>
            <div className="mt-10 sm:flex justify-center">
              <div className="rounded-md shadow bg-dolginsblue text-white hover:bg-dolginslightblue">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md bg-dolginsblue px-8 py-3 text-base font-medium text-white hover:bg-dolginslightblue md:py-4 md:px-10 md:text-lg"
                >
                  Tour
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="https://g.page/dolginsjewelry?share"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-dolginsblue px-8 py-3 text-base font-medium text-white hover:bg-dolginslightblue md:py-4 md:px-10 md:text-lg"
                >
                  Find On Google
                </a>
              </div>
            </div>
            <div className="mt-10 divide-y-2 divide-gold flex-col flex items-center">
              <div>
                <a>913-228-2808</a>
              </div>
              <div className="my-3 pt-2">
                <a>joseph@dolgins.com</a>
              </div>
              <div className="pt-2 mb-3">
                <a>
                  4901 W 119th St, Ste 200
                  <br />
                  Overland Park, KS 66209
                </a>
              </div>
              <div className="pt-2 text-center">
                <a>
                  Tuesday - Friday 11 to 6<br />
                  Saturday 9:30 to 12
                  <br />
                  Sunday - Monday Closed
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <iframe
            loading="lazy"
            height="100%"
            width="100%"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.508640340237!2d-94.64430664919878!3d38.912350279468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0e9f436f40f85%3A0x52f14696bec29e04!2sDolgin&#39;s%20Fine%20Jewelry!5e0!3m2!1sen!2sus!4v1667594899794!5m2!1sen!2sus"
          ></iframe>
        </div>
      </section>
      <DolginsCTA />
    </main>
  )
}

export default Contact
