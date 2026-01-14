import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { BlockDocument } from "@/types/blocks";
import { getPageBySlug } from "@/lib/page-service";
import { draftMode } from "next/headers";

const FALLBACK_BLOCKS: BlockDocument[] = [
  {
    _id: "fallback-hero",
    blockType: "heroLocal",
    data: {
      heading: "Velocity accompagne votre commerce de quartier",
      subheading: "Sites vitrines optimisés SEO, formulaires connectés et contenus prêts à l'emploi.",
      primaryCta: "Parler à un expert",
      secondaryCta: "Voir des exemples",
    },
  },
  {
    _id: "fallback-services",
    blockType: "servicesGrid",
    data: {
      heading: "Ce que nous livrons par défaut",
      subheading: "Chaque site Velocity inclut les sections indispensables pour convertir vos prospects locaux.",
      items: [
        "Accueil storytelling avec CTA contact",
        "Services & zone d'intervention détaillés",
        "FAQ locale optimisée SEO",
      ],
    },
  },
  {
    _id: "fallback-cta",
    blockType: "ctaContact",
    data: {
      heading: "Besoin d'automatiser votre prochaine vitrine ?",
      subheading: "Velocity synchronise Sanity, Next.js et Vercel pour industrialiser vos sites locaux.",
      primaryCta: "Demander une démo",
      secondaryCta: "Process complet",
    },
  },
];

export default async function HomePage() {
  const { isEnabled } = draftMode();
  const page = await getPageBySlug("accueil", { preview: isEnabled });

  const title = page?.title ?? "Velocity — Starter local";
  const blocks = page?.content?.length ? page.content : FALLBACK_BLOCKS;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 p-6 md:py-16">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Pages locales</p>
        <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
        {!page && (
          <p className="text-sm text-zinc-500">
            Contenu par défaut affiché en attendant le seed Sanity (`pnpm seed:dataset`). Les audits Lighthouse peuvent maintenant
            tourner sans dépendre du CMS.
          </p>
        )}
      </header>
      <BlockRenderer blocks={blocks} />
    </main>
  );
}
