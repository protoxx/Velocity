type LocalProofProps = {
  heading?: string;
  items?: string[];
};

export function LocalProof({ heading, items }: LocalProofProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
      {heading ? <h2 className="text-2xl font-semibold">{heading}</h2> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items?.map((item, index) => (
          <blockquote key={`${item}-${index}`} className="rounded-2xl border border-white/10 p-5 text-sm leading-relaxed">
            “{item}”
          </blockquote>
        ))}
      </div>
    </section>
  );
}
