export function Tour() {
  return (
    <div>
      <main>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl py-4 px-4 sm:py-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-dolginsblue">
                Store Tour
              </h1>
              <p className="mt-1 text-4xl font-bold font-serif tracking-tight text-dolginslightblue sm:text-5xl lg:text-6xl">
                Testing
              </p>
              <p className="mx-auto mt-2 pb-3 max-w-xl text-xl text-gray-500 border-b-gold border-b-2">
                At Dolgins, we are small independent jeweler who aims to please.
                Here is some basic information on how we operate.
              </p>
            </div>
          </div>
        </div>
        <section className="mx-auto max-w-3xl text-base leading-7">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Awesome
          </h2>
          <p className="mt-6 text-xl leading-8">
            Dolgins has many clients who do not live within driving distance. We
            are capable of shipping our fine jewelry anywhere within the United
            States. We mostly ship via Fedex or USPS though do use other
            carriers too. All our jewelry is shipped insured through{" "}
            <a
              className="text-dolginslightblue"
              href="https://jewelersmutual.com"
            >
              Jewelers Mutual
            </a>
            . Someone over the age of 21 will have to sign for it.
          </p>
          <p className="mt-6 text-xl leading-8">
            The price of shipping varies from $50 to many thousands. We
            coordinate shipping when your jewelry is ready. And shipping is
            never free though some stores include it in the price.
          </p>
        </section>

        <section className="mx-auto max-w-3xl text-base leading-7">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Yes - Its awesome.
          </h2>
          <p className="mt-6 text-xl leading-8">
            At Dolgins, we love jewelry and want you to love yours. We accept
            returns and usually discuss the terms during the purchase because
            each case is unique. Often, we care more about executing someone's
            gesture or thought than getting the exact piece correct. In those
            circumstances, we want the surprise and can figure out the perfect
            piece later.
          </p>
          <p className="mt-6 text-xl leading-8">
            Dolgins is NOT a corporate entity either. While we do not want to be
            abused, we also know not all returns can happen within 30 days. We
            are happy to work reasonably and honestly.
          </p>
        </section>
      </main>
    </div>
  )
}

export default Tour
