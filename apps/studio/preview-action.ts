import { EyeOpenIcon } from "@sanity/icons";
import type { DocumentActionComponent, SanityDocument } from "sanity";

const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET;
const previewBaseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function buildPreviewUrl(slug: string) {
  const safeSlug = slug || "accueil";
  const url = new URL("/api/preview", previewBaseUrl);
  if (previewSecret) {
    url.searchParams.set("secret", previewSecret);
  }
  url.searchParams.set("slug", safeSlug);
  return url.toString();
}

function getDocumentSlug(doc?: SanityDocument & { slug?: { current?: string } }) {
  return doc?.slug?.current || "accueil";
}

export const previewDocumentAction: DocumentActionComponent = (props) => {
  const doc = props.draft || props.published;

  if (props.type !== "page" || !doc) {
    return null;
  }

  if (!previewSecret) {
    console.warn("SANITY_PREVIEW_SECRET (ou SANITY_STUDIO_PREVIEW_SECRET) manquant : bouton Preview désactivé.");
    return null;
  }

  return {
    label: "Preview",
    icon: EyeOpenIcon,
    tone: "primary",
    onHandle: () => {
      const slug = getDocumentSlug(doc);
      const previewUrl = buildPreviewUrl(slug);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      props.onComplete();
    },
  };
};
