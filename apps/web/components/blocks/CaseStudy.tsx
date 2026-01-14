type CaseStudyProps = {
  heading?: string;
  richText?: string;
  metrics?: { label?: string; value?: string }[];
  gallery?: { asset?: { _ref?: string } }[];
};

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-zinc-100 text-sm text-zinc-500">
      {label}
    </div>
  );
}

export function CaseStudy({ heading, richText, metrics, gallery }: CaseStudyProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8">
      <div className="space-y-2">
        {heading ? <h2 className="text-2xl font-semibold text-zinc-900">{heading}</h2> : null}
        {richText ? <p className="text-zinc-600">{richText}</p> : null}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {metrics?.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="rounded-2xl bg-zinc-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{metric.label}</p>
              <p className="text-2xl font-semibold text-zinc-900">{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          {gallery?.length ? (
            gallery.map((_, index) => <ImagePlaceholder key={index} label={`Visuel ${index + 1}`} />)
          ) : (
            <ImagePlaceholder label="Visuel avant/après" />
          )}
        </div>
      </div>
    </section>
  );
}
