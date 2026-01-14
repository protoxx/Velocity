type CtaContactProps = {
  heading?: string;
  primaryCta?: string;
  secondaryCta?: string;
};

export function CtaContact({ heading, primaryCta, secondaryCta }: CtaContactProps) {
  return (
    <section className="rounded-3xl bg-amber-400 p-8 text-zinc-900">
      {heading ? <h2 className="text-3xl font-semibold">{heading}</h2> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {primaryCta ? (
          <button className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white">
            {primaryCta}
          </button>
        ) : null}
        {secondaryCta ? (
          <button className="rounded-full border border-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide">
            {secondaryCta}
          </button>
        ) : null}
      </div>
    </section>
  );
}
