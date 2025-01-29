import Image from "next/image"
import ImageCTA from "@images/cta.jpg"

const DolginsCTA = ({
  title = "Please Reach Out",
  imageSrc = ImageCTA,
  subtitle = "Excited To Help You",
  imageAlt = "Custom gold and diamond cross ring on the jewelers bench",
  text = "At Dolgins Jewelry, we look forward to working with you. A call is great, but a text is best. Talk to you soon.",
}) => {
  return (
    <div className="relative bg-dolginsblue m-8 rounded-lg">
      <div className="relative h-80 overflow-hidden bg-dolginsblue md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2 rounded-lg">
        <Image
          alt={imageAlt}
          src={imageSrc}
          className="size-full object-cover sepia"
        />
      </div>
      <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40 rounded-lg">
        <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
          <h2 className="text-base/7 font-semibold text-gold">{title}</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {subtitle}
          </p>
          <p className="mt-6 text-base/7 text-gray-300">{text}</p>
          <div className="mt-8">
            <a
              href="sms:9132282808"
              className="inline-flex rounded-md bg-white/30 px-3.5 py-2.5 text-xlg font-semibold text-white shadow-sm hover:bg-dolginslightblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Text
            </a>

            <a
              href="mailto:joseph@dolgins.com"
              className="inline-flex rounded-md bg-white/30 px-3.5 ml-4 py-2.5 text-xlg font-semibold text-white shadow-sm hover:bg-dolginslightblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Email
            </a>
            <a
              href="tel:9132282808"
              className="inline-flex rounded-md bg-white/30 px-3.5 ml-4 py-2.5 text-xlg font-semibold text-white shadow-sm hover:bg-dolginslightblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DolginsCTA
