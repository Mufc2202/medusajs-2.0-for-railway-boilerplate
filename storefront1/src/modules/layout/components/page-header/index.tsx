export default function PageHeader(props: any) {
  return (
    <section>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-4 px-4 sm:py-4">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-dolginsblue capitalize">
              {props.name}
            </h1>
            <p className="mt-1 text-4xl font-bold font-serif tracking-tight text-dolginslightblue sm:text-5xl lg:text-6xl">
              {props.subtitle}
            </p>
            <p className="mx-auto mt-2 pb-3 max-w-xl text-xl text-gray-500 border-b-gold border-b-2 capitalize">
              {props.tidbit}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
