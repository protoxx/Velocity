import type { SiteSettings } from "@/types/site";

type SiteFooterProps = {
  settings?: SiteSettings | null;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/30 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Velocity</p>
          <p className="text-lg font-semibold text-zinc-900">{settings?.brandName || "Agence Velocity"}</p>
        </div>
        <div className="space-y-1 text-sm">
          {settings?.address ? <p>{settings.address}</p> : null}
          {settings?.phone ? (
            <a href={`tel:${settings.phone}`} className="text-zinc-900 hover:underline">
              {settings.phone}
            </a>
          ) : null}
          {settings?.contactEmail ? (
            <a href={`mailto:${settings.contactEmail}`} className="text-zinc-900 hover:underline">
              {settings.contactEmail}
            </a>
          ) : null}
        </div>
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} Velocity — Sites locaux performants.</p>
      </div>
    </footer>
  );
}
