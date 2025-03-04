import Link from "next/link"
import Image from "next/image"
import Logo from "@images/logos/logotag-text-blue-symbol-color.svg"
import Values from "@modules/layout/components/values"

export default function Footer() {
  return (
    <footer className="bg-white py-4 px-4 sm:px-6 lg:px-8">
      <Values />
      <div className="hero container max-w-screen-lg mx-auto pb-10 flex justify-center">
        <Link href="/">
          <Image
            src={Logo}
            className="w-64"
            alt="Dolgins Logo With Fine Jewelry Tag"
          />
        </Link>
      </div>
      <div className="mx-auto max-w-7xl overflow-hidden">
        <nav aria-label="Footer">
          <div className="flex mx-auto flex-wrap justify-center place-items-center">
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/store"
            >
              Jewelry
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/t/custom-jewelry"
            >
              Custom-Make
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/buying-jewelry"
            >
              Buying Jewelry/Gold
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/t/jewelry-repair"
            >
              Jewelry Repair
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/blogs"
            >
              Blog
            </Link>
            <Link
              className="text-lg text-dolginsblue h-14 mx-2 hover:text-gray-900"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </nav>
        <p className="mt-2 text-center text-sm text-gray-900">
          &copy; {new Date().getFullYear()} Joseph Dolgin Jeweler. All rights
          reserved. <br />
          From Overland Park To Kansas City And Beyond
        </p>
      </div>
      <div></div>
    </footer>
  )
}
