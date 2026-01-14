import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPageBySlug } from "@/lib/page-service";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PreviewPageProps = {
  params: {
    slug: string;
  };
};

const slugToPublicPath = (slug: string) => (slug === "accueil" ? "/" : `/${slug}`);

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { isEnabled } = draftMode();
  if (!isEnabled) {
    redirect(slugToPublicPath(params.slug));
  }

  const page = await getPageBySlug(params.slug, { preview: true });

  if (!page) {
    notFound();
  }

  const exitUrl = `/api/exit-preview?slug=${page.slug}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6 md:py-16">
      <div className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">Mode preview</p>
          <p className="text-base font-semibold">Tu visualises les brouillons Sanity en direct.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Link
            href={exitUrl}
            prefetch={false}
            className="rounded-full bg-amber-900 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-amber-900/20"
          >
            Quitter le preview
          </Link>
          <Link
            href={slugToPublicPath(page.slug)}
            className="rounded-full border border-amber-900 px-4 py-2 text-center text-sm font-semibold text-amber-900"
          >
            Voir la version live
          </Link>
        </div>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Prévisualisation</p>
        <h1 className="text-3xl font-semibold text-zinc-900">{page.title}</h1>
      </header>

      <BlockRenderer blocks={page.content} />
    </main>
  );
}
