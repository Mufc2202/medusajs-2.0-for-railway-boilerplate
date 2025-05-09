import { FetchPricingData } from "./shape-selector-server"
import Round from "@images/diamond/DiamondShapes/round.svg"
import Oval from "@images/diamond/DiamondShapes/oval.svg"
import Pear from "@images/diamond/DiamondShapes/pear.svg"
import Princess from "@images/diamond/DiamondShapes/princess.svg"
import Marquise from "@images/diamond/DiamondShapes/marquise.svg"
import Heart from "@images/diamond/DiamondShapes/heart.svg"
import Emerald from "@images/diamond/DiamondShapes/emerald.svg"
import Radiant from "@images/diamond/DiamondShapes/radiant.svg"
import Cushion from "@images/diamond/DiamondShapes/cushion.svg"
import Asscher from "@images/diamond/DiamondShapes/asscher.svg"

export interface DiamondShape {
  name: string
  keyword: string
  imageSrc: any
  imageAlt: string
  description: string
  category_id: string[]
}

const diamondShapes = [
  {
    name: "Round",
    keyword: "round",
    imageSrc: Round,
    imageAlt: "Round diamond",
    description: "The most popular shape, known for its brilliance and fire.",
    category_id: ["pcat_01JHB1PYWAQMXN7WJ9S1VZ136W"],
  },
  {
    name: "Oval",
    keyword: "oval",
    imageSrc: Oval,
    imageAlt: "Oval diamond",
    description: "A classic and elegant shape, known for its timeless appeal.",
    category_id: ["pcat_01JHB1SNZ3240RDX7366VWS3AT"],
  },
  {
    name: "Pear",
    keyword: "pear",
    imageSrc: Pear,
    imageAlt: "Pear diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1WHHKJM5R45PAJMPEJH5Q"],
  },
  {
    name: "Princess",
    keyword: "princess",
    imageSrc: Princess,
    imageAlt: "Princess diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1VXWGDP3QACAHS11E67WT"],
  },
  {
    name: "Radiant",
    keyword: "radiant",
    imageSrc: Radiant,
    imageAlt: "Radiant diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1Y15SZ5R2YCGYF25K2Q7J"],
  },
  {
    name: "Marquise",
    keyword: "marquise",
    imageSrc: Marquise,
    imageAlt: "Marquise diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1R0JBWNC5GRFX61NP67ZY"],
  },
  {
    name: "Heart",
    keyword: "heart",
    imageSrc: Heart,
    imageAlt: "Heart diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1VBMGPV3EY1G9YNNGCZKB"],
  },
  {
    name: "Emerald",
    keyword: "emerald",
    imageSrc: Emerald,
    imageAlt: "Emerald diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1X63CV7CJYFQ1G44SBYNK"],
  },
  {
    name: "Cushion",
    keyword: "cushion",
    imageSrc: Cushion,
    imageAlt: "Cushion Shaped diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1VBMGPV3EY1G9YNNGCZKB"],
  },
  {
    name: "Asscher",
    keyword: "asscher",
    imageSrc: Asscher,
    imageAlt: "Asscher diamond",
    description:
      "A modern and sophisticated shape, known for its unique design.",
    category_id: ["pcat_01JHB1X63CV7CJYFQ1G44SBYNK"],
  },
]

interface PriceData {
  size: string
  prices: {
    best: string | null
    better: string | null
    good: string | null
    lab: string | null
  }
  link: string | null
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

async function handleShapeSelect(formData: FormData) {
  "use server"
  const shapeName = formData.get("shape")
  const shape =
    diamondShapes.find((s) => s.name === shapeName) || diamondShapes[0]
  const priceData = await FetchPricingData(shape)
  return { shape, priceData }
}

export default function PricingTable() {
  let selectedShape = diamondShapes[0]
  let priceData: PriceData[] = []

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <form action={handleShapeSelect}>
        <select
          name="shape"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          defaultValue={selectedShape.name}
          onChange={(e) => e.target.form?.requestSubmit()}
        >
          {diamondShapes.map((shape) => (
            <option key={shape.name} value={shape.name}>
              {shape.name}
            </option>
          ))}
        </select>
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      <div className="mt-4 w-full max-w-4xl rounded-lg bg-dolginsblue p-4">
        <table className="w-full text-white">
          <caption className="mb-4 text-lg font-semibold">
            Estimated {selectedShape.name} Diamond Prices
            <p className="mt-2 text-sm text-white/80">
              {selectedShape.description}
            </p>
          </caption>
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Highest Quality</th>
              <th className="px-4 py-2 text-left">Great Quality & Value</th>
              <th className="px-4 py-2 text-left">Love That Size</th>
              <th className="px-4 py-2 text-left">Laboratory Created</th>
              <th className="px-4 py-2 text-left">Link</th>
            </tr>
          </thead>
          <tbody>
            {priceData.map((row: PriceData, index: number) => (
              <tr
                key={row.size}
                className={`border-b border-white/10 ${
                  index % 2 === 0 ? "bg-white/5" : ""
                }`}
              >
                <td className="px-4 py-2 text-center">{row.size}</td>
                <td className="px-4 py-2 text-center">
                  {row.prices.best || "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {row.prices.better || "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {row.prices.good || "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {row.prices.lab || "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {row.link ? (
                    <a
                      href={row.link}
                      className="text-blue-500 hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { PricingTable }
