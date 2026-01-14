type ContactMapProps = {
  heading?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
};

export function ContactMap({ heading, address, phone, email, mapUrl }: ContactMapProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8">
      {heading ? <h2 className="text-2xl font-semibold text-zinc-900">{heading}</h2> : null}
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-3 text-sm text-zinc-600">
          {address ? (
            <p>
              <span className="font-semibold text-zinc-900">Adresse :</span>
              <br />
              {address}
            </p>
          ) : null}
          {phone ? (
            <p>
              <span className="font-semibold text-zinc-900">Téléphone :</span>
              <br />
              <a className="text-indigo-600" href={`tel:${phone}`}>
                {phone}
              </a>
            </p>
          ) : null}
          {email ? (
            <p>
              <span className="font-semibold text-zinc-900">Email :</span>
              <br />
              <a className="text-indigo-600" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          ) : null}
        </div>
        <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          {mapUrl ? (
            <iframe
              title="Carte"
              src={mapUrl}
              className="h-full w-full"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Ajouter une URL Google Maps pour prévisualiser la carte.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
