type AboutLocalProps = {
  heading?: string;
  richText?: string;
  certifications?: { asset?: { _ref?: string } }[];
};

export function AboutLocal({ heading, richText, certifications }: AboutLocalProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-zinc-900 p-8 text-white">
      {heading ? <h2 className="text-3xl font-semibold">{heading}</h2> : null}
      {richText ? <p className="text-zinc-200">{richText}</p> : null}
      {certifications?.length ? (
        <div className="flex flex-wrap gap-3">
          {certifications.map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">
              Label #{index + 1}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
