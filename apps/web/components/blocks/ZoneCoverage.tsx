type ZoneCoverageProps = {
  heading?: string;
  coverageDescription?: string;
  serviceAreas?: string[];
};

export function ZoneCoverage({ heading, coverageDescription, serviceAreas }: ZoneCoverageProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/70 p-8">
      <div className="space-y-2">
        {heading ? <h2 className="text-2xl font-semibold text-zinc-900">{heading}</h2> : null}
        {coverageDescription ? <p className="text-zinc-600">{coverageDescription}</p> : null}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceAreas?.map((city) => (
          <div key={city} className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700">
            {city}
          </div>
        ))}
      </div>
    </section>
  );
}
