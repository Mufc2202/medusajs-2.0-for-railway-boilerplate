import { Metadata } from "next"
import PageHeader from "@modules/layout/components/page-header"
import Image from "next/image"
import DolginsCTA from "@modules/layout/components/dolgins-cta"
import diamondtorch from "/src/images/about/diamond-torch.jpg"
import tools1 from "/src/images/about/Tools-1.jpg"
import tools2 from "/src/images/about/Tools-2.jpg"
import tools3 from "/src/images/about/Tools-3.jpg"
import tools4 from "/src/images/about/Tools-4.jpg"
import tools5 from "/src/images/about/Tools-5.jpg"
import tools6 from "/src/images/about/Tools-6.jpg"

const posts = [
  {
    title: "Laser Welder",
    href: "#",
    category: { name: "Jewelry-Making" },
    description:
      "We do solder still but welding allows us to use harden wire for a stronger joint. Laser welders have changed jewelry-making when they were introduced. Ours works hard.",
    imageUrl: tools1,
    alt: "Laser welder smoking some silver from a ring.",
  },
  {
    title: "Diamond Scale",
    href: "#",
    category: { name: "Gemological" },
    description:
      "We have modern diamond scales, but this one has been with us for 4 generations. The original weights are still its drawer and the scale features cigarette burns from that bygone era.",
    imageUrl: tools5,
    alt: "Diamond scale from the 1930s with cigarette burns, my grandfathers tweezers, and a beautiful engagement ring.",
  },
  {
    title: "3D Printer",
    category: { name: "Jewelry Design" },
    description:
      "3D printing allows you to visualize and wear the custom jewelry we create. It ensures we get the piece right: from the minute details to the major ones.",
    imageUrl: tools6,
    alt: "3D printed engagement rings before they have been cleaned and viewed.",
  },
  {
    title: "Bench Scope",
    category: { name: "Jewelry-Making" },
    description:
      "Petit and delicate jewelry has grown in popularity over the passed 20 years. Setting those small diamonds and gemstones takes specialized equipment including this scope.",
    imageUrl: tools2,
    alt: "Benchscope set up waiting to set some small accent diamonds known as melee.",
  },
  {
    title: "Steam Cleaner",
    category: { name: "Jewelry-Making" },
    description:
      "The steam cleaner is the final step to get jewelry looking perfectly bright. The pressure from the steam blasts grime away leaving the diamonds and metal to shine.",
    imageUrl: tools3,
    alt: "Steam blasting some grime from an engagement ring.",
  },
  {
    title: "Lab Grown Diamond Tester",
    category: { name: "Gemological" },
    description:
      "Lab grown diamonds are becoming more common. To tell them apart, I use a tool which analyzes how diamonds reflect shortwave and longwave UV light.",
    imageUrl: tools4,
    alt: "Testing whether a diamond was earth-created or lab-grown.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: `Dolgin's Jewelry Store Tour | Dolgins Jewelry`,
    description:
      "Dolgin's is a unique jewelry store located in an office in Overland Park, KS. Tour our office to see where we design and craft fine jewelry & engagement rings in our small but well equipped jewelry studio.",
  } as Metadata

  return metadata
}

export function Tour() {
  return (
    <section>
      <PageHeader
        name="Tour Our Office"
        subtitle="A Unique Jewelry Studio"
        tidbit="The Dolgin's office is setup as a space to design, craft, and sell fine gold and platinum jewelry complete with a diamond and gemstone lab. We have all the necessary (and a few unnecessary) tools. Our office is low key, comfortable, personal, and secure."
      />
      <section>
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1675113558236!6m8!1m7!1sCAoSLEFGMVFpcFBCY3BiakhNV0FsdzBYYVFacEdvaW1YNzNFR1dFY3F1TnhDN091!2m2!1d38.912421628701!2d-94.642002234998!3f52.1999130718467!4f-4.793720528529889!5f0.7820865974627469"
          className="object-center mx-auto"
          width="600"
          height="450"
          loading="lazy"
        ></iframe>
      </section>
      <DolginsCTA
        title="Please reach out"
        subtitle="Our office is setup to create and repair fine jewelry."
        text="Thank you for touring - now come see us in person. We are located inside the US Bank Building."
      />
      <div className="relative bg-dolginsblue px-6 pt-8 pb-20 lg:px-8 lg:pt-8 lg:pb-28">
        <div className="absolute inset-0">
          <div className="h-1/3 bg-white sm:h-2/3" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div id="tools" className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Equipment Highlights
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4 border-b-gold border-b-2">
              At Dolgins, we love our jewelry-making, design, and gemological
              tools and use them everyday. Here are a few highlights of what we
              have and why.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.title}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0">
                  <Image className="" src={post.imageUrl} alt={post.alt} />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dolginsblue">
                      {post.category.name}
                    </p>
                    <div className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tour
