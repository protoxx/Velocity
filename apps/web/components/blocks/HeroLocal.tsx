type HeroLocalProps = {
  heading?: string;
  subheading?: string;
  primaryCta?: string;
  secondaryCta?: string;
  blockId?: string;
};

export function HeroLocal({ heading, subheading, primaryCta, secondaryCta }: HeroLocalProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-white/70 p-10 shadow-lg shadow-zinc-200">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Velocity</p>
        <h1 className="text-4xl font-semibold text-zinc-900 md:text-5xl">{heading}</h1>
        {subheading ? <p className="text-lg text-zinc-600">{subheading}</p> : null}
      </div>
      <div className="flex flex-wrap gap-3">
        {primaryCta ? (
          <button className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white">
            {primaryCta}
          </button>
        ) : null}
        {secondaryCta ? (
          <button className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-900">
            {secondaryCta}
          </button>
        ) : null}
      </div>
    </section>
  );
}
