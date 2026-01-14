type LegalLinksProps = {
  heading?: string;
  legalLinks?: { label?: string; url?: string }[];
};

export function LegalLinks({ heading, legalLinks }: LegalLinksProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6">
      {heading ? <h2 className="text-xl font-semibold text-zinc-900">{heading}</h2> : null}
      <ul className="mt-4 space-y-2 text-sm text-zinc-600">
        {legalLinks?.map((link, index) => (
          <li key={`${link.label}-${index}`}>
            {link?.url ? (
              <a className="text-indigo-600" href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ) : (
              link.label
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
