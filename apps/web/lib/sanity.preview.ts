import { createClient } from "next-sanity";
import { sanityEnv } from "./env";

if (!sanityEnv.previewToken) {
  console.warn("[Velocity] SANITY_PREVIEW_TOKEN non défini — le mode preview sera indisponible.");
}

export const sanityPreviewClient = createClient({
  projectId: sanityEnv.projectId,
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: false,
  token: sanityEnv.previewToken,
  perspective: "previewDrafts",
});
