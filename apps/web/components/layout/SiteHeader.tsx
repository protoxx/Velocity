"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationPage } from "@/types/site";

type SiteHeaderProps = {
  brandName?: string;
  navigation: NavigationPage[];
  phone?: string;
  contactEmail?: string;
};

const slugToHref = (slug: string) => (slug === "accueil" ? "/" : `/${slug}`);

function NavLinks({ navigation }: { navigation: NavigationPage[] }) {
  const pathname = usePathname() || "/";

  if (!navigation.length) return null;

  return (
    <>
      {navigation.map((page) => {
        const href = slugToHref(page.slug);
        const isActive =
          page.slug === "accueil"
            ? pathname === "/" || pathname === "/accueil"
            : pathname === `/${page.slug}`;

        return (
          <Link
            key={page._id}
            href={href}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {page.title}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader({ brandName, navigation, phone, contactEmail }: SiteHeaderProps) {
  const secondaryLine = phone || contactEmail || "hello@velocity.local";

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight text-zinc-900">
            {brandName || "Velocity"}
          </Link>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Agence web locale</p>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLinks navigation={navigation} />
        </nav>

        <div className="md:text-right">
          <p className="text-[11px] uppercase tracking-[0.45em] text-zinc-500">Contact</p>
          <p className="text-sm font-medium text-zinc-900">{secondaryLine}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-6 pb-4 md:hidden">
        <NavLinks navigation={navigation} />
      </div>
    </header>
  );
}
