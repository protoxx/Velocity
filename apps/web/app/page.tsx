import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Block } from "@/types/blocks";
import { getPageBySlug } from "@/lib/page-service";
import { draftMode } from "next/headers";

const FALLBACK_BLOCKS: Block[] = [
  {
    _key: "fallback-hero",
    _type: "heroLocal",
    eyebrow: "Agence web locale",
    heading: "Velocity accompagne votre commerce de quartier",
    subheading: "Sites vitrines optimisés SEO, formulaires connectés et contenus prêts à l'emploi.",
    primaryCta: { label: "Parler à un expert", href: "/contact" },
    secondaryCta: { label: "Voir des exemples", href: "/faq" },
    highlights: ["Pages essentielles prêtes en 48h", "Gestion simplifiée via Sanity", "Conversion mobile-first"],
  },
  {
    _key: "fallback-services",
    _type: "servicesGrid",
    title: "Ce que nous livrons par défaut",
    introduction: "Chaque site Velocity inclut les sections indispensables pour convertir vos prospects locaux.",
    services: [
      { title: "Accueil storytelling", description: "Hero convaincant, preuves sociales et CTA vers le contact." },
      { title: "Services & zone", description: "Cartographie de votre aire d'intervention et détails des prestations." },
      { title: "FAQ locale", description: "Réponses SEO-friendly aux questions les plus recherchées." },
    ],
  },
  {
    _key: "fallback-cta",
    _type: "ctaContact",
    heading: "Besoin d'automatiser votre prochaine vitrine ?",
    description: "Velocity synchronise Sanity, Next.js et Vercel pour industrialiser vos sites locaux.",
    primaryAction: { label: "Demander une démo", href: "/contact" },
    secondaryAction: { label: "Process complet", href: "/faq" },
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
