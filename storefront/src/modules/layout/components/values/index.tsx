import Image from "next/image"
import DesignedByYou from "/src/images/values/DesignedByYou.svg"
import SoldWithIntegrity from "/src/images/values/SoldWithIntegrity.svg"
import CraftedToWear from "/src/images/values/CraftedToWear.svg"

const features = [
  {
    name: "Designed By You",
    description:
      "Our specialty is custom-crafting unique pieces for you around meaningful diamonds or unique gemstones.",
    icon: DesignedByYou,
    alt: "Icon of different diamond or gemstones in the design process",
  },
  {
    name: "Sold With Integrity",
    description:
      "Every piece of Dolgins jewelry is sold with integrity. We are a family-owned and trusted business for 4 generations.",
    icon: SoldWithIntegrity,
    alt: "Two people feeling comfortable with their jewelry purchase",
  },
  {
    name: "Crafted With Care",
    description:
      "Our jewelry is crafted with expertise and high standards to stand up to every day and every part of your life.",
    icon: CraftedToWear,
    alt: "Jewelry made to wear while gardening because Dolgins believes jewelry is meant to be worn",
  },
]

export default function Values() {
  return (
    <section className="bg-white py-10 mt-3 mb-3 border-gold border-2">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Dolgins Jewelry Store Values</h2>
        <dl className="space-y-10 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {features.map((feature) => (
            <div key={feature.name}>
              <dt>
                <Image
                  src={feature.icon}
                  alt={feature.alt}
                  className="max-h-28"
                />
                <p className="mt-5 text-lg text-center font-medium leading-6 text-gray-900">
                  {feature.name}
                </p>
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
