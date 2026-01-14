import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { schemaTypes, deskStructure } from "@velocity/schema";
import { previewDocumentAction } from "./preview-action";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET (or SANITY_PROJECT_ID / SANITY_DATASET) env vars"
  );
}

export default defineConfig({
  name: "velocity-studio",
  title: "Velocity CMS",
  projectId,
  dataset,
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "page" && previewDocumentAction) {
        return [...prev, previewDocumentAction];
      }
      return prev;
    },
  },
});
