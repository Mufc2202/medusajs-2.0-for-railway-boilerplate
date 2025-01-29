import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-white lg:relative">
      <div className="flex flex-grow flex-col">
        <main className="flex flex-grow flex-col bg-white">
          <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0 pt-10 sm:pt-16">
              <Link href="/" className="inline-flex">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-12 w-auto"
                  src="https://dolgins-nextjs.s3.us-east-2.amazonaws.com/assets/logolong-text-blue-symbol-color.svg"
                  alt=""
                />
              </Link>
            </div>
            <div className="my-auto flex-shrink-0 py-16 sm:py-32">
              <p className="text-base font-semibold text-serif text-dolginsblue">
                404
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we couldn’t find the page you’re looking for.
              </p>
              <div className="mt-6">
                <a href="/" className="text-base font-medium text-dolginsblue">
                  Go back home
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </main>
        <footer className="flex-shrink-0 bg-gray-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <nav className="flex space-x-4">
              <Link
                href="tel:19132282808"
                className="text-sm font-medium text-gray-500 hover:text-gray-600"
              >
                Call
              </Link>
              <span
                className="inline-block border-l border-gray-300"
                aria-hidden="true"
              />
              <Link
                href="sms:19132282808"
                className="text-sm font-medium text-gray-500 hover:text-gray-600"
              >
                Text
              </Link>
            </nav>
          </div>
        </footer>
      </div>
      <div className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-1/2">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://s3.us-east-2.amazonaws.com/dolginsone/Clamp.jpg"
          alt=""
        />
      </div>
    </div>
  )
}
