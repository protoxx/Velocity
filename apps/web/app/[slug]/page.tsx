import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getAllPageSlugs, getPageBySlug } from "@/lib/page-service";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) {
    return { title: "Page introuvable | Velocity" };
  }

  return {
    title: `${page.title} | Velocity`,
    description: `Parcours local Velocity pour ${page.title}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { isEnabled } = draftMode();
  const page = await getPageBySlug(params.slug, { preview: isEnabled });

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 p-6 md:py-16">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Pages locales</p>
        <h1 className="text-3xl font-semibold text-zinc-900">{page.title}</h1>
      </header>
      <BlockRenderer blocks={page.content} />
    </main>
  );
}
