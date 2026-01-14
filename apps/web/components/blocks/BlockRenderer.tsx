import { HeroLocal } from "@/components/blocks/HeroLocal";
import { ServicesGrid } from "@/components/blocks/ServicesGrid";
import { LocalProof } from "@/components/blocks/LocalProof";
import { CtaContact } from "@/components/blocks/CtaContact";
import { ZoneCoverage } from "@/components/blocks/ZoneCoverage";
import { CaseStudy } from "@/components/blocks/CaseStudy";
import { FaqLocal } from "@/components/blocks/FaqLocal";
import { AboutLocal } from "@/components/blocks/AboutLocal";
import { ContactMap } from "@/components/blocks/ContactMap";
import { LegalLinks } from "@/components/blocks/LegalLinks";
import { StickyActions } from "@/components/blocks/StickyActions";
import type { BlockDocument } from "@/types/blocks";

const components = {
  heroLocal: HeroLocal,
  servicesGrid: ServicesGrid,
  localProof: LocalProof,
  faqLocal: FaqLocal,
  ctaContact: CtaContact,
  zoneCoverage: ZoneCoverage,
  caseStudy: CaseStudy,
  aboutLocal: AboutLocal,
  contactMap: ContactMap,
  legalLinks: LegalLinks,
  stickyActions: StickyActions,
} as const;

export function BlockRenderer({ blocks }: { blocks?: BlockDocument[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block) => {
        const Component = components[block.blockType as keyof typeof components];
        if (!Component) {
          return (
            <div key={block._id} className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Bloc non supporté : {block.blockType}
            </div>
          );
        }
        return (
          <Component
            key={block._id}
            {...(block.data || {})}
            blockId={block._id}
          />
        );
      })}
    </div>
  );
}
