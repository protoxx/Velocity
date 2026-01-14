type FaqLocalProps = {
  heading?: string;
  faqs?: { question?: string; answer?: string }[];
};

export function FaqLocal({ heading, faqs }: FaqLocalProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-8">
      {heading ? <h2 className="text-2xl font-semibold text-zinc-900">{heading}</h2> : null}
      <div className="mt-6 space-y-3">
        {faqs?.map((faq, index) => (
          <details key={`${faq.question}-${index}`} className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
            <summary className="cursor-pointer text-base font-semibold text-zinc-900">{faq.question}</summary>
            {faq.answer ? <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p> : null}
          </details>
        ))}
      </div>
    </section>
  );
}
