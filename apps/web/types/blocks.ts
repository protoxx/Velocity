export type BlockType =
  | "heroLocal"
  | "servicesGrid"
  | "localProof"
  | "faqLocal"
  | "ctaContact"
  | "zoneCoverage"
  | "caseStudy"
  | "aboutLocal"
  | "contactMap"
  | "legalLinks"
  | "stickyActions";

export interface BlockDocument {
  _id: string;
  blockType: BlockType;
  data?: {
    heading?: string;
    subheading?: string;
    items?: string[];
    primaryCta?: string;
    secondaryCta?: string;
    serviceAreas?: string[];
    coverageDescription?: string;
    metrics?: { label?: string; value?: string }[];
    gallery?: { asset?: { _ref?: string } }[];
    faqs?: { question?: string; answer?: string }[];
    richText?: string;
    certifications?: { asset?: { _ref?: string } }[];
    address?: string;
    lat?: number;
    lng?: number;
    phone?: string;
    email?: string;
    mapUrl?: string;
    legalLinks?: { label?: string; url?: string }[];
    actions?: { label?: string; type?: "call" | "sms" | "whatsapp" | "link"; href?: string }[];
  };
}

export interface PageDocument {
  _id: string;
  title: string;
  slug: string;
  content?: BlockDocument[];
}
