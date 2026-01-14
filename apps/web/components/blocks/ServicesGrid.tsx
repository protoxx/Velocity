type ServicesGridProps = {
  heading?: string;
  items?: string[];
};

export function ServicesGrid({ heading, items }: ServicesGridProps) {
  return (
    <section className="rounded-3xl bg-white/80 p-8 shadow shadow-zinc-100">
      {heading ? <h2 className="text-2xl font-semibold text-zinc-900">{heading}</h2> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items?.map((item) => (
          <article
            key={item}
            className="rounded-2xl border border-zinc-200 bg-white/60 p-5 text-zinc-700"
          >
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
